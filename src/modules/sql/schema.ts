import z from "zod";

export const SqlResponseSchema = z.object({
  canAnswer: z.boolean().describe(
    "Whether the database schema contains enough information to answer the question."
  ),

  sql: z.string().nullable().describe(
    "A valid PostgreSQL SQL query if the question can be answered, otherwise null."
  ),

  explanation: z.string().describe(
    "Briefly explain the generated query or why the question cannot be answered."
  ),
});
