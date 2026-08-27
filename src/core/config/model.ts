import { ChatOllama } from "@langchain/ollama";
import { env } from "./env.js";
import { ChatGoogle } from "@langchain/google/node";

export const model = new ChatOllama({
  model: "gemma4:e4b",
  temperature: 0,
});

// export const model = new ChatGoogle({
//   model: "gemini-3-flash-preview",
//   apiKey: env.GEMINI_API_KEY,
// });
