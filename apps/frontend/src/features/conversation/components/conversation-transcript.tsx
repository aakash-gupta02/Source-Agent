"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Message, MessageContent } from "@/components/ui/message";

import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
  useMessageScrollerScrollable,
} from "@/components/ui/message-scroller";

import { Bubble, BubbleContent } from "@/components/ui/bubble";

interface ConversationMessage {
  id: string;
  role: string;
  content: string;
}

interface ConversationTranscriptProps {
  messages: ConversationMessage[];
  pendingUserContent?: string;
  streamingContent?: string;
  isStreaming?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadOlder?: () => void;
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
  hasNextPage = false,
  isFetchingNextPage = false,
  onLoadOlder,
}: ConversationTranscriptProps) {
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
              {messages.map((message) => {
                const isUser = message.role === "USER";

                return (
                  <MessageScrollerItem
                    key={message.id}
                    messageId={message.id}
                    scrollAnchor={isUser}
                  >
                    <Message align={isUser ? "end" : "start"} className="mb-6">
                      <MessageContent
                        className={
                          isUser ? "max-w-[75%]" : "max-w-[min(100%,42rem)]"
                        }
                      >
                        <Bubble
                          variant={isUser ? "muted" : "ghost"}
                          align={isUser ? "end" : "start"}
                        >
                          <BubbleContent>
                            {isUser ? (
                              <p className="whitespace-pre-wrap">
                                {message.content}
                              </p>
                            ) : (
                              <div className="typeset typeset-chat">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                  {message.content}
                                </ReactMarkdown>
                              </div>
                            )}
                          </BubbleContent>
                        </Bubble>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                );
              })}

              {showPendingUser ? (
                <MessageScrollerItem
                  messageId="pending-user"
                  scrollAnchor
                >
                  <Message align="end" className="mb-6">
                    <MessageContent className="max-w-[75%]">
                      <Bubble variant="muted" align="end">
                        <BubbleContent>
                          <p className="whitespace-pre-wrap">
                            {pendingUserContent}
                          </p>
                        </BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
              ) : null}

              {showStreaming ? (
                <MessageScrollerItem
                  messageId="streaming"
                  className="[content-visibility:visible]"
                >
                  <Message align="start" className="mb-6">
                    <MessageContent className="max-w-[min(100%,42rem)]">
                      <Bubble variant="ghost" align="start">
                        <BubbleContent>
                          {streamingContent ? (
                            <div className="typeset typeset-chat">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {streamingContent}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            <span className="inline-block h-4 w-1 animate-pulse bg-foreground/70" />
                          )}
                        </BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
              ) : null}
            </MessageScrollerContent>
          </MessageScrollerViewport>

          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>
    </div>
  );
}
