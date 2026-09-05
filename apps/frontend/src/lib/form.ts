"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type UseFormProps,
  type UseFormReturn,
} from "react-hook-form";
import type { z } from "zod";

type UseZodFormProps<TSchema extends z.ZodType> = Omit<
  UseFormProps<z.infer<TSchema> & FieldValues>,
  "resolver"
> & {
  schema: TSchema;
  defaultValues?: DefaultValues<z.input<TSchema> & FieldValues>;
};

/** React Hook Form + Zod (v4 schemas from `@repo/shared` are supported). */
export function useZodForm<TSchema extends z.ZodType>(
  props: UseZodFormProps<TSchema>,
): UseFormReturn<z.infer<TSchema> & FieldValues> {
  const { schema, ...formProps } = props;
  return useForm({
    ...formProps,
    // Shared schemas are Zod 4; resolver types are still catching up.
    resolver: zodResolver(schema as never),
  });
}
