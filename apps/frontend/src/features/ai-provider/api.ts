import { api } from "@/lib/api/client";
import type { ApiResponse } from "@/shared/types/api";
import type {
  AIProviderDetailDto,
  AIProviderListDto,
} from "@repo/shared/types";
import type {
  CreateAIProviderInput,
  UpdateAIProviderInput,
} from "@repo/shared/validations";

const BASE = "/aiProvider";

type CreateAIProviderResponse = ApiResponse<AIProviderListDto>;
type GetAIProviderResponse = ApiResponse<AIProviderDetailDto>;
type GetAIProviderListResponse = ApiResponse<AIProviderListDto[]>;
type UpdateAIProviderResponse = ApiResponse<AIProviderListDto>;

export const aiProviderApi = {
  create: (body: CreateAIProviderInput) =>
    api.post<CreateAIProviderResponse, CreateAIProviderInput>(
      BASE,
      body,
    ),

  get: (id: string) =>
    api.get<GetAIProviderResponse>(`${BASE}/${id}`),

  update: (id: string, body: UpdateAIProviderInput) =>
    api.patch<UpdateAIProviderResponse, UpdateAIProviderInput>(
      `${BASE}/${id}`,
      body,
    ),

  getList: () =>
    api.get<GetAIProviderListResponse>(BASE),
};

