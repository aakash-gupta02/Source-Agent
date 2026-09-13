"use client";

import type { MessageDto } from "@repo/shared/types";

interface ConversationMessagesProps {
  messages: MessageDto[];
  isLoading?: boolean;
}

export function ConversationMessages({
  messages,
  isLoading = false,
}: ConversationMessagesProps) {
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading messages...</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6">
      {messages.map((message) => (
        <div key={message.id}>
          {/* We'll properly style this based on your MessageDto */}
          <p className="text-sm">{message.content}</p>
        </div>
      ))}
    </div>
  );
}
