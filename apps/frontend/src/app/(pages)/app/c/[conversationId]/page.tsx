import { Conversation } from "@/features/conversation/components/conversation";

interface PageProps {
  params: Promise<{
    conversationId: string;
  }>;
}

export default async function ConversationPage({
  params,
}: PageProps) {
  const { conversationId } = await params;

  return <Conversation conversationId={conversationId} />;
}