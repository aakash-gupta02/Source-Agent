import { Pool } from "pg";
import { env } from "../../core/config/env.js";
import { tool } from "@langchain/core/tools";
import z from "zod";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const getSchema = tool(
  async () => {
    const result = await pool.query(`
      SELECT
        table_name,
        column_name,
        data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position;
    `);

    return formatSchema(result.rows);
  },
  {
    name: "get_schema",
    description:
      "Get the tables, columns, and data types available in the PostgreSQL database.",
  },
);

export const formatSchema = (
  rows: {
    table_name: string;
    column_name: string;
    data_type: string;
  }[],
) => {
  const tables = new Map<string, string[]>();

  for (const row of rows) {
    if (!tables.has(row.table_name)) {
      tables.set(row.table_name, []);
    }

    tables.get(row.table_name)!.push(`  ${row.column_name}: ${row.data_type}`);
  }

  return [...tables.entries()]
    .map(([table, columns]) => {
      return `${table}\n${columns.join("\n")}`;
    })
    .join("\n\n");
};

export const executeSQL = tool(
  async ({ sql }) => {
    const normalized = sql.trim().toLowerCase();

    if (!normalized.startsWith("select") && !normalized.startsWith("with")) {
      throw new Error("Only read-only SELECT queries are allowed.");
    }

    const result = await pool.query(sql);

    return JSON.stringify(result.rows);
  },
  {
    name: "execute_sql",
    description:
      "Execute a read-only PostgreSQL SQL query and return the resulting rows.",
    schema: z.object({
      sql: z.string().describe("A valid read-only PostgreSQL SQL query."),
    }),
  },
);
