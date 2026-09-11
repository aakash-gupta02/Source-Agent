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
  });

  if (!conversation) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Conversation not found");
  }

  // TODO: title check & Ai generated title generation

  const message = await Message.create({
    data: {
      ...payload,
      conversationId,
      role: MessageRole.USER,
    },
  });

  return message;
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
