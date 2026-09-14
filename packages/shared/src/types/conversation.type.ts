import { AIProviderType } from "@repo/db/enums";
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

export interface ConversationListDto extends Pick<
  Conversation,
  "id" | "title"
> {}


export interface ConversationDetailDto extends ConversationDto {
  databaseConnection: {
    id: string;
    name: string;
  };

  aiProvider: {
    id: string;
    name: string;
    provider: AIProviderType;
    model: string;
  };
}