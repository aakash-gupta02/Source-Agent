"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { LoginInput, RegisterInput } from "@repo/shared/validations";

import { tokenStore } from "@/lib/api/client";

import { authApi } from "./api";

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

export function useCurrentUser(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: async () => {
      const response = await authApi.me();
      return response.data;
    },
    enabled: options?.enabled ?? true,
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: LoginInput) => authApi.login(body),
    onSuccess: (response) => {
      queryClient.setQueryData(authKeys.me(), response.data);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: RegisterInput) => authApi.register(body),
    onSuccess: (response) => {
      queryClient.setQueryData(authKeys.me(), response.data);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: async () => {
      tokenStore.clear();
      queryClient.setQueryData(authKeys.me(), null);
      await queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
}
