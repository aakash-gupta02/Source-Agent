import { AIProviderType } from "@repo/db/enums";
import { z } from "zod";
import { atLeastOneField } from "./helpers/atLeastOneField.js";
import { idParamsSchema } from "./common/IdParams.js";

export const aiProvider = {
  name: z
    .string({
      message: "Provider name is required",
    })
    .trim()
    .min(1, "Provider name is required")
    .max(100, "Provider name must be at most 100 characters"),

  provider: z.enum(AIProviderType, {
    message: "Please select a valid AI provider",
  }),

  credentials: z
    .string({
      message: "Credentials are required",
    })
    .trim()
    .min(1, "Credentials are required"),

  model: z
    .string({
      message: "Model is required",
    })
    .trim()
    .min(1, "Model is required")
    .max(100, "Model must be at most 100 characters"),

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
