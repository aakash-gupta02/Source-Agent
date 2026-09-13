import { AIProviderType } from "@repo/db/enums";

export const AI_PROVIDER_OPTIONS = [
  {
    value: AIProviderType.GOOGLE,
    label: "Google",
  },
  {
    value: AIProviderType.OPENAI,
    label: "OpenAI",
  },
  {
    value: AIProviderType.ANTHROPIC,
    label: "Anthropic",
  },
  {
    value: AIProviderType.OLLAMA,
    label: "Ollama",
  },
  {
    value: AIProviderType.MISTARAL,
    label: "Mistral",
  },
] as const;

export function getAIProviderLabel(provider: AIProviderType) {
  return (
    AI_PROVIDER_OPTIONS.find(
      (option) => option.value === provider,
    )?.label ?? provider
  );
}