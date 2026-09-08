import { DatabaseConnectionType } from "@repo/db/enums";
import { z } from "zod";
import { atLeastOneField } from "./helpers/atLeastOneField.js";
import { idParamsSchema } from "./common/IdParams.js";

const databaseConnection = {
  name: z.string().trim().min(1).max(100),
  connectionType: z.enum(DatabaseConnectionType),
  url: z.string().url(),
  host: z.string().trim().min(1),
  port: z.coerce.number().int().min(1).max(65535),
  database: z.string().trim().min(1),
  username: z.string().trim().min(1),
  password: z.string().min(1),
  ssl: z.boolean(),
  isActive: z.boolean(),
};

const urlConnectionSchema = z
  .object({
    name: databaseConnection.name,
    connectionType: z.literal(DatabaseConnectionType.URL),
    url: databaseConnection.url,
    ssl: databaseConnection.ssl,
  })
  .strict();

const fieldsConnectionSchema = z
  .object({
    name: databaseConnection.name,
    connectionType: z.literal(DatabaseConnectionType.FIELDS),
    host: databaseConnection.host,
    port: databaseConnection.port,
    database: databaseConnection.database,
    username: databaseConnection.username,
    password: databaseConnection.password,
    ssl: databaseConnection.ssl,
  })
  .strict();

export const createDatabaseConnectionSchema = z.discriminatedUnion(
  "connectionType",
  [urlConnectionSchema, fieldsConnectionSchema],
);

export const updateDatabaseConnectionSchema = atLeastOneField(
  z
    .object({
      name: databaseConnection.name.optional(),

      url: databaseConnection.url.optional(),

      host: databaseConnection.host.optional(),
      port: databaseConnection.port.optional(),
      database: databaseConnection.database.optional(),
      username: databaseConnection.username.optional(),
      password: databaseConnection.password.optional(),
      
      ssl: databaseConnection.ssl.optional(),
      isActive: databaseConnection.isActive.optional(),
    })
    .strict(),
);

export const DBConnectionIdParamsSchema = idParamsSchema

export type CreateDatabaseConnectionInput = z.infer<typeof createDatabaseConnectionSchema>;
export type UpdateDatabaseConnectionInput = z.infer<typeof updateDatabaseConnectionSchema>;
export type DBConnectionIdParamsInput = z.infer<typeof DBConnectionIdParamsSchema>;
