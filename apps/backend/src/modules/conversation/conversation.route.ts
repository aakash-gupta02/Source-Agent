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
} from "../../core/middlewares/validateRequest.middleware.js";

import {
  conversationIdParamsSchema,
  createConversationSchema,
  updateConversationSchema,
} from "@repo/shared/validations";

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

export default router;
