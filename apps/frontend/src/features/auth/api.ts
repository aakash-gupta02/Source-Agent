import type { AuthUserDto } from "@repo/shared/types";
import type { LoginInput, RegisterInput } from "@repo/shared/validations";

import { env } from "@/config/env";
import { api } from "@/lib/api/client";
import type { ApiMessageResponse, ApiResponse } from "@/shared/types/api";

export type { AuthUserDto } from "@repo/shared/types";
export type { LoginInput, RegisterInput } from "@repo/shared/validations";

type LoginResponse = ApiResponse<AuthUserDto>;
type RegisterResponse = ApiResponse<AuthUserDto>;
type CurrentUserResponse = ApiResponse<AuthUserDto>;
type LogoutResponse = ApiMessageResponse;
type RefreshResponse = ApiMessageResponse;

const BASE = "/auth";

export const authApi = {
  login: (body: LoginInput) =>
    api.post<LoginResponse, LoginInput>(`${BASE}/login`, body),

  register: (body: RegisterInput) =>
    api.post<RegisterResponse, RegisterInput>(`${BASE}/register`, body),

  me: () => api.get<CurrentUserResponse>(`${BASE}/me`),

  logout: () => api.post<LogoutResponse>(`${BASE}/logout`),

  refresh: () => api.post<RefreshResponse>(`${BASE}/refresh`),

  /** Full-page redirect; backend sets cookies and redirects back. */
  getGoogleAuthUrl: () => `${env.apiUrl}${BASE}/google`,
};
