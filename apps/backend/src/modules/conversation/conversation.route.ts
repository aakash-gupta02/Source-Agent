import { Router } from "express";

import {
  createConversation,
  updateConversation,
  deleteConversation,
  listConversations,
  getConversation,
} from "./conversation.controller.js";

import { authMiddleware } from "../../core/middlewares/auth.middleware.js";

import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../core/middlewares/validateRequest.middleware.js";

import {
  conversationIdParamsSchema,
  createConversationSchema,
  paginationQuerySchema,
  updateConversationSchema,
  userCreateMessageSchema,
} from "@repo/shared/validations";
import { createMessage, listMessages } from "./message/message.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", validateBody(createConversationSchema), createConversation);

router.patch(
  "/:id",
  validateParams(conversationIdParamsSchema),
  validateBody(updateConversationSchema),
  updateConversation,
);

router.delete(
  "/:id",
  validateParams(conversationIdParamsSchema),
  deleteConversation,
);

router.get("/", listConversations);
router.get("/:id", validateParams(conversationIdParamsSchema), getConversation);

router.post(
  "/:id/messages",
  validateBody(userCreateMessageSchema),
  createMessage,
);
router.get("/:id/messages", validateQuery(paginationQuerySchema), listMessages);

export default router;
