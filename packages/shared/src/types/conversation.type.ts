import type { Conversation } from "@repo/db/models";

export interface ConversationDto extends Pick<
  Conversation,
  | "id"
  | "userId"
  | "databaseConnectionId"
  | "aiProviderId"
  | "title"
  | "createdAt"
  | "updatedAt"
> {}
