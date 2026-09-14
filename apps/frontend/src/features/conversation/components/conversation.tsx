"use client";

import { useCallback, useMemo, useState } from "react";

import { ConversationComposer } from "./conversation-composer";
import { ConversationTranscript } from "./conversation-transcript";

import { useConversation } from "@/features/conversation/hooks";
import { useMessages } from "@/features/conversation/message/hooks";
import { messageApi } from "@/features/conversation/message/api";

interface ConversationProps {
  conversationId: string;
}

export function Conversation({ conversationId }: ConversationProps) {
  const [message, setMessage] = useState("");
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const {
    data: conversation,
    isLoading: conversationLoading,
    isError: conversationError,
  } = useConversation(conversationId);

  const {
    data: messageData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useMessages(conversationId);

  const messages = useMemo(
    () =>
      [...(messageData?.pages ?? [])]
        .reverse()
        .flatMap((page) => [...page.messages].reverse()),
    [messageData],
  );

  const handleLoadOlder = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    void fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleSubmit = async (content: string) => {
    if (isStreaming) return;

    setMessage("");
    setStreamingContent("");
    setIsStreaming(true);

    try {
      await messageApi.stream(
        conversationId,
        { content },
        (event) => {
          if (event.type === "message") {
            setStreamingContent((previous) => previous + event.content);
          }

          if (event.type === "error") {
            throw new Error(event.message);
          }
        },
      );

      await refetch();
      setStreamingContent("");
    } catch (error) {
      console.error("Failed to stream message:", error);
    } finally {
      setIsStreaming(false);
    }
  };

  if (conversationLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading conversation...
        </p>
      </div>
    );
  }

  if (conversationError || !conversation) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Conversation not found.
        </p>
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

      <ConversationTranscript
        messages={messages}
        streamingContent={streamingContent}
        hasNextPage={Boolean(hasNextPage)}
        isFetchingNextPage={isFetchingNextPage}
        onLoadOlder={handleLoadOlder}
      />

      <div className="shrink-0 px-4 pb-4 pt-2">
        <div className="mx-auto w-full max-w-4xl">
          <ConversationComposer
            value={message}
            onChange={setMessage}
            onSubmit={handleSubmit}
            disabled={isStreaming}
          />
        </div>
      </div>
    </div>
  );
}