import { api } from "@/lib/api/client";
import type { ApiResponse } from "@/shared/types/api";

import type { MessageDto, MessageListDto } from "@repo/shared/types";

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
};
