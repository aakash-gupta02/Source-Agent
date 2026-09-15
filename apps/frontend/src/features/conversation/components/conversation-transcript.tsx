"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, LoaderCircle } from "lucide-react";

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
import { toolLabels } from "../message/constant";
import {
  MessageDtoWithMetadata,
  ToolExecutionMetadata,
} from "@repo/shared/types";

interface ToolActivity {
  tool: string;
  status: "running" | "completed";
}

interface ConversationTranscriptProps {
  messages: MessageDtoWithMetadata[];
  pendingUserContent?: string;
  streamingContent?: string;
  isStreaming?: boolean;
  toolActivity?: ToolActivity[];
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

function ToolExecutionList({ tools }: { tools?: ToolExecutionMetadata[] }) {
  if (!tools?.length) return null;

  return (
    <div className="mb-4 ml-1 space-y-1 text-sm text-muted-foreground">
      {tools.map((tool, index) => {
        const label = toolLabels[tool.name] ?? tool.name;

        return (
          <p key={`${tool.name}-${index}`} className="flex items-center gap-2">
            <Check className="size-3" />

            <span>{label}</span>
          </p>
        );
      })}
    </div>
  );
}

export function ConversationTranscript({
  messages,
  pendingUserContent,
  streamingContent,
  isStreaming = false,
  toolActivity = [],
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
                    {!isUser ? (
                      <ToolExecutionList tools={message.metadata?.tools} />
                    ) : null}

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
                <MessageScrollerItem messageId="pending-user" scrollAnchor>
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

              {toolActivity.length > 0 ? (
                <MessageScrollerItem
                  messageId="tool-activity"
                  className="[content-visibility:visible]"
                >
                  <div className="mb-4 ml-1 space-y-1 text-sm text-muted-foreground">
                    {toolActivity.map((item, index) => {
                      const label = toolLabels[item.tool] ?? item.tool;

                      return (
                        <p
                          key={`${item.tool}-${index}`}
                          className="flex items-center gap-2"
                        >
                          {item.status === "running" ? (
                            <LoaderCircle className="size-3 animate-spin" />
                          ) : (
                            <Check className="size-3" />
                          )}

                          <span>
                            {item.status === "running" ? `${label}...` : label}
                          </span>
                        </p>
                      );
                    })}
                  </div>
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
