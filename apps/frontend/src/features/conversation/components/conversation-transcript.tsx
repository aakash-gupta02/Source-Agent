"use client";

import { useEffect, useState } from "react";
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
  streamingContent?: string;
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

export function ConversationTranscript({
  messages,
  streamingContent,
  hasNextPage = false,
  isFetchingNextPage = false,
  onLoadOlder,
}: ConversationTranscriptProps) {
  return (
    <div className="min-h-0 flex-1 overflow-hidden">
      <MessageScrollerProvider>
        {onLoadOlder ? (
          <LoadOlderOnStart
            enabled={hasNextPage && !isFetchingNextPage}
            onLoadOlder={onLoadOlder}
          />
        ) : null}

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

              {streamingContent ? (
                <Message align="start" className="mb-6">
                  <MessageContent className="max-w-[min(100%,42rem)]">
                    <Bubble variant="ghost" align="start">
                      <BubbleContent>
                        <div className="typeset typeset-chat">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {streamingContent}
                          </ReactMarkdown>
                        </div>
                      </BubbleContent>
                    </Bubble>
                  </MessageContent>
                </Message>
              ) : null}
              
            </MessageScrollerContent>
          </MessageScrollerViewport>

          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>
    </div>
  );
}
