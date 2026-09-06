import { z } from "zod";
import { UserRole } from "@repo/db/enums";
import { REGISTERABLE_ROLES } from "../types/auth.type.js";

const authFields = {
  name: z.string().trim().min(2).max(50),
  email: z.email().transform((val) => val.toLowerCase()),
  password: z.string().min(6).max(100),
};

export const registerSchema = z
  .object({
    name: authFields.name,
    email: authFields.email,
    password: authFields.password,
    role: z.enum(REGISTERABLE_ROLES).default(UserRole.USER),
  })
  .strict();

export const loginSchema = z
  .object({
    email: authFields.email,
    password: authFields.password,
  })
  .strict();

export const googleAuthSchema = z
  .object({
    code: z.string(),
    state: z.string(),
  })
  .strip();

export const googleLoginQuerySchema = z.object({
  role: z.enum(REGISTERABLE_ROLES).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type GoogleAuthInput = z.infer<typeof googleAuthSchema>;
export type GoogleLoginQueryInput = z.infer<typeof googleLoginQuerySchema>;
