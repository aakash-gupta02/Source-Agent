import type { ParamsDictionary } from "express-serve-static-core";
import { z } from "zod";

export const idSchema = z
  .string()
  .trim()
  .uuid("Invalid id format");

export const idParamsSchema = z
  .object({
    id: idSchema,
  })
  .strict();

export type IdParamsInput = z.infer<typeof idParamsSchema>;

export interface IdParams extends ParamsDictionary {
  id: string;
}
