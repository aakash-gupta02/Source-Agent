import { AIProviderType } from "@repo/db/enums";

export interface CreateModelInput {
  provider: AIProviderType;
  model: string;
  credentials: string;
}