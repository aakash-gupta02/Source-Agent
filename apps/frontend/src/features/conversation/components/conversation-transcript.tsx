"use client";

import { useEffect, useLayoutEffect, useState } from "react";

import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
  useMessageScrollerScrollable,
} from "@/components/ui/message-scroller";
import { MessageDtoWithMetadata, SqlApproval } from "@repo/shared/types";
import { useAssistantInterface } from "@/features/user-preferences/assistant-interface";
import type { ConversationMessageListProps, ToolActivity } from "../types";
import { OrbMessageList } from "./orb-message-list";
import { RobotMessageList } from "./robot-message-list";

interface ConversationTranscriptProps {
  messages: MessageDtoWithMetadata[];
  pendingUserContent?: string;
  streamingContent?: string;
  isStreaming?: boolean;
  toolActivity?: ToolActivity[];
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadOlder?: () => void;
  pendingApproval?: SqlApproval | null;
  onApproval: (approved: boolean) => void;
}

function LoadOlderOnStart({
  enabled,
  onLoadOlder,
}: {
  enabled: boolean;
  onLoadOlder: () => void;
}) {
  const { start } = useMessageScrollerScrollable();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setReady(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!ready || !enabled || start) return;

    onLoadOlder();
  }, [enabled, onLoadOlder, ready, start]);

  return null;
}

function FollowBottomOnUpdate({
  active,
  tick,
}: {
  active: boolean;
  tick?: string;
}) {
  const { scrollToEnd } = useMessageScroller();
  const { end } = useMessageScrollerScrollable();

  useLayoutEffect(() => {
    if (!active || end) return;

    scrollToEnd({ behavior: "auto" });
  }, [active, end, scrollToEnd, tick]);

  return null;
}

export function ConversationTranscript({
  messages,
  pendingUserContent,
  streamingContent,
  isStreaming = false,
  toolActivity = [],
  hasNextPage = false,
  pendingApproval,
  onApproval,
  isFetchingNextPage = false,
  onLoadOlder,
}: ConversationTranscriptProps) {
  const assistantInterface = useAssistantInterface();

  const showPendingUser =
    Boolean(pendingUserContent) &&
    !messages.some(
      (message) =>
        message.role === "USER" && message.content === pendingUserContent,
    );

  const lastAssistant = [...messages]
    .reverse()
    .find((message) => message.role !== "USER");

  const showStreaming =
    (isStreaming || Boolean(streamingContent)) &&
    !(
      lastAssistant &&
      streamingContent &&
      lastAssistant.content === streamingContent
    );

  const messageListProps: ConversationMessageListProps = {
    messages,
    pendingUserContent,
    streamingContent,
    isStreaming,
    toolActivity,
    pendingApproval,
    showPendingUser,
    showStreaming,
    onApproval,
  };

  return (
    <div className="min-h-0 flex-1 overflow-hidden">
      <MessageScrollerProvider autoScroll>
        {onLoadOlder ? (
          <LoadOlderOnStart
            enabled={hasNextPage && !isFetchingNextPage}
            onLoadOlder={onLoadOlder}
          />
        ) : null}

        <FollowBottomOnUpdate
          active={showPendingUser || showStreaming}
          tick={streamingContent}
        />

        <MessageScroller>
          {isFetchingNextPage ? (
            <p className="pointer-events-none absolute inset-x-0 top-3 z-10 text-center text-xs text-muted-foreground">
              Loading earlier messages...
            </p>
          ) : null}

          <MessageScrollerViewport>
            <MessageScrollerContent className="mx-auto w-full max-w-4xl px-4 py-6">
              {assistantInterface === "robot" ? (
                <RobotMessageList {...messageListProps} />
              ) : (
                <OrbMessageList {...messageListProps} />
              )}
            </MessageScrollerContent>
          </MessageScrollerViewport>

          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>
    </div>
  );
}
