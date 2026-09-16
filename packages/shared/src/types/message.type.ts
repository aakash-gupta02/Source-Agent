import type { Message } from "@repo/db/models";
import { CursorPaginationMeta } from "./pagination.types.js";

export interface MessageDto extends Pick<
  Message,
  "id" | "conversationId" | "role" | "content" | "createdAt"
> {}

export interface MessageDtoWithMetadata extends MessageDto {
  metadata?: MessageMetadata;
}

export interface MessageListDto {
  messages: MessageDtoWithMetadata[];
  meta: CursorPaginationMeta;
}

export interface SqlApproval {
  type: "sql_approval";
  sql: string;
}

export type StreamEvent =
  | {
      type: "tool_start";
      tool: string;
    }
  | {
      type: "tool_end";
      tool: string;
    }
  | { type: "approval_required"; approval: SqlApproval }
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

//#region Message Metadata
export interface ToolExecutionMetadata {
  name: string;
  durationMs?: number;
}

export interface ModelMetadata {
  provider: string;
  name: string;
}
//#endregion Message Metadata

export interface MessageMetadata {
  model?: ModelMetadata;
  tools?: ToolExecutionMetadata[];
}
