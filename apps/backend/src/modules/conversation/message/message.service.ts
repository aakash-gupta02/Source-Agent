import { StatusCodes } from "http-status-codes";

import ApiError from "../../../shared/utils/ApiError.js";

import {
  PaginationQuery,
  ResumeMessageInput,
  UserCreateMessageInput,
} from "@repo/shared/validations";
import {
  MessageDto,
  MessageDtoWithMetadata,
  MessageListDto,
  MessageMetadata,
  SqlApproval,
  StreamEvent,
  updateAssistantMessageInput,
} from "@repo/shared/types";
import { db } from "@repo/db/client";
import { AuthContext } from "../../../shared/types/auth.type.js";
import { MessageRole, Prisma } from "@repo/db";
import { encodeCursor } from "../../../shared/utils/cursor.js";
import { buildCursorFilter } from "../../../shared/pagination/buildCursorFilter.js";
import { AIMessage, ToolMessage } from "@langchain/core/messages";
import { INTERRUPT, isInterrupted } from "@langchain/langgraph";
import {
  generateTitle,
} from "@repo/agent";
import { createConversationAgent, ToolExecution } from "./message.helper.js";

const Message = db.message;
const Conversation = db.conversation;

//#region helper
const toMessageDtoWithMetadata = (message: {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  createdAt: Date;
  metadata: Prisma.JsonValue;
}): MessageDtoWithMetadata => ({
  id: message.id,
  conversationId: message.conversationId,
  role: message.role,
  content: message.content,
  createdAt: message.createdAt,
  metadata: toMessageMetadata(message.metadata),
});

const isSqlApproval = (value: unknown): value is SqlApproval =>
  typeof value === "object" &&
  value !== null &&
  "type" in value &&
  value.type === "sql_approval" &&
  "sql" in value &&
  typeof value.sql === "string";

const toMessageMetadata = (
  metadata: Prisma.JsonValue,
): MessageMetadata | undefined => {
  if (
    metadata == null ||
    typeof metadata !== "object" ||
    Array.isArray(metadata)
  ) {
    return undefined;
  }

  return metadata as MessageMetadata;
};

const createAssistantMessageService = async (
  conversationId: string,
  content: string,
  metadata?: MessageMetadata,
): Promise<MessageDto> => {
  return Message.create({
    data: {
      conversationId,
      role: MessageRole.ASSISTANT,
      content,
      metadata: metadata as Prisma.InputJsonValue | undefined,
    },
  });
};

const updateAssistantMessageService = async (
  messageId: string,
  data: updateAssistantMessageInput,
): Promise<MessageDto> => {
  const message = await Message.findUnique({
    where: {
      id: messageId,
    },
    select: {
      metadata: true,
    },
  });

  if (!message) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Message not found");
  }

  const existingMetadata = (message.metadata ?? {}) as MessageMetadata;

  const metadata: MessageMetadata = {
    ...existingMetadata,
    ...data.metadata,
    ...(data.metadata?.tools && {
      tools: [...(existingMetadata.tools ?? []), ...data.metadata.tools],
    }),
  };

  return Message.update({
    where: {
      id: messageId,
    },
    data: {
      content: data.content,
      metadata: metadata as Prisma.InputJsonValue,
    },
  });
};
//#endregion

// User create a message
export const userCreateMessageService = async function* (
  payload: UserCreateMessageInput,
  userId: AuthContext["userId"],
  conversationId: string,
): AsyncGenerator<StreamEvent> {
  const conversation = await Conversation.findFirst({
    where: {
      id: conversationId,
      userId,
    },
    include: {
      databaseConnection: {
        select: {
          keyVersion: true,
          credentials: true,
        },
      },
      aiProvider: {
        select: {
          keyVersion: true,
          credentials: true,
          provider: true,
          model: true,
        },
      },
    },
  });

  if (!conversation) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Conversation not found");
  }

  await Message.create({
    data: {
      ...payload,
      conversationId,
      role: MessageRole.USER,
    },
  });

  const messages = await Message.findMany({
    where: { conversationId },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    select: {
      content: true,
      role: true,
    },
  });

  const { agent, llm } = await createConversationAgent(conversation);

  if (!conversation.title) {
    const title = await generateTitle(llm, payload.content);

    await Conversation.update({
      where: { id: conversationId },
      data: { title },
    });
  }

  const assistantMessage = await createAssistantMessageService(
    conversationId,
    "",
    {
      model: {
        provider: conversation.aiProvider.provider,
        name: conversation.aiProvider.model,
      },
      tools: [],
    },
  );

  const stream = await agent.stream(
    conversationId,
    messages,
    assistantMessage.id,
  );

  let assistantContent = "";
  const toolExecutions: ToolExecution[] = [];
  let interrupted = false;

  for await (const [mode, data] of stream) {
    if (mode === "updates") {
      if (isInterrupted<SqlApproval>(data)) {
        for (const item of data[INTERRUPT]) {
          if (isSqlApproval(item.value)) {
            interrupted = true;
            
            yield {
              type: "approval_required",
              approval: item.value,
            };
          }
        }
      }

      continue;
    }

    if (mode !== "messages") continue;

    const [messageChunk] = data;

    // AI requested a tool
    if (AIMessage.isInstance(messageChunk) && messageChunk.tool_calls?.length) {
      for (const toolCall of messageChunk.tool_calls) {
        toolExecutions.push({
          id: toolCall.id,
          name: toolCall.name,
          startedAt: Date.now(),
        });

        yield {
          type: "tool_start",
          tool: toolCall.name,
        };
      }
    }

    // Tool completed
    if (ToolMessage.isInstance(messageChunk)) {
      const execution = toolExecutions.find((tool) =>
        tool.id
          ? tool.id === messageChunk.tool_call_id
          : tool.name === messageChunk.name,
      );

      if (execution) {
        execution.durationMs = Date.now() - execution.startedAt;
      }

      if (messageChunk.name) {
        yield {
          type: "tool_end",
          tool: messageChunk.name,
        };
      }

      continue;
    }

    // Normal AI response
    if (!AIMessage.isInstance(messageChunk)) continue;

    if (typeof messageChunk.content !== "string") continue;

    const content = messageChunk.content;

    if (!content) continue;

    assistantContent += content;

    yield {
      type: "message",
      content,
    };
  }

  const metadata: MessageMetadata = {
    model: {
      provider: conversation.aiProvider.provider,
      name: conversation.aiProvider.model,
    },
    ...(toolExecutions.length > 0 && {
      tools: toolExecutions.map((tool) => ({
        name: tool.name,
        durationMs: tool.durationMs,
      })),
    }),
  };

  if (interrupted) {
    await updateAssistantMessageService(assistantMessage.id, {
      metadata,
    });
    return;
  }

  await updateAssistantMessageService(assistantMessage.id, {
    content: assistantContent,
    metadata,
  });

  yield {
    type: "done",
  };
};

