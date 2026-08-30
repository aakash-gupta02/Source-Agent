import { ChatOllama } from "@langchain/ollama";
import { env } from "./env.js";
import { ChatGoogle } from "@langchain/google/node";

const models = {
  ministral3b: "ministral-3:3b",
  ornith9b: "ornith:9b",
  qwen25Coder7b: "qwen2.5-coder:7b",
  gemma4e4b: "gemma4:e4b",
} as const;

export const model = new ChatOllama({
  model: "gemma4:e4b",
  temperature: 0,
});

// export const model = new ChatGoogle({
//   model: "gemini-3-flash-preview",
//   apiKey: env.GEMINI_API_KEY,
// });
