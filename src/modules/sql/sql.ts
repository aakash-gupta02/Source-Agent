import { model } from "../../core/config/model.js";
import { databaseSchema } from "./schema.js";

const question = "Which user has spent the most money on completed orders?";

const prompt = `
You generate PostgreSQL SQL queries.

Database schema:

${databaseSchema}

Generate SQL for this question:

"${question}"

Return ONLY the SQL query.
`;

const response = await model.invoke(prompt);

console.log(response.text);
