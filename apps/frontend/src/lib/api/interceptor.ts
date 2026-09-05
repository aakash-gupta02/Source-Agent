import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

import { env } from "@/config/env";
import type { ApiErrorResponse, ValidationError } from "@/shared/types/api";

/* -------------------------------------------------------------------------- */
/* Token store (optional Bearer; cookies are primary)                          */
/* -------------------------------------------------------------------------- */

let accessToken: string | null = null;

export const tokenStore = {
  getAccessToken: () => accessToken,
  setAccessToken: (token: string | null) => {
    accessToken = token;
  },
  clear: () => {
    accessToken = null;
  },
};

/* -------------------------------------------------------------------------- */
/* Typed API error                                                             */
/* -------------------------------------------------------------------------- */

export class ApiError extends Error {
  readonly status: number;
  readonly errors: ValidationError[];
  readonly data: ApiErrorResponse | null;

  constructor(
    message: string,
    options: {
      status?: number;
      errors?: ValidationError[];
      data?: ApiErrorResponse | null;
    } = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.status = options.status ?? 500;
    this.errors = options.errors ?? [];
    this.data = options.data ?? null;
  }

  get isUnauthorized() {
    return this.status === 401;
  }

  get isForbidden() {
    return this.status === 403;
  }

  get isNotFound() {
    return this.status === 404;
  }

  get isValidationError() {
    return this.status === 400 && this.errors.length > 0;
  }

  get isConflict() {
    return this.status === 409;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    return new ApiError(
      data?.message ?? error.message ?? "An unexpected error occurred",
      {
        status: error.response?.status ?? 500,
        errors: data?.errors ?? [],
        data: data ?? null,
      },
    );
  }

  if (error instanceof Error) return new ApiError(error.message);
  return new ApiError("An unexpected error occurred");
}

/* -------------------------------------------------------------------------- */
/* Interceptors                                                                */
/* -------------------------------------------------------------------------- */

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let refreshPromise: Promise<void> | null = null;

async function refreshAccessToken() {
  await axios.post(`${env.apiUrl}/auth/refresh`, null, {
    withCredentials: true,
  });
}

export function setupInterceptors(client: AxiosInstance) {
  client.interceptors.request.use(
    (config) => {
      const token = tokenStore.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(toApiError(error)),
  );

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const original = error.config as RetriableConfig | undefined;
      const status = error.response?.status;
      const url = original?.url ?? "";

      const skipRefresh =
        url.includes("/auth/refresh") ||
        url.includes("/auth/login") ||
        url.includes("/auth/register");

      if (status === 401 && original && !original._retry && !skipRefresh) {
        original._retry = true;
        try {
          refreshPromise ??= refreshAccessToken().finally(() => {
            refreshPromise = null;
          });
          await refreshPromise;
          return client(original);
        } catch {
          tokenStore.clear();
          throw toApiError(error);
        }
      }

      throw toApiError(error);
    },
  );
}
