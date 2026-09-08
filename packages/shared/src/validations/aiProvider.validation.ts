import { AIProviderType } from "@repo/db/enums";
import { z } from "zod";
import { atLeastOneField } from "./helpers/atLeastOneField.js";
import { idParamsSchema } from "./common/IdParams.js";

export const aiProvider = {
  name: z.string().trim().min(1).max(100),
  provider: z.enum(AIProviderType),
  credentials: z.string().trim().min(1),
  model: z.string().trim().min(1).max(100),
  isActive: z.boolean(),
};

export const createAIProviderSchema = z
  .object({
    name: aiProvider.name,
    provider: aiProvider.provider,
    credentials: aiProvider.credentials,
    model: aiProvider.model,
    isActive: aiProvider.isActive.default(true),
  })
  .strict();

export const updateAIProviderSchema = atLeastOneField(
  z
    .object({
      name: aiProvider.name.optional(),
      credentials: aiProvider.credentials.optional(),
      model: aiProvider.model.optional(),
      isActive: aiProvider.isActive.optional(),
    })
    .strict(),
);

export const aiProviderIdParamsSchema = idParamsSchema;

export type CreateAIProviderInput = z.infer<typeof createAIProviderSchema>;
export type UpdateAIProviderInput = z.infer<typeof updateAIProviderSchema>;
export type AIProviderIdParamsInput = z.infer<typeof aiProviderIdParamsSchema>;
