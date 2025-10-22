export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    GOOGLE_OAUTH: "/auth/google",
    SESSIONS: "/auth/sessions",
    VERIFY_EMAIL: "/auth/verify-email",
    RESEND_VERIFICATION_EMAIL: "/auth/resend",
  },
  USER:{
     PROFILE: "/users/me",
     USERS: "/users",
     ROLES: "/roles",
     PERMISSIONS: "/permissions"
  }
};