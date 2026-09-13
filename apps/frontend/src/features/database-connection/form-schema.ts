import { DatabaseConnectionType } from "@repo/db/enums";
import { z } from "zod";
import {
  createDatabaseConnectionSchema,
  type CreateDatabaseConnectionInput,
} from "@repo/shared/validations";

/** Every field the connection modals render. Exclusive keys stay present. */
export const connectionFormSchema = z.object({
  name: z.string(),
  connectionType: z.enum(DatabaseConnectionType),
  url: z.string(),
  host: z.string(),
  port: z.string(),
  database: z.string(),
  username: z.string(),
  password: z.string(),
  ssl: z.boolean(),
  isActive: z.boolean().optional(),
});

export type ConnectionFormValues = z.infer<typeof connectionFormSchema>;

const addParsedIssues = (
  ctx: z.RefinementCtx,
  issues: { path: PropertyKey[]; message: string }[],
) => {
  for (const issue of issues) {
    ctx.addIssue({
      code: "custom",
      path: issue.path,
      message: issue.message,
    });
  }
};

export const createConnectionFormSchema = connectionFormSchema.superRefine(
  (data, ctx) => {
    const result = createDatabaseConnectionSchema.safeParse(
      toCreatePayload(data),
    );

    if (!result.success) {
      addParsedIssues(ctx, result.error.issues);
    }
  },
);

export const editConnectionFormSchema = connectionFormSchema.superRefine(
  (data, ctx) => {
    if (data.connectionType === DatabaseConnectionType.URL) {
      const result = createDatabaseConnectionSchema.safeParse({
        name: data.name,
        connectionType: DatabaseConnectionType.URL,
        url: data.url,
        ssl: data.ssl,
      });

      if (!result.success) {
        addParsedIssues(ctx, result.error.issues);
      }

      return;
    }

    const result = createDatabaseConnectionSchema.safeParse({
      name: data.name,
      connectionType: DatabaseConnectionType.FIELDS,
      host: data.host,
      port: data.port,
      database: data.database,
      username: data.username,
      password: data.password || "unchanged",
      ssl: data.ssl,
    });

    if (!result.success) {
      addParsedIssues(
        ctx,
        result.error.issues.filter((issue) => issue.path[0] !== "password"),
      );
    }
  },
);

export function toCreatePayload(
  values: ConnectionFormValues,
): CreateDatabaseConnectionInput {
  if (values.connectionType === DatabaseConnectionType.URL) {
    return {
      name: values.name,
      connectionType: DatabaseConnectionType.URL,
      url: values.url,
      ssl: values.ssl,
    };
  }

  return {
    name: values.name,
    connectionType: DatabaseConnectionType.FIELDS,
    host: values.host,
    port: Number(values.port),
    database: values.database,
    username: values.username,
    password: values.password,
    ssl: values.ssl,
  };
}
