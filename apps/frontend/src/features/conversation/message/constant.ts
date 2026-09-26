import { type ThinkingOrbProps } from "thinking-orbs";

export const toolLabels: Record<string, string> = {
  get_schema: "Checking database schema",
  get_table_schema: "Inspecting table structure",
  get_tables: "Checking available tables",
  get_table_sample: "Inspecting sample data",
  execute_sql: "Running SQL query",
};

export const toolOrbStates: Record<string, ThinkingOrbProps["state"]> = {
  get_tables: "searching",
  get_schema: "searching",
  get_table_schema: "searching",
  get_table_sample: "searching",
  execute_sql: "solving",
};
