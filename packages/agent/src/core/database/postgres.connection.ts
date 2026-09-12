import { Pool } from "pg";

export const createPostgresConnection = (connectionString: string) => {
  return new Pool({
    connectionString,
  });
};
