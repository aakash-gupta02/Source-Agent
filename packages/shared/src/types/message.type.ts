import type { Message } from "@repo/db/models";
import { CursorPaginationMeta } from "./pagination.types.js";

export interface MessageDto extends Pick<
  Message,
  "id" | "conversationId" | "role" | "content" | "createdAt"
> {}

export interface MessageListDto {
  messages: MessageDto[];
  meta: CursorPaginationMeta;
}
