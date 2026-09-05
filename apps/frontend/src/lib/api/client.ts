import axios, { type AxiosRequestConfig } from "axios";

import { env } from "@/config/env";

import { setupInterceptors } from "./interceptor";

export {
  ApiError,
  isApiError,
  toApiError,
  tokenStore,
} from "./interceptor";

const axiosClient = axios.create({
  baseURL: env.apiUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
  timeout: 30_000,
});

setupInterceptors(axiosClient);

/**
 * Typed HTTP helpers.
 *
 *   api.get<ApiResponse<AuthUserDto>>("/auth/me")
 *   api.post<ApiResponse<AuthUserDto>, LoginInput>("/auth/login", body)
 */
export const api = {
  get<TResponse>(url: string, config?: AxiosRequestConfig) {
    return axiosClient.get<TResponse>(url, config).then((res) => res.data);
  },

  post<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ) {
    return axiosClient
      .post<TResponse>(url, body, config)
      .then((res) => res.data);
  },

  put<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ) {
    return axiosClient
      .put<TResponse>(url, body, config)
      .then((res) => res.data);
  },

  patch<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ) {
    return axiosClient
      .patch<TResponse>(url, body, config)
      .then((res) => res.data);
  },

  delete<TResponse>(url: string, config?: AxiosRequestConfig) {
    return axiosClient.delete<TResponse>(url, config).then((res) => res.data);
  },
};

export { axiosClient };
