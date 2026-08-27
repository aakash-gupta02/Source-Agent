import { Pool } from "pg";
import { env } from "../../core/config/env.js";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const getSchema = async () => {
  const result = await pool.query(`
    SELECT
      table_name,
      column_name,
      data_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
    ORDER BY table_name, ordinal_position;
  `);

  return result.rows;
};

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

export const executeSQL = async (sql: string) => {
  const result = await pool.query(sql);

  return result.rows;
};
