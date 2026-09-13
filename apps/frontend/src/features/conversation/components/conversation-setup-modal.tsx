"use client";

import { useState } from "react";
import { Database, Sparkles, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useDatabaseConnections } from "@/features/database-connection/hooks";
import { useAIProviders } from "@/features/ai-provider/hooks";

interface ConversationSetupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: string;
  onStart: (databaseConnectionId: string, aiProviderId: string) => void;
  isStarting?: boolean;
}

export function ConversationSetupModal({
  open,
  onOpenChange,
  message,
  onStart,
  isStarting = false,
}: ConversationSetupModalProps) {
  const [databaseConnectionId, setDatabaseConnectionId] = useState("");
  const [aiProviderId, setAiProviderId] = useState("");

  const {
    data: connections,
    isLoading: connectionsLoading,
  } = useDatabaseConnections();

  const {
    data: providers,
    isLoading: providersLoading,
  } = useAIProviders();

  const canStart =
    databaseConnectionId.length > 0 &&
    aiProviderId.length > 0 &&
    !isStarting;

  const handleStart = () => {
    if (!canStart) return;

    onStart(databaseConnectionId, aiProviderId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Start conversation</DialogTitle>

          <DialogDescription>
            Choose the database and AI provider for this conversation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Question */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Your question</p>

            <div className="rounded-lg border bg-muted/40 px-3 py-2.5 text-sm">
              {message}
            </div>
          </div>

          {/* Database */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Database connection</p>

            <Select
              value={databaseConnectionId}
              onValueChange={(value) => setDatabaseConnectionId(value ?? "")}
              disabled={connectionsLoading || isStarting}
            >
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Database className="size-4 text-muted-foreground" />

                  <SelectValue
                    placeholder={
                      connectionsLoading
                        ? "Loading connections..."
                        : "Select a database"
                    }
                  />
                </div>
              </SelectTrigger>

              <SelectContent>
                {connections?.map((connection) => (
                  <SelectItem
                    key={connection.id}
                    value={connection.id}
                  >
                    {connection.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* AI Provider */}
          <div className="space-y-2">
            <p className="text-sm font-medium">AI provider</p>

            <Select
              value={aiProviderId}
              onValueChange={(value) => setAiProviderId(value ?? "")}
              disabled={providersLoading || isStarting}
            >
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-muted-foreground" />

                  <SelectValue
                    placeholder={
                      providersLoading
                        ? "Loading providers..."
                        : "Select an AI provider"
                    }
                  />
                </div>
              </SelectTrigger>

              <SelectContent>
                {providers?.map((provider) => (
                  <SelectItem
                    key={provider.id}
                    value={provider.id}
                  >
                    {provider.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              disabled={isStarting}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button
              disabled={!canStart}
              onClick={handleStart}
            >
              {isStarting && (
                <Loader2 className="size-4 animate-spin" />
              )}

              Start Chat
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}