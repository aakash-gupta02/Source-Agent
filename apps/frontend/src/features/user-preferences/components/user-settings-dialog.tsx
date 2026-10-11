"use client";

import { RobotHead } from "robot-heads";
import { ThinkingOrb } from "thinking-orbs";
import { cn } from "cn";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  type AssistantInterface,
  setAssistantInterface,
  useAssistantInterface,
} from "../assistant-interface";

const options: {
  value: AssistantInterface;
  title: string;
  description: string;
}[] = [
  {
    value: "orb",
    title: "Thinking orbs",
    description: "Minimal animated orbs next to each step.",
  },
  {
    value: "robot",
    title: "Robot head",
    description: "An expressive robot that reacts as the agent works.",
  },
];

interface UserSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserSettingsDialog({
  open,
  onOpenChange,
}: UserSettingsDialogProps) {
  const assistantInterface = useAssistantInterface();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Preferences are saved in this browser.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <p className="text-sm font-medium">Assistant interface</p>

          <div
            role="radiogroup"
            aria-label="Assistant interface"
            className="grid grid-cols-2 gap-3"
          >
            {options.map((option) => {
              const selected = assistantInterface === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setAssistantInterface(option.value)}
                  className={cn(
                    "flex flex-col items-center gap-3 rounded-2xl border p-4 text-center transition-colors outline-none hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring",
                    selected && "border-primary bg-muted/50",
                  )}
                >
                  <span className="flex h-16 items-center justify-center">
                    {option.value === "orb" ? (
                      <ThinkingOrb state="breathing" size={32} theme="auto" />
                    ) : (
                      <RobotHead
                        state={selected ? "happy" : "idle"}
                        size={48}
                        floorShadow={false}
                        interactive={false}
                      />
                    )}
                  </span>

                  <span className="space-y-1">
                    <span className="block text-sm font-medium">
                      {option.title}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {option.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
