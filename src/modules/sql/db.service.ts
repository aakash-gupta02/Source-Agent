import { Pool } from "pg";
import { env } from "../../core/config/env.js";
import { tool } from "@langchain/core/tools";
import z from "zod";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

const validateSQLQuery = (sql: string) => {
  const normalized = sql.trim().toLowerCase();

  // 1. Only SELECT / WITH queries
  if (!normalized.startsWith("select") && !normalized.startsWith("with")) {
    console.error("Invalid SQL query:", sql);
    throw new Error("Only read-only SELECT queries are allowed.");
  }

  // 2. Only one statement
  const statements = normalized
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);

  if (statements.length > 1) {
    console.error("Multiple SQL statements detected:", sql);
    throw new Error("Multiple SQL statements are not allowed.");
  }

  // 3. Reject dangerous operations
  const forbiddenKeywords = [
    "insert",
    "update",
    "delete",
    "drop",
    "alter",
    "truncate",
    "create",
    "grant",
    "revoke",
  ];

  const containsForbiddenKeyword = forbiddenKeywords.some((keyword) =>
    new RegExp(`\\b${keyword}\\b`, "i").test(normalized),
  );

  if (containsForbiddenKeyword) {
    console.error("Forbidden SQL operation detected:", sql);
    throw new Error("Query contains a forbidden SQL operation.");
  }
};

export const getSchema = tool(
  async () => {
    try {
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
    } catch (error) {
      return `DATABASE_UNAVAILABLE: ${
        error instanceof Error ? error.message : String(error)
      }`;
    }
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
    try {
      validateSQLQuery(sql);

      const result = await pool.query(sql);

      return JSON.stringify(result.rows);
    } catch (error) {
      return `SQL Error: ${
        error instanceof Error ? error.message : String(error)
      }`;
    }
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
