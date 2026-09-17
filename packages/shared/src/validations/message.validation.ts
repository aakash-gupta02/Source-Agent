import { z } from "zod";
import { MessageRole } from "@repo/db/enums";

export const messageFields = {
  content: z.string().trim().min(1),
};

export const userCreateMessageSchema = z
  .object({
    content: messageFields.content,
  })
  .strict();

export const aiCreateMessageSchema = z
  .object({
    content: messageFields.content,
  })
  .strict();

export const resumeMessageSchema = z
  .object({
    approved: z.boolean(),
  })
  .strict();

export type ResumeMessageInput = z.infer<typeof resumeMessageSchema>;
export type UserCreateMessageInput = z.infer<typeof userCreateMessageSchema>;
export type AiCreateMessageInput = z.infer<typeof aiCreateMessageSchema>;
