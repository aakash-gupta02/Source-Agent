import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import {
  CreateConversationInput,
  UpdateConversationInput,
  ConversationIdParamsInput,
} from "@repo/shared/validations";

import {
  createConversationService,
  updateConversationService,
  deleteConversationService,
  getConversationService,
  listConversationsService,
} from "./conversation.service.js";

import CatchAsync from "../../shared/utils/CatchAsync.js";
import sendResponse from "../../shared/utils/ApiResponse.js";

// Create Conversation
export const createConversation = CatchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.user;
    const payload: CreateConversationInput = req.body;

    const conversation = await createConversationService(payload, userId);

    sendResponse(
      res,
      StatusCodes.CREATED,
      "Conversation created successfully",
      conversation,
    );
  },
);

// Update Conversation
export const updateConversation = CatchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.user;
    const { id } = req.params as ConversationIdParamsInput;
    const payload: UpdateConversationInput = req.body;

    const conversation = await updateConversationService(id, payload, userId);

    sendResponse(
      res,
      StatusCodes.OK,
      "Conversation updated successfully",
      conversation,
    );
  },
);

// Delete Conversation
export const deleteConversation = CatchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.user;
    const { id } = req.params as ConversationIdParamsInput;

    await deleteConversationService(id, userId);

    sendResponse(
      res,
      StatusCodes.NO_CONTENT,
      "Conversation deleted successfully",
    );
  },
);

// List Conversations
export const listConversations = CatchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.user;

    const conversations = await listConversationsService(userId);

    sendResponse(
      res,
      StatusCodes.OK,
      "Conversations listed successfully",
      conversations,
    );
  },
);

// Get Conversation
export const getConversation = CatchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.user;
    const { id } = req.params as ConversationIdParamsInput;

    const conversation = await getConversationService(id, userId);

    sendResponse(
      res,
      StatusCodes.OK,
      "Conversation fetched successfully",
      conversation,
    );
  },
);
