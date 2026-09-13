"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import type { UserCreateMessageInput } from "@repo/shared/validations";

import { conversationKeys } from "../hooks";

import { messageApi } from "./api";

export const messageKeys = {
  all: [...conversationKeys.all, "messages"] as const,

  list: (conversationId: string) =>
    [...messageKeys.all, conversationId] as const,
};

export function useMessages(conversationId: string) {
  return useInfiniteQuery({
    queryKey: messageKeys.list(conversationId),

    queryFn: async ({ pageParam }) => {
      const response = await messageApi.getList(conversationId, {
        limit: 20,
        cursor: pageParam,
        sortOrder: "asc",
      });

      return response.data;
    },

    initialPageParam: undefined as string | undefined,

    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.nextCursor : undefined,

    enabled: Boolean(conversationId),
  });
}

export function useCreateMessage(conversationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UserCreateMessageInput) =>
      messageApi.create(conversationId, body),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: messageKeys.list(conversationId),
      });
    },
  });
}
