import { z } from "zod";
import { idParamsSchema, idSchema } from "./common/IdParams.js";
import { atLeastOneField } from "./helpers/atLeastOneField.js";

export const conversationFields = {
  databaseConnectionId: idSchema,
  aiProviderId: idSchema,
  title: z.string().trim().min(1).max(100),
};

export const createConversationSchema = z
  .object({
    databaseConnectionId: conversationFields.databaseConnectionId,
    aiProviderId: conversationFields.aiProviderId,
  })
  .strict();

export const updateConversationSchema = atLeastOneField(
  z
    .object({
      aiProviderId: conversationFields.aiProviderId.optional(),
      title: conversationFields.title.optional(),
    })
    .strict(),
);

export const conversationIdParamsSchema = idParamsSchema;

export type CreateConversationInput = z.infer<typeof createConversationSchema>;
export type UpdateConversationInput = z.infer<typeof updateConversationSchema>;
export type ConversationIdParamsInput = z.infer<typeof conversationIdParamsSchema>;