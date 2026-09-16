import { StatusCodes } from "http-status-codes";

import ApiError from "../../../shared/utils/ApiError.js";

import {
  PaginationQuery,
  UserCreateMessageInput,
} from "@repo/shared/validations";
import {
  MessageDto,
  MessageDtoWithMetadata,
  MessageListDto,
  MessageMetadata,
  StreamEvent,
} from "@repo/shared/types";
import { db } from "@repo/db/client";
import { AuthContext } from "../../../shared/types/auth.type.js";
import { MessageRole, Prisma } from "@repo/db";
import { encodeCursor } from "../../../shared/utils/cursor.js";
import { buildCursorFilter } from "../../../shared/pagination/buildCursorFilter.js";
import { decrypt } from "../../../shared/utils/encryption/encryption.js";
import { AIMessage, ToolMessage } from "@langchain/core/messages";
import {
  createModel,
  createPostgresConnection,
  createSqlAgent,
  generateTitle,
} from "@repo/agent";
import {
  buildPostgresConnectionString,
  DatabaseCredentials,
} from "../../../shared/utils/atabase/connectionString.js";

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

  const decryptedAi = decrypt(
    conversation.aiProvider.credentials,
    conversation.aiProvider.keyVersion,
  );

  const decryptedDatabase = decrypt(
    conversation.databaseConnection.credentials,
    conversation.databaseConnection.keyVersion,
  );

  const databaseCredentials = JSON.parse(
    decryptedDatabase,
  ) as DatabaseCredentials;

  const llm = createModel({
    provider: conversation.aiProvider.provider,
    model: conversation.aiProvider.model,
    credentials: decryptedAi,
  });

  const pool = createPostgresConnection(
    buildPostgresConnectionString(databaseCredentials),
  );

  if (!conversation.title) {
    const title = await generateTitle(llm, payload.content);

    console.log("title", title);

    await Conversation.update({
      where: { id: conversationId },
      data: { title },
    });
  }

  const agent = createSqlAgent({
    llm,
    pool,
  });

  const stream = await agent.stream(conversationId, messages);

  let assistantContent = "";
  const toolExecutions: {
    id?: string;
    name: string;
    startedAt: number;
    durationMs?: number;
  }[] = [];

  for await (const [mode, data] of stream) {
    console.log("========== STREAM CHUNK ==========");
    console.log("MODE:", mode);
    console.dir(data, { depth: null });
  
    if (mode === "updates") {
      const interrupts = data.__interrupt__;
  
      if (interrupts?.length) {
        for (const interrupt of interrupts) {
          const approval = interrupt.value;
  
          if (approval?.type === "sql_approval") {
            yield {
              type: "approval_required",
              approval,
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

  await createAssistantMessageService(
    conversationId,
    assistantContent,
    metadata,
  );

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
