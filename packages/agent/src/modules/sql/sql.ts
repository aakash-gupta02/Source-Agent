import type { Pool } from "pg";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
  type BaseMessage,
} from "@langchain/core/messages";
import {
  Annotation,
  END,
  MemorySaver,
  START,
  StateGraph,
} from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";

import { createSqlTools } from "./db.service.js";
import { MessageRole } from "@repo/db";
import { TitleResponseSchema } from "./schema.ts";

export interface CreateSqlAgentInput {
  llm: BaseChatModel;
  pool: Pool;
}

const systemPrompt = `
You are a PostgreSQL database assistant.

Rules:
- Use get_tables to discover the available database tables.
- Use get_table_schema to inspect the columns, data types, primary keys, and foreign key relationships of relevant tables.
- Use get_table_sample after inspecting a relevant table's schema when the user's question requires knowing actual values stored in the database.
- Use get_column_values when you need to know the distinct values stored in a specific column.
- Use execute_sql to execute SQL queries.
- Only inspect tables and columns that are available through the database tools.
- Never invent tables, columns, or relationships.
- Use foreign key relationships from get_table_schema when determining how tables should be joined.
- If the available schema cannot answer the question, explain why.
- After receiving query results, answer the user's question clearly.

Error handling:
- Tool errors may contain: status, code, message, and nextStep.
- Follow the nextStep provided by a tool error when deciding what to do next.
- If DATABASE_UNAVAILABLE, do not call database tools again.
- If INVALID_SQL, correct the SQL and retry when possible.
- If RESULT_TOO_LARGE, do not retry the same query. Ask the user to narrow the request.
- If USER_REJECTED_QUERY, do not retry the rejected write operation.

`;

export const systemPromptForTitle = `
Generate a short title for this conversation.

Rules:
- Maximum 6 words
- No quotes
- No punctuation
- Describe the user's main intent
`;

export const createSqlAgent = ({ llm, pool }: CreateSqlAgentInput) => {
  const tools = createSqlTools(pool);
  const modelWithTools = llm.bindTools!(tools);

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
      !AIMessage.isInstance(lastMessage) ||
      !lastMessage.tool_calls?.length
    ) {
      return END;
    }

    const wantsSQL = lastMessage.tool_calls.some(
      (call) => call.name === "execute_sql",
    );

    if (wantsSQL && state.sqlAttempts >= 20) {
      return END;
    }

    return "tools";
  };

  const graph = new StateGraph(State)
    .addNode("agent", agent)
    .addNode("tools", new ToolNode(tools))
    .addEdge(START, "agent")
    .addConditionalEdges("agent", shouldContinue, ["tools", END])
    .addEdge("tools", "agent")
    .compile({
      checkpointer: new MemorySaver(),
    });

  const invoke = async (
    conversationId: string,
    messages: { role: MessageRole; content: string }[],
  ) => {
    const agentMessages = messages.map((message) =>
      message.role === MessageRole.USER
        ? new HumanMessage(message.content)
        : new AIMessage(message.content),
    );

    return graph.invoke(
      {
        messages: [new SystemMessage(systemPrompt), ...agentMessages],
      },
      {
        configurable: {
          thread_id: conversationId,
        },
      },
    );
  };

  const stream = async (
    conversationId: string,
    messages: { role: MessageRole; content: string }[],
  ) => {
    const agentMessages = messages.map((message) =>
      message.role === MessageRole.USER
        ? new HumanMessage(message.content)
        : new AIMessage(message.content),
    );

    return graph.stream(
      {
        messages: [new SystemMessage(systemPrompt), ...agentMessages],
      },
      {
        configurable: {
          thread_id: conversationId,
        },
        streamMode: ["messages"],
      },
    );
  };

  return {
    invoke,
    stream,
  };
};

export const generateTitle = async (llm: BaseChatModel, content: string) => {
  const structuredOutput = llm.withStructuredOutput(TitleResponseSchema);

  const response = await structuredOutput.invoke([
    new SystemMessage(systemPromptForTitle),
    new HumanMessage(content),
  ]);

  return response.title;
};
