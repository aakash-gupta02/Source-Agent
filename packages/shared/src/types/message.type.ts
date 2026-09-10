import type { Message } from "@repo/db/models";

export interface MessageDto extends Pick<
  Message,
  "id" | "conversationId" | "role" | "content" | "createdAt"
> {}
