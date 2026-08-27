import { model } from "../../core/config/model.js";
import { executeSQL, formatSchema, getSchema } from "./db.service.js";
import { SqlResponseSchema } from "./schema.js";

const question = "Which user's orders have the highest discount?";

const schema = await getSchema();
const formattedSchema = formatSchema(schema);

const sqlModel = model.withStructuredOutput(SqlResponseSchema);

const prompt = `
You are a PostgreSQL SQL generation assistant.

Use only the tables and columns provided in the database schema.

Database schema:

${formattedSchema}

User question:

"${question}"

Determine whether the question can be answered using this schema.

If it can:
- Generate valid PostgreSQL SQL.
- Do not invent tables or columns.

If it cannot:
- Set canAnswer to false.
- Set sql to null.
- Explain what required information is missing.

Never put an error message or explanation inside the SQL field.
`;

const response = await sqlModel.invoke(prompt);

console.log("llm", response);

if (!response.canAnswer || !response.sql) {
  console.log("Cannot answer the question:", response.explanation);
  process.exit(0);
}

const executedResult = await executeSQL(response.sql);

console.log("Executed Result:", executedResult);
