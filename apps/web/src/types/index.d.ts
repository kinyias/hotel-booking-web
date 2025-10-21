import { AxiosError } from 'axios';
export interface ApiErrorResponse {
  message: string;
  errors?: Array<{ param: string; msg: string }> | Record<string, string[]>;
}

export type ApiError = AxiosError<ApiErrorResponse>;
export interface PaginationMeta {
  limit: number;
  offset: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
