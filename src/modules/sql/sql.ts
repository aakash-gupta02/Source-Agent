import { model } from "../../core/config/model.js";
import { executeSQL, getSchema } from "./db.service.js";

const modelWithTools = model.bindTools([getSchema, executeSQL]);

const response = await modelWithTools.invoke(
  "Which user has spent the most money on completed orders?",
);

console.dir(response, { depth: null });

if (!response.tool_calls || response.tool_calls.length === 0) {
  throw new Error("No tool calls found in the response.");
}

const toolCall = response.tool_calls[0];

const toolResult = await getSchema.invoke(toolCall.args);

console.dir(toolResult, { depth: null });