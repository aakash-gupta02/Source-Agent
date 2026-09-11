import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import CatchAsync from "../../../shared/utils/CatchAsync.js";
import sendResponse from "../../../shared/utils/ApiResponse.js";
import {
  listMessagesService,
  userCreateMessageService,
} from "./message.service.js";
import {
  ConversationIdParamsInput,
  PaginationQuery,
  UserCreateMessageInput,
} from "@repo/shared/validations";

export const createMessage = CatchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { id: conversationId } =
    req.params as unknown as ConversationIdParamsInput;
  const content: UserCreateMessageInput = req.body;

  const message = await userCreateMessageService(
    content,
    userId,
    conversationId,
  );

  sendResponse(
    res,
    StatusCodes.CREATED,
    "Message created successfully",
    message,
  );
});

export const listMessages = CatchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { id: conversationId } =
    req.params as unknown as ConversationIdParamsInput;
  const query = req.query as unknown as PaginationQuery;

  const messages = await listMessagesService(conversationId, userId, query);

  sendResponse(res, StatusCodes.OK, "Messages listed successfully", messages);
});
