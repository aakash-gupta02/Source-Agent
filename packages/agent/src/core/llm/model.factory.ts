import { ChatGoogle } from "@langchain/google/node";
import { ChatOllama } from "@langchain/ollama";
import { AIProviderType } from "@repo/db/enums";
import type { CreateModelInput } from "./types.js";

//#region models
export const createGoogleModel = (model: string, credentials: string) => {
  return new ChatGoogle({
    model,
    apiKey: credentials,
    temperature: 0,
  });
};

export const createOllamaModel = (model: string) => {
  return new ChatOllama({
    model,
    temperature: 0,
  });
};
//#endregion models

export const createModel = ({
  provider,
  model,
  credentials,
}: CreateModelInput) => {
  switch (provider) {
    case AIProviderType.GOOGLE:
      return createGoogleModel(model, credentials);

    case AIProviderType.OLLAMA:
      return createOllamaModel(model);

    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
};
