import { Pool } from "pg";
import { env } from "../../core/config/env.js";
import { tool } from "@langchain/core/tools";
import z from "zod";
import { interrupt } from "@langchain/langgraph";
import { ToolError, ToolResponse } from "./schema.js";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

const validateSQLQuery = (sql: string) => {
  const normalized = sql.trim().toLowerCase();

  // 1. Only one statement
  const statements = normalized
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);

  if (statements.length > 1) {
    throw new Error("Multiple SQL statements are not allowed.");
  }

  // 2. Block dangerous DDL / permission operations
  const forbiddenKeywords = [
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
    const error: ToolError = {
      status: "error",
      code: "INVALID_SQL",
      message: `The SQL query contains a forbidden operation. Only SELECT, INSERT, UPDATE, and DELETE statements are allowed.`,
      nextStep:
        "Please modify your SQL query to remove any forbidden operations.",
    };

    return JSON.stringify(error);
  }
};

const isValidTable = async (table: string) => {
  const result = await pool.query(
    `
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = $1
      AND table_type = 'BASE TABLE';
    `,
    [table],
  );

  return result.rowCount === 1;
};

export const getTableSample = tool(
  async ({ table, limit }) => {
    try {
      const valid = await isValidTable(table);

      if (!valid) {
        return `Invalid table: ${table}`;
      }

      const result = await pool.query(`SELECT * FROM "${table}" LIMIT $1;`, [
        limit,
      ]);

      const response: ToolResponse = {
        status: "success",
        rowCount: result.rows.length,
        data: result.rows,
      };

      return JSON.stringify(response);
    } catch (error) {
      const errormsg: ToolError = {
        status: "error",
        code: "DATABASE_UNAVAILABLE",
        message: error instanceof Error ? error.message : String(error),
        nextStep:
          "Please check the database connection and ensure the table exists.",
      };
      return JSON.stringify(errormsg);
    }
  },
  {
    name: "get_table_sample",
    description:
      "Get a small sample of rows from a PostgreSQL table to understand actual data values.",
    schema: z.object({
      table: z.string().describe("The name of the table to inspect."),
      limit: z.number().int().min(1).max(10).default(5),
    }),
  },
);

