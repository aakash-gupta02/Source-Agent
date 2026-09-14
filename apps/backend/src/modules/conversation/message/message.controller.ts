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

  // SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const stream = userCreateMessageService(content, userId, conversationId);

  for await (const event of stream) {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  }

  res.end();
});

export const listMessages = CatchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { id: conversationId } =
    req.params as unknown as ConversationIdParamsInput;
  const query = req.query as unknown as PaginationQuery;

  const messages = await listMessagesService(conversationId, userId, query);

  sendResponse(res, StatusCodes.OK, "Messages listed successfully", messages);
});
