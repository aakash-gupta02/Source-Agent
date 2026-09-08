import { DatabaseConnection } from "@repo/db/models";
import { DatabaseConnectionType } from "@repo/db/enums";

export type DatabaseConnectionListDto = Omit<
  DatabaseConnection,
  "credentials" | "keyVersion"
>;

export type DatabaseConnectionDetailDto = Omit<
  DatabaseConnection,
  "credentials" | "keyVersion"
> &
  (
    | {
        connectionType: typeof DatabaseConnectionType.URL;
        credentials: {
          url: string;
        };
      }
    | {
        connectionType: typeof DatabaseConnectionType.FIELDS;
        credentials: {
          host: string;
          port: number;
          database: string;
          username: string;
          password: string;
        };
      }
  );
