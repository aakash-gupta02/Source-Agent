import { StatusCodes } from "http-status-codes";

import ApiError from "../../shared/utils/ApiError.js";

import {
  CreateConversationInput,
  UpdateConversationInput,
} from "@repo/shared/validations";
import { ConversationDto, ConversationListDto } from "@repo/shared/types";
import { db } from "@repo/db/client";
import { AuthContext } from "../../shared/types/auth.type.js";

const Conversation = db.conversation;

// Create a new conversation
export const createConversationService = async (
  payload: CreateConversationInput,
  userId: AuthContext["userId"],
): Promise<ConversationDto> => {
  const { databaseConnectionId, aiProviderId } = payload;

  const [databaseConnection, aiProvider] = await Promise.all([
    db.databaseConnection.findFirst({
      where: { id: databaseConnectionId, userId },
    }),
    db.aIProvider.findFirst({
      where: { id: aiProviderId, userId },
    }),
  ]);

  if (!databaseConnection) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Database connection not found");
  }

  if (!aiProvider) {
    throw new ApiError(StatusCodes.NOT_FOUND, "AI provider not found");
  }

  return Conversation.create({
    data: {
      ...payload,
      userId,
    },
  });
};

// Update a conversation
export const updateConversationService = async (
  id: string,
  payload: UpdateConversationInput,
  userId: AuthContext["userId"],
): Promise<ConversationDto> => {
  const conversation = await Conversation.findFirst({
    where: { id, userId },
  });

  if (!conversation) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Conversation not found");
  }

  const updatedConver = await Conversation.update({
    where: { id },
    data: payload,
  });
  return updatedConver;
};

// Delete a conversation
export const deleteConversationService = async (
  id: string,
  userId: AuthContext["userId"],
): Promise<void> => {
  const conversation = await Conversation.findFirst({
    where: { id, userId },
  });

  if (!conversation) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Conversation not found");
  }

  await Conversation.delete({ where: { id } });
};

// Get a conversation
export const getConversationService = async (
  id: string,
  userId: AuthContext["userId"],
): Promise<ConversationDto> => {
  const conversation = await Conversation.findFirst({
    where: { id, userId },
  });

  if (!conversation) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Conversation not found");
  }

  return conversation;
};

// List conversations
export const listConversationsService = async (
  userId: AuthContext["userId"],
): Promise<ConversationListDto[]> => {
  const conversations = await Conversation.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
    },
  });

  return conversations;
};
