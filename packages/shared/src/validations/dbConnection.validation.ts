import { DatabaseConnectionType } from "@repo/db/enums";
import { z } from "zod";
import { atLeastOneField } from "./helpers/atLeastOneField.js";
import { idParamsSchema } from "./common/IdParams.js";

const databaseConnection = {
  name: z
    .string({
      message: "Connection name is required",
    })
    .trim()
    .min(1, "Connection name is required")
    .max(100, "Connection name must be at most 100 characters"),

  connectionType: z.enum(DatabaseConnectionType, {
    message: "Please select a connection type",
  }),

  url: z
    .string({
      message: "Database URL is required",
    })
    .trim()
    .url("Please enter a valid database URL"),

  host: z
    .string({
      message: "Host is required",
    })
    .trim()
    .min(1, "Host is required"),

  port: z.coerce
    .number({
      message: "Port is required",
    })
    .int("Port must be a whole number")
    .min(1, "Port must be between 1 and 65535")
    .max(65535, "Port must be between 1 and 65535"),

  database: z
    .string({
      message: "Database name is required",
    })
    .trim()
    .min(1, "Database name is required"),

  username: z
    .string({
      message: "Username is required",
    })
    .trim()
    .min(1, "Username is required"),

  password: z
    .string({
      message: "Password is required",
    })
    .min(1, "Password is required"),

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

export const DBConnectionIdParamsSchema = idParamsSchema;

export type CreateDatabaseConnectionInput = z.infer<
  typeof createDatabaseConnectionSchema
>;
export type UpdateDatabaseConnectionInput = z.infer<
  typeof updateDatabaseConnectionSchema
>;
export type DBConnectionIdParamsInput = z.infer<
  typeof DBConnectionIdParamsSchema
>;
