import type { AIProvider } from "@repo/db/models";

export type AIProviderListDto = Omit<AIProvider, "credentials" | "keyVersion">;

export type AIProviderDetailDto = Omit<
  AIProvider,
  "credentials" | "keyVersion"
> & {
  credentials: string;
};
