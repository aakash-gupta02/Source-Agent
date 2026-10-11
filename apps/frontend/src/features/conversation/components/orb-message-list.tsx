"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check } from "lucide-react";
import { ThinkingOrb } from "thinking-orbs";

import { Message, MessageContent } from "@/components/ui/message";
import { MessageScrollerItem } from "@/components/ui/message-scroller";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import { toolLabels, toolOrbStates } from "../message/constant";
import type { ConversationMessageListProps } from "../types";
import { ToolExecutionList } from "./tool-execution-list";

export function OrbMessageList({
  messages,
  pendingUserContent,
  streamingContent,
  isStreaming,
  toolActivity,
  pendingApproval,
  showPendingUser,
  showStreaming,
  onApproval,
}: ConversationMessageListProps) {
  return (
    <>
      {messages.map((message) => {
        const isUser = message.role === "USER";

        return (
          <MessageScrollerItem key={message.id} messageId={message.id}>
            {!isUser ? (
              <ToolExecutionList tools={message.metadata?.tools} />
            ) : null}

            <Message align={isUser ? "end" : "start"} className="mb-6">
              <MessageContent
                className={isUser ? "max-w-[75%]" : "max-w-[min(100%,42rem)]"}
              >
                <Bubble
                  variant={isUser ? "muted" : "ghost"}
                  align={isUser ? "end" : "start"}
                >
                  <BubbleContent>
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{message.content}</p>
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
        <MessageScrollerItem messageId="pending-user">
          <Message align="end" className="mb-6">
            <MessageContent className="max-w-[75%]">
              <Bubble variant="muted" align="end">
                <BubbleContent>
                  <p className="whitespace-pre-wrap">{pendingUserContent}</p>
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
          <div className="mb-4 ml-1 space-y-2 text-sm text-muted-foreground">
            {toolActivity.map((item, index) => {
              const label = toolLabels[item.tool] ?? item.tool;

              return (
                <p
                  key={`${item.tool}-${index}`}
                  className="flex items-center gap-2"
                >
                  {item.status === "running" ? (
                    <ThinkingOrb
                      state={toolOrbStates[item.tool] ?? "working"}
                      size={20}
                      theme="auto"
                    />
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
                    <ThinkingOrb state="composing" size={20} theme="auto" />
                  )}
                </BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
        </MessageScrollerItem>
      ) : null}

      {pendingApproval ? (
        <div className="ml-1 mt-4 rounded-lg border p-4">
          <div className="mb-3 flex items-center gap-2">
            <ThinkingOrb state="listening" size={20} theme="auto" paused />

            <p className="text-sm font-medium">
              This query requires your approval
            </p>
          </div>

          <pre className="mb-4 overflow-x-auto rounded-md bg-muted p-3 text-sm">
            {pendingApproval.sql}
          </pre>

          <div className="flex gap-2">
            <Button
              onClick={() => onApproval(false)}
              variant="outline"
              disabled={isStreaming}
            >
              Reject
            </Button>

            <Button onClick={() => onApproval(true)} disabled={isStreaming}>
              Approve
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}
