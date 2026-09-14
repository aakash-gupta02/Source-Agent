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

export type StreamEvent =
  | {
      type: "message";
      content: string;
    }
  | {
      type: "done";
    }
  | {
      type: "error";
      message: string;
    };
