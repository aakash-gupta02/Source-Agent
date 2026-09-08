import { Router } from "express";
import {
  CreateDBConnection,
  UpdateDBConnection,
} from "./connection.controller.js";
import { authMiddleware } from "../../core/middlewares/auth.middleware.js";
import {
  validateBody,
  validateParams,
} from "../../core/middlewares/validateRequest.middleware.js";
import {
  createDatabaseConnectionSchema,
  DBConnectionIdParamsSchema,
  updateDatabaseConnectionSchema,
} from "@repo/shared/validations";

const router = Router();

router.use(authMiddleware);

router.post(
  "/",
  validateBody(createDatabaseConnectionSchema),
  CreateDBConnection,
);

router.patch(
  "/:id",
  validateParams(DBConnectionIdParamsSchema),
  validateBody(updateDatabaseConnectionSchema),
  UpdateDBConnection,
);
export default router;