export const getTables = tool(
  async () => {
    try {
      const result = await pool.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_type = 'BASE TABLE'
        ORDER BY table_name;
      `);

      const response: ToolResponse = {
        status: "success",
        rowCount: result.rows.length,
        data: result.rows,
      };

      return JSON.stringify(response);
    } catch (error) {
      return `DATABASE_UNAVAILABLE: ${
        error instanceof Error ? error.message : String(error)
      }`;
    }
  },
  {
    name: "get_tables",
    description: "Get the names of all tables in the PostgreSQL database.",
  },
);

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

      const foreignKeys = await pool.query(`
  SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
  FROM information_schema.table_constraints AS tc
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  JOIN information_schema.constraint_column_usage AS ccu
    ON tc.constraint_name = ccu.constraint_name
    AND tc.table_schema = ccu.table_schema
  WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public';
`);

      const primaryKeys = await pool.query(`
  SELECT
    tc.table_name,
    kcu.column_name
  FROM information_schema.table_constraints AS tc
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  WHERE tc.constraint_type = 'PRIMARY KEY'
    AND tc.table_schema = 'public';
`);

      const response: ToolResponse = {
        status: "success",
        rowCount: result.rows.length,
        data: [
          {
            schema: formatSchema(
              result.rows,
              primaryKeys.rows,
              foreignKeys.rows,
            ),
          },
        ],
      };

      return JSON.stringify(response);
    } catch (error) {
      const errormsg: ToolError = {
        status: "error",
        code: "DATABASE_UNAVAILABLE",
        message: error instanceof Error ? error.message : String(error),
        nextStep:
          "Please check the database connection and ensure the table exists.",
      };
      return JSON.stringify(errormsg);
    }
  },
  {
    name: "get_schema",
    description:
      "Get the tables, columns, and data types available in the PostgreSQL database.",
  },
);

export const getTableSchema = tool(
  async ({ tables }) => {
    try {
      const columns = await pool.query(
        `
        SELECT
          table_name,
          column_name,
          data_type
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = ANY($1)
        ORDER BY table_name, ordinal_position;
        `,
        [tables],
      );

      const primaryKeys = await pool.query(
        `
        SELECT
          tc.table_name,
          kcu.column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        WHERE tc.constraint_type = 'PRIMARY KEY'
          AND tc.table_schema = 'public'
          AND tc.table_name = ANY($1);
        `,
        [tables],
      );

      const foreignKeys = await pool.query(
        `
        SELECT
          tc.table_name,
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON tc.constraint_name = ccu.constraint_name
          AND tc.table_schema = ccu.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_schema = 'public'
          AND tc.table_name = ANY($1);
        `,
        [tables],
      );

      const response: ToolResponse = {
        status: "success",
        rowCount: columns.rows.length,
        data: [
          {
            schema: formatSchema(
              columns.rows,
              primaryKeys.rows,
              foreignKeys.rows,
            ),
          },
        ],
      };

      return JSON.stringify(response);
    } catch (error) {
      const errormsg: ToolError = {
        status: "error",
        code: "DATABASE_UNAVAILABLE",
        message: error instanceof Error ? error.message : String(error),
        nextStep:
          "Please check the database connection and ensure the table exists.",
      };
      return JSON.stringify(errormsg);
    }
  },
  {
    name: "get_table_schema",
    description:
      "Get a small sample of actual rows from a PostgreSQL table. Use this when the schema alone cannot determine the actual values or patterns in a column, such as status, type, category, role, or other categorical fields.",
    schema: z.object({
      tables: z
        .array(z.string())
        .min(1)
        .describe("The names of the tables to inspect."),
    }),
  },
);

export const getColumnValues = tool(
  async ({ table, column }) => {
    try {
      const columnExists = await pool.query(
        `
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = $1
          AND column_name = $2;
        `,
        [table, column],
      );

      if (columnExists.rowCount === 0) {
        return `Invalid table or column: ${table}.${column}`;
      }

      const result = await pool.query(
        `
        SELECT DISTINCT "${column}"
        FROM "${table}"
        WHERE "${column}" IS NOT NULL
        ORDER BY "${column}";
        `,
      );

      const response: ToolResponse = {
        status: "success",
        rowCount: result.rows.length,
        data: result.rows,
      };

      return JSON.stringify(response);
    } catch (error) {
      const errormsg: ToolError = {
        status: "error",
        code: "DATABASE_UNAVAILABLE",
        message: error instanceof Error ? error.message : String(error),
        nextStep:
          "Please check the database connection and ensure the table exists.",
      };
      return JSON.stringify(errormsg);
    }
  },
  {
    name: "get_column_values",
    description:
      "Get all distinct non-null values from a specific column in a PostgreSQL table. Use this when you need to know the actual values stored in a column, especially categorical fields such as status, type, category, role, or plan.",
    schema: z.object({
      table: z.string().describe("The PostgreSQL table name."),
      column: z.string().describe("The column name to inspect."),
    }),
  },
);

export const formatSchema = (
  rows: {
    table_name: string;
    column_name: string;
    data_type: string;
  }[],
  primaryKeys: {
    table_name: string;
    column_name: string;
  }[],
  foreignKeys: {
    table_name: string;
    column_name: string;
    foreign_table_name: string;
    foreign_column_name: string;
  }[],
) => {
  const tables = new Map<string, string[]>();

  const pkSet = new Set(
    primaryKeys.map((key) => `${key.table_name}.${key.column_name}`),
  );

  const fkMap = new Map(
    foreignKeys.map((key) => [
      `${key.table_name}.${key.column_name}`,
      `${key.foreign_table_name}.${key.foreign_column_name}`,
    ]),
  );

  for (const row of rows) {
    if (!tables.has(row.table_name)) {
      tables.set(row.table_name, []);
    }

    const key = `${row.table_name}.${row.column_name}`;

    let column = `  ${row.column_name}: ${row.data_type}`;

    if (pkSet.has(key)) {
      column += " [PK]";
    }

    const foreignKey = fkMap.get(key);

    if (foreignKey) {
      column += ` [FK → ${foreignKey}]`;
    }

    tables.get(row.table_name)!.push(column);
  }

  return [...tables.entries()]
    .map(([table, columns]) => {
      return `${table}\n${columns.join("\n")}`;
    })
    .join("\n\n");
};

export const executeSQL = tool(
  async ({ sql }) => {
    validateSQLQuery(sql);

    const normalized = sql.trim().toLowerCase();

    const isWrite =
      normalized.startsWith("insert") ||
      normalized.startsWith("update") ||
      normalized.startsWith("delete");

    if (isWrite) {
      console.log("is write hitted");

      const approved = interrupt({
        type: "sql_approval",
        sql,
      });

      console.log("APPROVAL RESULT:", approved);

      if (!approved?.approved) {
        const error: ToolError = {
          status: "error",
          code: "USER_REJECTED_QUERY",
          message: "Write query was rejected by the user.",
          nextStep:
            "Stop execution and tell the user that the write operation was rejected.",
        };

        return JSON.stringify(error);
      }
    }

    try {
      const result = await pool.query(sql);

      const MAX_ROWS = 3;

      if (result.rows.length > MAX_ROWS) {
        const error: ToolError = {
          status: "error",
          code: "RESULT_TOO_LARGE",
          message: `Query returned more than ${MAX_ROWS} rows.`,
          nextStep: "Ask the user to narrow the query or add filters/limits.",
        };

        return JSON.stringify(error);
      }

      const response: ToolResponse = {
        status: "success",
        rowCount: result.rows.length,
        data: result.rows,
      };

      return JSON.stringify(response);
    } catch (error) {
      const errormsg: ToolError = {
        status: "error",
        code: "DATABASE_UNAVAILABLE",
        message: error instanceof Error ? error.message : String(error),
        nextStep:
          "Check the database error and correct the SQL query if necessary.",
      };

      return JSON.stringify(errormsg);
    }
  },
  {
    name: "execute_sql",
    description:
      "Execute a PostgreSQL SQL query. Read-only queries execute automatically. Write queries require human approval.",
    schema: z.object({
      sql: z.string().describe("A valid PostgreSQL SQL query."),
    }),
  },
);
