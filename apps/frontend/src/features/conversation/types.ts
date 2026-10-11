import type { MessageDtoWithMetadata, SqlApproval } from "@repo/shared/types";

export interface ToolActivity {
  tool: string;
  status: "running" | "completed";
}

export interface ConversationMessageListProps {
  messages: MessageDtoWithMetadata[];
  pendingUserContent?: string;
  streamingContent?: string;
  isStreaming: boolean;
  toolActivity: ToolActivity[];
  pendingApproval?: SqlApproval | null;
  showPendingUser: boolean;
  showStreaming: boolean;
  onApproval: (approved: boolean) => void;
}
