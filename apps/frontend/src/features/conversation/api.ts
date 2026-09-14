import { api } from "@/lib/api/client";
import type { ApiMessageResponse, ApiResponse } from "@/shared/types/api";
import type { ConversationDetailDto, ConversationDto, ConversationListDto } from "@repo/shared/types";
import type {
  CreateConversationInput,
  UpdateConversationInput,
} from "@repo/shared/validations";

const BASE = "/conversation";

type CreateConversationResponse = ApiResponse<ConversationDto>;
type GetConversationResponse = ApiResponse<ConversationDetailDto>;
type GetConversationListResponse = ApiResponse<ConversationListDto[]>;
type UpdateConversationResponse = ApiResponse<ConversationDto>;
type DeleteConversationResponse = ApiMessageResponse;

export const conversationApi = {
  create: (body: CreateConversationInput) =>
    api.post<CreateConversationResponse, CreateConversationInput>(
      BASE,
      body,
    ),
  get: (id: string) => api.get<GetConversationResponse>(`${BASE}/${id}`),
  update: (id: string, body: UpdateConversationInput) =>
    api.patch<UpdateConversationResponse, UpdateConversationInput>(
      `${BASE}/${id}`,
      body,
    ),
  delete: (id: string) =>
    api.delete<DeleteConversationResponse>(`${BASE}/${id}`),

  getList: () => api.get<GetConversationListResponse>(BASE),
};
