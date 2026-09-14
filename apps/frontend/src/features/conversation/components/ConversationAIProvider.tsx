"use client";

import { BrainCircuit, Check, ChevronsUpDown } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import type { ConversationDetailDto } from "@repo/shared/types";

import { useAIProviders } from "@/features/ai-provider/hooks";
import { useUpdateConversation } from "@/features/conversation/hooks";
import { useState } from "react";

interface ConversationAIProviderProps {
  conversation: ConversationDetailDto;
}

export function ConversationAIProvider({
  conversation,
}: ConversationAIProviderProps) {
  const [open, setOpen] = useState(false);

  const { data: providers, isLoading } = useAIProviders();
  const updateConversation = useUpdateConversation(conversation.id);

  const availableProviders =
    providers?.filter((provider) => provider.isActive) ?? [];

  const handleSelect = async (providerId: string) => {
    if (providerId === conversation.aiProviderId) {
      setOpen(false);
      return;
    }

    await updateConversation.mutateAsync({
      aiProviderId: providerId,
    });

    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={updateConversation.isPending}
            className="h-8 max-w-60 px-2 text-xs text-muted-foreground"
          />
        }
      >
        <BrainCircuit className="size-3.5 shrink-0" />

        <span className="truncate">
          {conversation.aiProvider.name}
        </span>

        <span className="truncate text-muted-foreground/70">
          · {conversation.aiProvider.model}
        </span>

        <ChevronsUpDown className="ml-1 size-3 shrink-0" />
      </PopoverTrigger>

      <PopoverContent align="start" className="w-72 p-2">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">AI Provider</p>
          <p className="text-xs text-muted-foreground">
            Choose the model for this conversation.
          </p>
        </div>

        <div className="mt-1 space-y-1">
          {isLoading ? (
            <p className="px-2 py-3 text-xs text-muted-foreground">
              Loading providers...
            </p>
          ) : availableProviders.length === 0 ? (
            <p className="px-2 py-3 text-xs text-muted-foreground">
              No active AI providers available.
            </p>
          ) : (
            availableProviders.map((provider) => {
              const selected =
                provider.id === conversation.aiProviderId;

              return (
                <button
                  key={provider.id}
                  type="button"
                  disabled={updateConversation.isPending}
                  onClick={() => void handleSelect(provider.id)}
                  className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
                >
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm">
                      {provider.name}
                    </span>

                    <span className="truncate text-xs text-muted-foreground">
                      {provider.model}
                    </span>
                  </div>

                  {selected ? (
                    <Check className="size-4 shrink-0" />
                  ) : null}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}