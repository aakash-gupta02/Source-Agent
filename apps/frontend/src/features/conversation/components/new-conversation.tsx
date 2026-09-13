"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ConversationComposer } from "./conversation-composer";
import { ConversationSetupModal } from "./conversation-setup-modal";

import { useCreateConversation } from "@/features/conversation/hooks";
import { messageApi } from "../message/api";
import { toast } from "sonner";

export function NewConversation() {
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [setupOpen, setSetupOpen] = useState(false);

  const createConversation = useCreateConversation();

  const handleSubmit = (value: string) => {
    setMessage(value);
    setSetupOpen(true);
  };

  const handleStart = async (
    databaseConnectionId: string,
    aiProviderId: string,
  ) => {
    try {
      const conversationResponse = await createConversation.mutateAsync({
        databaseConnectionId,
        aiProviderId,
      });

      const conversationId = conversationResponse.data.id;

      await messageApi.create(conversationId, {
        content: message,
      });

      setSetupOpen(false);

      router.push(`/app/c/${conversationId}`);
    } catch (error) {
      toast.error((error as string) || "Failed to start conversation");
    }
  };

  return (
    <>
      <div className="flex h-full min-h-0 flex-1 items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Ask anything about your data
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Get answers from your database using natural language.
            </p>
          </div>

          <ConversationComposer
            value={message}
            onChange={setMessage}
            onSubmit={handleSubmit}
          />
        </div>
      </div>

      <ConversationSetupModal
        open={setupOpen}
        onOpenChange={setSetupOpen}
        message={message}
        onStart={handleStart}
        isStarting={createConversation.isPending}
      />
    </>
  );
}
