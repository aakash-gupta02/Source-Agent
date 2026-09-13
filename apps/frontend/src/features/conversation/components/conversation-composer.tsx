"use client";

import { ArrowUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ConversationComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (message: string) => void;
  disabled?: boolean;
}

export function ConversationComposer({
  value,
  onChange,
  onSubmit,
  disabled = false,
}: ConversationComposerProps) {
  const canSubmit = value.trim().length > 0 && !disabled;

  const handleSubmit = () => {
    if (!canSubmit) return;

    onSubmit(value.trim());
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
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
    </div>
  );
}