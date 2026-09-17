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
  resumeMessageSchema,
  updateConversationSchema,
  userCreateMessageSchema,
} from "@repo/shared/validations";
import {
  createMessage,
  listMessages,
  resumeMessage,
} from "./message/message.controller.js";

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
  validateParams(conversationIdParamsSchema),
  validateBody(userCreateMessageSchema),
  createMessage,
);
router.get(
  "/:id/messages",
  validateParams(conversationIdParamsSchema),
  validateQuery(paginationQuerySchema),
  listMessages,
);

router.post(
  "/:id/messages/resume",
  validateParams(conversationIdParamsSchema),
  validateBody(resumeMessageSchema),
  resumeMessage,
);
export default router;
