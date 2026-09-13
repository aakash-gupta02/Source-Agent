"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CreateConversationInput,
  UpdateConversationInput,
} from "@repo/shared/validations";

import { conversationApi } from "./api";

export const conversationKeys = {
  all: ["conversations"] as const,
  lists: () => [...conversationKeys.all, "list"] as const,
  detail: (id: string) => [...conversationKeys.all, "detail", id] as const,
};

export function useConversations() {
  return useQuery({
    queryKey: conversationKeys.lists(),
    queryFn: async () => {
      const response = await conversationApi.getList();
      return response.data;
    },
  });
}

export function useConversation(id: string) {
  return useQuery({
    queryKey: conversationKeys.detail(id),
    queryFn: async () => {
      const response = await conversationApi.get(id);
      return response.data;
    },
    enabled: Boolean(id),
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateConversationInput) =>
      conversationApi.create(body),
    onSuccess: (response) => {
      queryClient.setQueryData(
        conversationKeys.detail(response.data.id),
        response.data,
      );
      void queryClient.invalidateQueries({
        queryKey: conversationKeys.lists(),
      });
    },
  });
}

export function useUpdateConversation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateConversationInput) =>
      conversationApi.update(id, body),
    onSuccess: (response) => {
      queryClient.setQueryData(conversationKeys.detail(id), response.data);
      void queryClient.invalidateQueries({
        queryKey: conversationKeys.lists(),
      });
    },
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => conversationApi.delete(id),
    onSuccess: (_response, id) => {
      queryClient.removeQueries({ queryKey: conversationKeys.detail(id) });
      void queryClient.invalidateQueries({
        queryKey: conversationKeys.lists(),
      });
    },
  });
}
