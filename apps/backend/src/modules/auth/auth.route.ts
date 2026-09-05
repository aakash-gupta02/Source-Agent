import { Router } from "express";

import {
  googleCallback,
  googleLogin,
  login,
  logout,
  me,
  refreshToken,
  register,
} from "./auth.controller.js";
import {
  googleAuthSchema,
  loginSchema,
  registerSchema,
} from "@repo/shared/validations";
import {
  authMiddleware,
  refreshTokenMiddleware,
} from "../../core/middlewares/auth.middleware.js";
import { authRateLimiter } from "../../core/middlewares/rateLimiter.middleware.js";
import {
  validateBody,
  validateQuery,
} from "../../core/middlewares/validateRequest.middleware.js";

const router = Router();

router.post(
  "/register",
  authRateLimiter,
  validateBody(registerSchema),
  register,
);
router.post("/login", authRateLimiter, validateBody(loginSchema), login);
router.get("/me", authMiddleware, me);

router.post("/logout", refreshTokenMiddleware, logout);

router.post("/refresh", refreshTokenMiddleware, refreshToken);

// Google OAuth routes
router.get("/google", googleLogin);
router.get("/google/callback", validateQuery(googleAuthSchema), googleCallback);

export default router;
