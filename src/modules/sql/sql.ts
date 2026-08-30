import { model } from "../../core/config/model.js";
import {
  BaseMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import {
  Annotation,
  Command,
  END,
  MemorySaver,
  START,
  StateGraph,
} from "@langchain/langgraph";
import {
  executeSQL,
  getColumnValues,
  getSchema,
  getTables,
  getTableSample,
  getTableSchema,
} from "./db.service.js";
import { ToolNode } from "@langchain/langgraph/prebuilt";

const question = "list all users from user table";

const allTools = [
  getTables,
  getTableSchema,
  getTableSample,
  getColumnValues,
  executeSQL,
];

const tools = new ToolNode(allTools);
const modelWithTools = model.bindTools(allTools);

const systemPrompt = `
You are a PostgreSQL database assistant.

Rules:
- Use get_tables to discover the available database tables.
- Use get_table_schema to inspect the columns, data types, primary keys, and foreign key relationships of relevant tables.
- Use get_table_sample after inspecting a relevant table's schema when the user's question requires knowing actual values stored in the database.
- Use get_column_values when you need to know the distinct values stored in a specific column.
- Use execute_sql to execute SQL queries.
- Use get_table_sample when you need to understand the actual values or data patterns in a relevant table.
- Only inspect tables and columns that are available through the database tools.
- Never invent tables, columns, or relationships.
- Use foreign key relationships from get_table_schema when determining how tables should be joined.
- If the available schema cannot answer the question, explain why.
- After receiving query results, answer the user's question clearly.
- If a tool reports DATABASE_UNAVAILABLE, do not call the database tools again. Explain that the database is currently unavailable.
- If execute_sql returns a SQL error caused by an invalid query, correct the query and retry.
- If execute_sql returns RESULT_TOO_LARGE, do not retry the same query or use another tool to retrieve the complete result.
- If the user asked for all records, explain that the result is too large and ask them to narrow the request.
- get_table_sample may be used only when a sample is appropriate, not as a replacement for the requested complete result.
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

  if (wantsSQL && state.sqlAttempts >= 20) {
    console.log("🛑 SQL retry limit reached");
    return END;
  }

  return "tools";
};

const checkpointer = new MemorySaver();

const graph = new StateGraph(State)
  .addNode("agent", agent)
  .addNode("tools", tools)

  .addEdge(START, "agent")

  .addConditionalEdges("agent", shouldContinue, ["tools", END])

  .addEdge("tools", "agent")

  .compile({
    checkpointer,
  });

import crypto from "node:crypto";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

// --------------------------------------------------
// Run one question
// --------------------------------------------------

const runQuestion = async (question: string) => {
  console.log("\n" + "=".repeat(70));
  console.log(`QUESTION: ${question}`);
  console.log("=".repeat(70));

  const config = {
    configurable: {
      // Fresh conversation/execution for every question
      thread_id: crypto.randomUUID(),
    },
  };

  const result = await graph.invoke(
    {
      messages: [new SystemMessage(systemPrompt), new HumanMessage(question)],
    },
    config,
  );

  // ------------------------------------------------
  // HITL
  // ------------------------------------------------

  const interrupt = result.__interrupt__?.[0];

  if (interrupt) {
    console.log("\n" + "=".repeat(70));
    console.log("AGENT INTERRUPTED");
    console.log("=".repeat(70));

    const { type, sql } = interrupt.value;

    console.log("TYPE:", type);
    console.log("SQL:", sql);

    const rl = readline.createInterface({
      input,
      output,
    });

    const answer = await rl.question("\nExecute this query? (y/n): ");

    await rl.close();

    if (answer.trim().toLowerCase() !== "y") {
      console.log("\n❌ REJECTED — query was not executed.");
      return;
    }

    console.log("\n✅ APPROVED\n");

    // IMPORTANT:
    // Same config/thread_id used for the interrupted execution
    const resumed = await graph.invoke(
      new Command({
        resume: {
          approved: true,
        },
      }),
      config,
    );

    printResult(resumed);

    return;
  }

  // ------------------------------------------------
  // Normal query
  // ------------------------------------------------

  printResult(result);
};

// --------------------------------------------------
// Result logging
// --------------------------------------------------

const printResult = (result: any) => {
  console.log("\n" + "=".repeat(70));
  console.log("GRAPH TRACE");
  console.log("=".repeat(70));

  result.messages.forEach((message: any, index: number) => {
    console.log(`\n--- MESSAGE ${index + 1} ---`);
    console.log("TYPE:", message.type);

    if (message.content) {
      console.log("CONTENT:");
      console.log(message.content);
    }

    if (message.tool_calls?.length) {
      console.log("TOOL CALLS:");

      for (const call of message.tool_calls) {
        console.log(`  ${call.name}`);
        console.log("  ARGS:", JSON.stringify(call.args, null, 2));
      }
    }

    const reasoning = message.additional_kwargs?.reasoning_content;

    if (reasoning) {
      console.log("REASONING:");
      console.log(reasoning);
    }
  });

  const finalMessage = result.messages.at(-1);

  console.log("\n" + "=".repeat(70));
  console.log("FINAL ANSWER");
  console.log("=".repeat(70));

  console.log(finalMessage?.content ?? "(no response)");

  console.log("\nMODEL:");
  console.log(finalMessage?.response_metadata?.model ?? "unknown");
};

// --------------------------------------------------
// Questions
// --------------------------------------------------

const questions = [
  "Which user has spent the most money on completed orders?",
  "Which user has placed the most orders?",
  "How many users are in the database?",
  "Which users have never placed an order?",
  "What is the average amount of completed orders?",
  "What are the different values of order status?",
  "What are the different order statuses and how many orders have each status?",
  "List all users from the users table",
  "Update Aakash's email to aakash@example.com",
];

// Pick one question for now
await runQuestion(questions[8]);
