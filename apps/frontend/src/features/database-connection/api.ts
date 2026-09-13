import { api } from "@/lib/api/client";
import type { ApiResponse } from "@/shared/types/api";

import type {
  DatabaseConnectionDetailDto,
  DatabaseConnectionListDto,
} from "@repo/shared/types";

import type {
  CreateDatabaseConnectionInput,
  UpdateDatabaseConnectionInput,
} from "@repo/shared/validations";

const BASE = "/connection";

type CreateDatabaseConnectionResponse = ApiResponse<DatabaseConnectionListDto>;
type GetDatabaseConnectionResponse = ApiResponse<DatabaseConnectionDetailDto>;
type GetDatabaseConnectionListResponse = ApiResponse<
  DatabaseConnectionListDto[]
>;
type UpdateDatabaseConnectionResponse = ApiResponse<DatabaseConnectionListDto>;

export const databaseConnectionApi = {
  create: (body: CreateDatabaseConnectionInput) =>
    api.post<CreateDatabaseConnectionResponse, CreateDatabaseConnectionInput>(
      BASE,
      body,
    ),

  get: (id: string) => api.get<GetDatabaseConnectionResponse>(`${BASE}/${id}`),

  getList: () => api.get<GetDatabaseConnectionListResponse>(BASE),

  update: (id: string, body: UpdateDatabaseConnectionInput) =>
    api.patch<UpdateDatabaseConnectionResponse, UpdateDatabaseConnectionInput>(
      `${BASE}/${id}`,
      body,
    ),
};