// Resume an interrupted message
export const resumeMessageService = async function* (
  payload: ResumeMessageInput,
  userId: AuthContext["userId"],
  conversationId: string,
): AsyncGenerator<StreamEvent> {
  const conversation = await Conversation.findFirst({
    where: {
      id: conversationId,
      userId,
    },
    include: {
      databaseConnection: {
        select: {
          keyVersion: true,
          credentials: true,
        },
      },
      aiProvider: {
        select: {
          keyVersion: true,
          credentials: true,
          provider: true,
          model: true,
        },
      },
    },
  });

  if (!conversation) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Conversation not found");
  }

  const { agent } = await createConversationAgent(conversation);

  const state = await agent.getState(conversationId);

  const assistantMessageId = state.values.assistantMessageId;

  if (!assistantMessageId) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Assistant message not found in graph state",
    );
  }

  const assistantMessage = await Message.findUnique({
    where: {
      id: assistantMessageId,
      conversationId,
    },
    select: {
      content: true,
      metadata: true,
    },
  });

  if (!assistantMessage) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Assistant message not found");
  }

  let assistantContent = assistantMessage.content;

  const existingMetadata = (assistantMessage.metadata ?? {}) as MessageMetadata;

  const existingTools = existingMetadata.tools ?? [];

  const toolExecutions: ToolExecution[] = [];

  const stream = await agent.resume(conversationId, payload);

  for await (const [mode, data] of stream) {
    if (mode === "updates") {
      if (isInterrupted<SqlApproval>(data)) {
        for (const item of data[INTERRUPT]) {
          if (isSqlApproval(item.value)) {
            yield {
              type: "approval_required",
              approval: item.value,
            };
          }
        }
      }

      continue;
    }

    if (mode !== "messages") continue;

    const [messageChunk] = data;

    // AI requested a tool
    if (AIMessage.isInstance(messageChunk) && messageChunk.tool_calls?.length) {
      for (const toolCall of messageChunk.tool_calls) {
        toolExecutions.push({
          id: toolCall.id,
          name: toolCall.name,
          startedAt: Date.now(),
        });

        yield {
          type: "tool_start",
          tool: toolCall.name,
        };
      }
    }

    // Tool completed
    if (ToolMessage.isInstance(messageChunk)) {
      const execution = toolExecutions.find(
        (tool) => tool.id === messageChunk.tool_call_id,
      );

      if (execution) {
        execution.durationMs = Date.now() - execution.startedAt;
      }

      if (messageChunk.name) {
        yield {
          type: "tool_end",
          tool: messageChunk.name,
        };
      }

      continue;
    }

    // Normal AI response
    if (!AIMessage.isInstance(messageChunk)) continue;

    if (typeof messageChunk.content !== "string") continue;

    const content = messageChunk.content;

    if (!content) continue;

    assistantContent += content;

    yield {
      type: "message",
      content,
    };
  }

  const metadata: MessageMetadata = {
    model: {
      provider: conversation.aiProvider.provider,
      name: conversation.aiProvider.model,
    },
    tools: [
      ...existingTools,
      ...toolExecutions.map((tool) => ({
        name: tool.name,
        durationMs: tool.durationMs,
      })),
    ],
  };

  await updateAssistantMessageService(assistantMessageId, {
    content: assistantContent,
    metadata,
  });

  yield {
    type: "done",
  };
};

export const listMessagesService = async (
  conversationId: string,
  userId: AuthContext["userId"],
  query: PaginationQuery,
): Promise<MessageListDto> => {
  const where: Prisma.MessageWhereInput = {
    AND: [
      buildCursorFilter(query.cursor),

      {
        conversation: {
          id: conversationId,
          userId,
        },
      },
    ],
  };

  const messages = await Message.findMany({
    where,
    take: query.limit + 1,
    orderBy: [
      {
        createdAt: query.sortOrder,
      },
      {
        id: query.sortOrder,
      },
    ],
  });

  const hasNextPage = messages.length > query.limit;

  if (hasNextPage) {
    messages.pop();
  }

  const nextCursor = hasNextPage
    ? encodeCursor({
        createdAt: messages.at(-1)!.createdAt.toISOString(),
        id: messages.at(-1)!.id,
      })
    : null;

  return {
    messages: messages.map(toMessageDtoWithMetadata),
    meta: {
      hasNextPage,
      nextCursor,
    },
  };
};