import { Router } from "express";
import {
  createAiProvider,
  updateAiProvider,
  listAiProviders,
  getAiProvider,
} from "./aiProvider.controller.js";
import { authMiddleware } from "../../core/middlewares/auth.middleware.js";
import {
  validateBody,
  validateParams,
} from "../../core/middlewares/validateRequest.middleware.js";
import {
  aiProviderIdParamsSchema,
  createAIProviderSchema,
  updateAIProviderSchema,
} from "@repo/shared/validations";

const router = Router();
router.use(authMiddleware);

router.post("/", validateBody(createAIProviderSchema), createAiProvider);
router.patch("/:id", validateBody(updateAIProviderSchema), updateAiProvider);
router.get("/", listAiProviders);
router.get("/:id", validateParams(aiProviderIdParamsSchema), getAiProvider);

export default router;
