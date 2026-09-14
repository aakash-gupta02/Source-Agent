"use client";

import { ArrowUp, BrainCircuit, Database } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ConversationDetailDto } from "@repo/shared/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ConversationAIProvider } from "./ConversationAIProvider";

interface ConversationComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (message: string) => void;
  conversation?: ConversationDetailDto;
  disabled?: boolean;
}

export function ConversationComposer({
  value,
  onChange,
  onSubmit,
  conversation,
  disabled = false,
}: ConversationComposerProps) {
  const canSubmit = value.trim().length > 0 && !disabled;

  const handleSubmit = () => {
    if (!canSubmit) return;

    onSubmit(value.trim());
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="rounded-2xl border bg-background p-2 shadow-sm">
      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask a question about your data..."
        disabled={disabled}
        className="min-h-20 resize-none border-0 bg-transparent p-3 shadow-none focus-visible:ring-0"
      />

      {conversation ? (
        <div className="flex items-center justify-between px-1 pb-1">
          <div className="flex min-w-0 items-center gap-1">
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    className="flex min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-muted-foreground"
                  />
                }
              >
                <Database className="size-3.5 shrink-0" />
                <span className="truncate">
                  {conversation.databaseConnection.name}
                </span>
              </TooltipTrigger>

              <TooltipContent>
                <p>DB source can&apos;t be changed after creation</p>
              </TooltipContent>
            </Tooltip>

            <div className="h-3.5 w-px bg-border" />

            <ConversationAIProvider conversation={conversation} />
          </div>

          <Button
            type="button"
            size="icon"
            className="size-9 shrink-0 rounded-full"
            disabled={!canSubmit}
            onClick={handleSubmit}
            aria-label="Send message"
          >
            <ArrowUp className="size-4" />
          </Button>
        </div>
      ) : (
        <div className="flex justify-end px-1 pb-1">
          <Button
            type="button"
            size="icon"
            className="size-9 rounded-full"
            disabled={!canSubmit}
            onClick={handleSubmit}
            aria-label="Send message"
          >
            <ArrowUp className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
