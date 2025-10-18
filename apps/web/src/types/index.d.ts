import { AxiosError } from 'axios';
export interface AuthTokens {
  accessToken: string;
  jti: string;
  tokenType: string;
}

export interface ApiErrorResponse {
  message: string;
  errors?: Array<{ param: string; msg: string }> | Record<string, string[]>;
}

export type ApiError = AxiosError<ApiErrorResponse>;
