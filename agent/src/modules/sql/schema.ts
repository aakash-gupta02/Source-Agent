import z from "zod";

export const SqlResponseSchema = z.object({
  canAnswer: z
    .boolean()
    .describe(
      "Whether the database schema contains enough information to answer the question.",
    ),

  sql: z
    .string()
    .nullable()
    .describe(
      "A valid PostgreSQL SQL query if the question can be answered, otherwise null.",
    ),

  explanation: z
    .string()
    .describe(
      "Briefly explain the generated query or why the question cannot be answered.",
    ),
});

export type ToolError = {
  status: "error";
  code:
    | "RESULT_TOO_LARGE"
    | "INVALID_SQL"
    | "DATABASE_UNAVAILABLE"
    | "INVALID_TABLE"
    | "INVALID_COLUMN"
    | "USER_REJECTED_QUERY";
  message: string;
  nextStep: string;
};

export type ToolResponse = {
  status: "success";
  rowCount: number;
  data: Record<string, unknown>[];
};
