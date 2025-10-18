export interface LoginResponse {
  accessToken: string;
  jti: string;
  tokenType: string;
}
export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}