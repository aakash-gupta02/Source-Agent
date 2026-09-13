"use client";

import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useConversation } from "@/features/conversation/hooks";

export default function ConversationPage() {
  const { id } = useParams<{ id: string }>();
  const conversation = useConversation(id);

  if (conversation.isPending) {
    return (
      <main className="flex min-h-svh flex-1 items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
        <span className="sr-only">Loading conversation</span>
      </main>
    );
  }

  if (conversation.isError || !conversation.data) {
    return (
      <main className="flex min-h-svh flex-1 items-center justify-center px-6">
        <p className="text-sm text-muted-foreground">
          This conversation could not be loaded.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-3xl flex-1 flex-col px-6 py-8">
      <h1 className="truncate text-h3 font-semibold text-ink">
        {conversation.data.title ?? "New conversation"}
      </h1>
      <div className="flex flex-1 items-center justify-center">
        <p className="text-body text-gray-600">
          Conversation messages will appear here.
        </p>
      </div>
    </main>
  );
}
