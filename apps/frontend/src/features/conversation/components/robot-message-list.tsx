"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check } from "lucide-react";
import { RobotHead, type RobotHeadState } from "robot-heads";

import { Message, MessageContent } from "@/components/ui/message";
import { MessageScrollerItem } from "@/components/ui/message-scroller";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import { toolLabels } from "../message/constant";
import type { ConversationMessageListProps, ToolActivity } from "../types";
import { ToolExecutionList } from "./tool-execution-list";

const HEAD_SIZE = 56;
const HAPPY_MS = 2500;
const SLEEP_AFTER_MS = 60_000;
const REJECTED_MS = 1600;

const toolRobotStates: Record<string, RobotHeadState> = {
  get_tables: "searching",
  get_schema: "searching",
  get_table_schema: "searching",
  get_table_sample: "searching",
  execute_sql: "working",
};

function getActiveState({
  rejected,
  pendingApproval,
  streamingContent,
  toolActivity,
}: {
  rejected: boolean;
  pendingApproval: boolean;
  streamingContent?: string;
  toolActivity: ToolActivity[];
}): RobotHeadState {
  if (rejected) return "error";
  if (pendingApproval) return "listening";
  if (streamingContent) return "speaking";

  const runningTool = toolActivity.findLast(
    (item) => item.status === "running",
  );

  if (runningTool) return toolRobotStates[runningTool.tool] ?? "working";

  return "thinking";
}

function LatestRobotHead({ celebrate }: { celebrate: boolean }) {
  const [state, setState] = useState<RobotHeadState>(
    celebrate ? "happy" : "idle",
  );

  useEffect(() => {
    if (state === "happy") {
      const timeout = window.setTimeout(() => setState("idle"), HAPPY_MS);
      return () => window.clearTimeout(timeout);
    }

    if (state === "idle") {
      const timeout = window.setTimeout(
        () => setState("sleeping"),
        SLEEP_AFTER_MS,
      );
      return () => window.clearTimeout(timeout);
    }
  }, [state]);

  return (
    <RobotHead
      aria-label={`AI assistant, ${state}`}
      state={state}
      size={HEAD_SIZE}
      floorShadow={false}
      interactive
      onPointerEnter={() => {
        if (state === "sleeping") setState("idle");
      }}
    />
  );
}

export function RobotMessageList({
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
  const [rejected, setRejected] = useState(false);
  const [celebrateId, setCelebrateId] = useState<string | null>(null);

  const hasActiveTurn =
    isStreaming ||
    Boolean(streamingContent) ||
    toolActivity.length > 0 ||
    Boolean(pendingApproval);

  const latestAssistantId = messages.findLast(
    (message) => message.role !== "USER",
  )?.id;

  const [wasActive, setWasActive] = useState(hasActiveTurn);

  if (wasActive !== hasActiveTurn) {
    setWasActive(hasActiveTurn);
    if (!hasActiveTurn) setCelebrateId(latestAssistantId ?? null);
  }

  useEffect(() => {
    if (!rejected) return;

    const timeout = window.setTimeout(() => setRejected(false), REJECTED_MS);
    return () => window.clearTimeout(timeout);
  }, [rejected]);

  const handleApproval = (approved: boolean) => {
    if (!approved) setRejected(true);
    onApproval(approved);
  };

  const activeState = getActiveState({
    rejected,
    pendingApproval: Boolean(pendingApproval),
    streamingContent,
    toolActivity,
  });

  return (
    <>
      {messages.map((message) => {
        const isUser = message.role === "USER";
        const showHead = !hasActiveTurn && message.id === latestAssistantId;

        return (
          <MessageScrollerItem
            key={message.id}
            messageId={message.id}
            className={showHead ? "[content-visibility:visible]" : undefined}
          >
            {showHead ? (
              <div className="mb-3 ml-1 flex justify-start pt-2">
                <LatestRobotHead
                  key={message.id}
                  celebrate={message.id === celebrateId}
                />
              </div>
            ) : null}

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

      {hasActiveTurn ? (
        <MessageScrollerItem
          messageId="robot-head"
          className="[content-visibility:visible]"
        >
          <div className="mb-3 ml-1 flex justify-start pt-2">
            <RobotHead
              aria-label={`AI assistant, ${activeState}`}
              state={activeState}
              size={HEAD_SIZE}
              floorShadow={false}
              interactive
            />
          </div>
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
                    <RobotHead
                      aria-label={`${label}, running`}
                      state={toolRobotStates[item.tool] ?? "working"}
                      size={20}
                      antenna={false}
                      floorShadow={false}
                      interactive={false}
                      seed={index / 10}
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

      {showStreaming && streamingContent ? (
        <MessageScrollerItem
          messageId="streaming"
          className="[content-visibility:visible]"
        >
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
        </MessageScrollerItem>
      ) : null}

      {pendingApproval ? (
        <div className="ml-1 mt-4 rounded-lg border p-4">
          <p className="mb-3 text-sm font-medium">
            This query requires your approval
          </p>

          <pre className="mb-4 overflow-x-auto rounded-md bg-muted p-3 text-sm">
            {pendingApproval.sql}
          </pre>

          <div className="flex gap-2">
            <Button
              onClick={() => handleApproval(false)}
              variant="outline"
              disabled={isStreaming}
            >
              Reject
            </Button>

            <Button
              onClick={() => handleApproval(true)}
              disabled={isStreaming}
            >
              Approve
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}
