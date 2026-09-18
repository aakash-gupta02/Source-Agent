import { Prisma } from "@repo/db";
import { decrypt } from "../../../shared/utils/encryption/encryption.js";
import {
  buildPostgresConnectionString,
  DatabaseCredentials,
} from "../../../shared/utils/atabase/connectionString.js";
import {
  createModel,
  createPostgresConnection,
  createSqlAgent,
} from "@repo/agent";

type ConversationWithCredentials = Prisma.ConversationGetPayload<{
  include: {
    databaseConnection: {
      select: {
        keyVersion: true;
        credentials: true;
      };
    };
    aiProvider: {
      select: {
        keyVersion: true;
        credentials: true;
        provider: true;
        model: true;
      };
    };
  };
}>;

export interface ToolExecution {
  id?: string;
  name: string;
  startedAt: number;
  durationMs?: number;
}

export const createConversationAgent = async (
  conversation: ConversationWithCredentials,
) => {
  const decryptedAi = decrypt(
    conversation.aiProvider.credentials,
    conversation.aiProvider.keyVersion,
  );

  const decryptedDatabase = decrypt(
    conversation.databaseConnection.credentials,
    conversation.databaseConnection.keyVersion,
  );

  const databaseCredentials = JSON.parse(
    decryptedDatabase,
  ) as DatabaseCredentials;

  const llm = createModel({
    provider: conversation.aiProvider.provider,
    model: conversation.aiProvider.model,
    credentials: decryptedAi,
  });

  const pool = createPostgresConnection(
    buildPostgresConnectionString(databaseCredentials),
  );

  const agent = createSqlAgent({
    llm,
    pool,
  });

  return {
    agent,
    llm,
  };
};
