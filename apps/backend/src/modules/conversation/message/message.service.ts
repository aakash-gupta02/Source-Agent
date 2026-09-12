import { StatusCodes } from "http-status-codes";

import ApiError from "../../../shared/utils/ApiError.js";

import {
  PaginationQuery,
  UserCreateMessageInput,
} from "@repo/shared/validations";
import { MessageDto } from "@repo/shared/types";
import { db } from "@repo/db/client";
import { AuthContext } from "../../../shared/types/auth.type.js";
import { MessageRole, Prisma } from "@repo/db";
import { encodeCursor } from "../../../shared/utils/cursor.js";
import { buildCursorFilter } from "../../../shared/pagination/buildCursorFilter.js";
import { decrypt } from "../../../shared/utils/encryption/encryption.js";
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

// User create a message
export const userCreateMessageService = async (
  payload: UserCreateMessageInput,
  userId: AuthContext["userId"],
  conversationId: string,
): Promise<MessageDto> => {
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

  // TODO: title check & AI generated title

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

  const result = await agent.invoke(conversationId, messages);

  const lastMessage = result.messages.at(-1);

  if (!lastMessage || typeof lastMessage.content !== "string") {
    throw new Error("Invalid assistant response");
  }

  const assistantMessage = await createAssistantMessageService(
    conversationId,
    lastMessage.content,
  );

  return assistantMessage;
};

export const listMessagesService = async (
  conversationId: string,
  userId: AuthContext["userId"],
  query: PaginationQuery,
) => {
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
    messages,
    meta: {
      hasNextPage,
      nextCursor,
    },
  };
};

const createAssistantMessageService = async (
  conversationId: string,
  content: string,
): Promise<MessageDto> => {
  return Message.create({
    data: {
      conversationId,
      role: MessageRole.ASSISTANT,
      content,
    },
  });
};
