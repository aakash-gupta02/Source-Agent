import { DatabaseConnectionType } from "@repo/db/enums";

export const DATABASE_CONNECTION_TYPE_OPTIONS = [
  {
    value: DatabaseConnectionType.URL,
    label: "Connection URL",
  },
  {
    value: DatabaseConnectionType.FIELDS,
    label: "Connection fields",
  },
] as const;

export function getDatabaseConnectionTypeLabel(type: DatabaseConnectionType) {
  return (
    DATABASE_CONNECTION_TYPE_OPTIONS.find((option) => option.value === type)
      ?.label ?? type
  );
}
