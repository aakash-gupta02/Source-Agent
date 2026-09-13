"use client";

import { ConversationComposer } from "./conversation-composer";
import { ConversationTranscript } from "./conversation-transcript";

import { useConversation } from "@/features/conversation/hooks";
import { useMessages } from "@/features/conversation/message/hooks";

interface ConversationProps {
  conversationId: string;
}

export function Conversation({ conversationId }: ConversationProps) {
  const {
    data: conversation,
    isLoading: conversationLoading,
    isError: conversationError,
  } = useConversation(conversationId);

  const { data: messageData } = useMessages(conversationId);

  const messages = messageData?.pages.flatMap((page) => page.messages) ?? [];

  if (conversationLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading conversation...</p>
      </div>
    );
  }

  if (conversationError || !conversation) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">Conversation not found.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <header className="shrink-0 border-b px-6 py-4">
        <h1 className="font-medium">
          {conversation.title || "New conversation"}
        </h1>
      </header>

      <ConversationTranscript messages={messages} />

      <div className="shrink-0 px-4 pb-4 pt-2">
        <div className="mx-auto w-full max-w-4xl">
          <ConversationComposer
            value=""
            onChange={() => {}}
            onSubmit={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
