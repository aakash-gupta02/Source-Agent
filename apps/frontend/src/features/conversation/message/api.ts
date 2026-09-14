import { env } from "@/config/env";
import { api } from "@/lib/api/client";
import type { ApiResponse } from "@/shared/types/api";

import type {
  MessageDto,
  MessageListDto,
  StreamEvent,
} from "@repo/shared/types";

import type {
  PaginationQuery,
  UserCreateMessageInput,
} from "@repo/shared/validations";

const BASE = "/conversation";

type CreateMessageResponse = ApiResponse<MessageDto>;

type GetMessagesResponse = ApiResponse<MessageListDto>;

export const messageApi = {
  create: (conversationId: string, body: UserCreateMessageInput) =>
    api.post<CreateMessageResponse, UserCreateMessageInput>(
      `${BASE}/${conversationId}/messages`,
      body,
    ),

  getList: (conversationId: string, query?: PaginationQuery) => {
    const params = new URLSearchParams();

    if (query?.limit !== undefined) {
      params.set("limit", String(query.limit));
    }

    if (query?.cursor) {
      params.set("cursor", query.cursor);
    }

    if (query?.sortOrder) {
      params.set("sortOrder", query.sortOrder);
    }

    const queryString = params.toString();

    return api.get<GetMessagesResponse>(
      `${BASE}/${conversationId}/messages${
        queryString ? `?${queryString}` : ""
      }`,
    );
  },

  stream: async (
    conversationId: string,
    body: UserCreateMessageInput,
    onEvent: (event: StreamEvent) => void,
  ) => {
    const response = await fetch(
      `${env.apiUrl}/conversation/${conversationId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to send message");
    }

    if (!response.body) {
      throw new Error("Streaming is not supported by this response");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const events = buffer.split("\n\n");

      buffer = events.pop() ?? "";

      for (const event of events) {
        const line = event.split("\n").find((line) => line.startsWith("data:"));

        if (!line) continue;

        const data = line.slice(5).trim();

        if (!data) continue;

        const parsed = JSON.parse(data) as StreamEvent;

        onEvent(parsed);
      }
    }
  },
};
