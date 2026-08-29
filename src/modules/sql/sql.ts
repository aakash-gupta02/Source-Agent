import { model } from "../../core/config/model.js";
import {
  BaseMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import { executeSQL, getSchema } from "./db.service.js";
import { ToolNode } from "@langchain/langgraph/prebuilt";

const question = "add a new column to the users table named age";

const tools = new ToolNode([getSchema, executeSQL]);
const modelWithTools = model.bindTools([getSchema, executeSQL]);

const systemPrompt = `
You are a PostgreSQL database assistant.

Rules:
- Use get_schema when you need to inspect the database structure.
- Use execute_sql to retrieve data.
- Only execute read-only SQL queries.
- Never invent tables, columns, or relationships.
- If the schema cannot answer the question, explain why.
- After receiving query results, answer the user's question clearly.
- If a tool reports DATABASE_UNAVAILABLE, do not call the database tools again. Explain that the database is currently unavailable.
- If execute_sql returns a SQL error caused by an invalid query, correct the query and retry.
`;

const State = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (left, right) => left.concat(right),
    default: () => [],
  }),

  sqlAttempts: Annotation<number>({
    reducer: (_, right) => right,
    default: () => 0,
  }),
});

const agent = async (state: typeof State.State) => {
  const response = await modelWithTools.invoke(state.messages);

  const executeSQLCall = response.tool_calls?.some(
    (call) => call.name === "execute_sql",
  );

  return {
    messages: [response],
    sqlAttempts: executeSQLCall ? state.sqlAttempts + 1 : state.sqlAttempts,
  };
};

const shouldContinue = (state: typeof State.State) => {
  const lastMessage = state.messages.at(-1);

  if (
    !lastMessage ||
    !("tool_calls" in lastMessage) ||
    !lastMessage.tool_calls?.length
  ) {
    return END;
  }

  const wantsSQL = lastMessage.tool_calls.some(
    (call) => call.name === "execute_sql",
  );

  if (wantsSQL && state.sqlAttempts >= 3) {
    console.log("🛑 SQL retry limit reached");
    return END;
  }

  return "tools";
};

const graph = new StateGraph(State)
  .addNode("agent", agent)
  .addNode("tools", tools)

  .addEdge(START, "agent")

  .addConditionalEdges("agent", shouldContinue, ["tools", END])

  .addEdge("tools", "agent")

  .compile();

const result = await graph.invoke({
  messages: [new SystemMessage(systemPrompt), new HumanMessage(question)],
});

console.dir(
  result.messages.map((message) => ({
    type: message.type,
    content: message.content,
    toolCalls: message.tool_calls ?? [],
    reasoning: message.additional_kwargs.reasoning_content ?? [],
  })),
  { depth: null },
);
console.log("Actual response: ", result.messages.at(-1)?.content);

// console.log(result)