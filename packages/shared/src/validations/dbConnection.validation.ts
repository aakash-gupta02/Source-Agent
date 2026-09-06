import { DatabaseConnectionType } from "@repo/db/enums";
import { z } from "zod";

export const databaseConnectionFields = {
  name: z.string().trim().min(1).max(100),

  connectionType: z.enum(DatabaseConnectionType),

  url: z.string().url().optional(),

  host: z.string().trim().min(1).optional(),

  port: z.coerce.number().int().min(1).max(65535).optional(),

  database: z.string().trim().min(1).optional(),

  username: z.string().trim().min(1).optional(),

  password: z.string().min(1).optional(),

  ssl: z.boolean().default(true),
};

const urlConnectionSchema = z.object({
  name: databaseConnectionFields.name,

  connectionType: z.literal("URL"),

  url: z.string().url(),

  ssl: databaseConnectionFields.ssl,
});

const fieldsConnectionSchema = z.object({
  name: databaseConnectionFields.name,

  connectionType: z.literal("FIELDS"),

  host: databaseConnectionFields.host.unwrap(),
  port: databaseConnectionFields.port.unwrap(),
  database: databaseConnectionFields.database.unwrap(),
  username: databaseConnectionFields.username.unwrap(),
  password: databaseConnectionFields.password.unwrap(),

  ssl: databaseConnectionFields.ssl,
});

export const createDatabaseConnectionSchema = z.discriminatedUnion(
  "connectionType",
  [urlConnectionSchema, fieldsConnectionSchema],
);

const updateDatabaseConnectionFields = {
  name: z.string().trim().min(1).max(100).optional(),
  connectionType: z.enum(["URL", "FIELDS"]).optional(),

  url: z.string().url().optional(),

  host: z.string().trim().min(1).optional(),
  port: z.coerce.number().int().min(1).max(65535).optional(),
  database: z.string().trim().min(1).optional(),
  username: z.string().trim().min(1).optional(),
  password: z.string().min(1).optional(),

  ssl: z.boolean().optional(),
  isActive: z.boolean().optional(),
};

export const updateDatabaseConnectionSchema = z
  .object(updateDatabaseConnectionFields)
  .strict()
  .superRefine((data, ctx) => {
    // If connectionType isn't changing, service can retain the existing type.
    // Validation of credential fields happens only when changing/providing
    // connection credentials.
    if (data.connectionType === "URL") {
      if (!data.url) {
        ctx.addIssue({
          code: "custom",
          path: ["url"],
          message: "Connection URL is required when using URL connection.",
        });
      }

      const fields = ["host", "port", "database", "username", "password"] as const;

      for (const field of fields) {
        if (data[field] !== undefined) {
          ctx.addIssue({
            code: "custom",
            path: [field],
            message: `${field} cannot be provided for a URL connection.`,
          });
        }
      }
    }

    if (data.connectionType === "FIELDS") {
      if (data.url !== undefined) {
        ctx.addIssue({
          code: "custom",
          path: ["url"],
          message: "URL cannot be provided for a field-based connection.",
        });
      }
    }
  });