import { model } from "../../core/config/model.js";
import { executeSQL, getSchema } from "./db.service.js";

import { ToolNode } from "@langchain/langgraph/prebuilt";

const tools = new ToolNode([getSchema, executeSQL]);

const modelWithTools = model.bindTools([getSchema, executeSQL]);

import { BaseMessage, HumanMessage } from "@langchain/core/messages";
import { Annotation, END, START, StateGraph } from "@langchain/langgraph";

const State = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (left, right) => left.concat(right),
    default: () => [],
  }),
});

const agent = async (state: typeof State.State) => {
  const response = await modelWithTools.invoke(state.messages);

  return {
    messages: [response],
  };
};

const shouldContinue = (state: typeof State.State) => {
  const lastMessage = state.messages.at(-1);

  if (
    lastMessage &&
    "tool_calls" in lastMessage &&
    lastMessage.tool_calls?.length
  ) {
    return "tools";
  }

  return END;
};

const graph = new StateGraph(State)
  .addNode("agent", agent)
  .addNode("tools", tools)

  .addEdge(START, "agent")

  .addConditionalEdges("agent", shouldContinue, ["tools", END])

  .addEdge("tools", "agent")

  .compile();

const result = await graph.invoke({
  messages: [
    new HumanMessage(
      "Which user has spent the most money on completed orders?",
    ),
  ],
});

console.dir(result.messages, { depth: null });