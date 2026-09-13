"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  CreateAIProviderInput,
  UpdateAIProviderInput,
} from "@repo/shared/validations";

import { aiProviderApi } from "./api";

export const aiProviderKeys = {
  all: ["ai-providers"] as const,

  lists: () => [...aiProviderKeys.all, "list"] as const,

  detail: (id: string) => [...aiProviderKeys.all, "detail", id] as const,
};

export function useAIProviders() {
  return useQuery({
    queryKey: aiProviderKeys.lists(),

    queryFn: async () => {
      const response = await aiProviderApi.getList();

      return response.data;
    },
  });
}

export function useAIProvider(id: string) {
  return useQuery({
    queryKey: aiProviderKeys.detail(id),

    queryFn: async () => {
      const response = await aiProviderApi.get(id);

      return response.data;
    },

    enabled: Boolean(id),
  });
}

export function useCreateAIProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateAIProviderInput) => aiProviderApi.create(body),

    onSuccess: (response) => {
      queryClient.setQueryData(
        aiProviderKeys.detail(response.data.id),
        response.data,
      );

      void queryClient.invalidateQueries({
        queryKey: aiProviderKeys.lists(),
      });
    },
  });
}

export function useUpdateAIProvider(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateAIProviderInput) => aiProviderApi.update(id, body),

    onSuccess: (response) => {
      queryClient.setQueryData(aiProviderKeys.detail(id), response.data);

      void queryClient.invalidateQueries({
        queryKey: aiProviderKeys.lists(),
      });
    },
  });
}
