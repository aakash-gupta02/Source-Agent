"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Message, MessageContent } from "@/components/ui/message";

import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";

import { Bubble, BubbleContent } from "@/components/ui/bubble";

interface ConversationMessage {
  id: string;
  role: string;
  content: string;
}

interface ConversationTranscriptProps {
  messages: ConversationMessage[];
}

export function ConversationTranscript({
  messages,
}: ConversationTranscriptProps) {
  return (
    <div className="min-h-0 flex-1">
      <MessageScrollerProvider>
        <MessageScroller>
          <MessageScrollerViewport>
            <MessageScrollerContent className="mx-auto w-full max-w-4xl px-4 py-6">
              {messages.map((message) => {
                const isUser = message.role === "USER";

                return (
                  <MessageScrollerItem
                    key={message.id}
                    messageId={message.id}
                    scrollAnchor={isUser}
                  >
                    <Message align={isUser ? "end" : "start"} className="mb-6">
                      <MessageContent
                        className={
                          isUser ? "max-w-[75%]" : "max-w-[min(100%,42rem)]"
                        }
                      >
                        <Bubble
                          variant={isUser ? "muted" : "ghost"}
                          align={isUser ? "end" : "start"}
                        >
                          <BubbleContent>
                            {isUser ? (
                              <p className="whitespace-pre-wrap">
                                {message.content}
                              </p>
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
            </MessageScrollerContent>
          </MessageScrollerViewport>

          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>
    </div>
  );
}
