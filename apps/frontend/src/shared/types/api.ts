/**
 * Shared API contracts matching the backend response envelope.
 */

export type ValidationError = {
  path: string;
  message: string;
};

export type ApiResponse<T = unknown> = {
  success: true;
  message: string;
  data: T;
};

/** Success responses that intentionally omit `data` (e.g. logout, refresh). */
export type ApiMessageResponse = {
  success: true;
  message: string;
  data?: undefined;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  errors?: ValidationError[];
};

export type PaginationMeta = {
  nextCursor: string | null;
  hasNextPage: boolean;
};

export type PaginatedResponse<T, K extends string = "items"> = {
  [P in K]: T[];
} & {
  meta: PaginationMeta;
};

export type PaginationParams = {
  limit?: number;
  cursor?: string;
  sortOrder?: "asc" | "desc";
};
