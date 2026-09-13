"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  CreateDatabaseConnectionInput,
  UpdateDatabaseConnectionInput,
} from "@repo/shared/validations";

import { databaseConnectionApi } from "./api";

export const databaseConnectionKeys = {
  all: ["database-connections"] as const,
  lists: () => [...databaseConnectionKeys.all, "list"] as const,
  detail: (id: string) =>
    [...databaseConnectionKeys.all, "detail", id] as const,
};

export function useDatabaseConnections() {
  return useQuery({
    queryKey: databaseConnectionKeys.lists(),

    queryFn: async () => {
      const response = await databaseConnectionApi.getList();

      return response.data;
    },
  });
}

export function useDatabaseConnection(id: string) {
  return useQuery({
    queryKey: databaseConnectionKeys.detail(id),

    queryFn: async () => {
      const response = await databaseConnectionApi.get(id);

      return response.data;
    },

    enabled: Boolean(id),
  });
}

export function useCreateDatabaseConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateDatabaseConnectionInput) =>
      databaseConnectionApi.create(body),

    onSuccess: (response) => {
      queryClient.setQueryData(
        databaseConnectionKeys.detail(response.data.id),
        response.data,
      );

      void queryClient.invalidateQueries({
        queryKey: databaseConnectionKeys.lists(),
      });
    },
  });
}

export function useUpdateDatabaseConnection(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateDatabaseConnectionInput) =>
      databaseConnectionApi.update(id, body),

    onSuccess: (response) => {
      queryClient.setQueryData(
        databaseConnectionKeys.detail(id),
        response.data,
      );

      void queryClient.invalidateQueries({
        queryKey: databaseConnectionKeys.lists(),
      });
    },
  });
}
