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
import { StreamEvent } from "@repo/shared/types";

export const createMessage = CatchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { id: conversationId } =
    req.params as unknown as ConversationIdParamsInput;
  const content: UserCreateMessageInput = req.body;

  if (content.content === "__SSE_TEST__") {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const chunks = [
      "The user",
      " with the",
      " most completed",
      " orders is ",
      "**Aakash**",
      ", who has",
      " placed **2**",
      " completed orders",
      " with a total amount",
      " of **2000.00**.",
    ];

    for (const chunk of chunks) {
      const event: StreamEvent = {
        type: "message",
        content: chunk,
      };

      res.write(`data: ${JSON.stringify(event)}\n\n`);

      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    const doneEvent: StreamEvent = {
      type: "done",
    };

    res.write(`data: ${JSON.stringify(doneEvent)}\n\n`);
    res.end();

    return;
  }

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
