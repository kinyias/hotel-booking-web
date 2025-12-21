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
     PERMISSIONS: "/permissions",
     ACTIONS: "/actions"
  },
  HOTEL: {
    HOTELS: "/hotels",
  },
  AMENITIES: {
    AMENITIES: "/amenities",
  },
  BOOKING: {
    BOOKINGS: "/bookings",
  },
  ROOM_TYPES: {
    ROOM_TYPES: "/room-types",
  },
  GALLERY: {
    FOLDERS: "/upload/db-folders",
    CREATE_FOLDER: "/upload/create-folder",
  },
  COMMISSION_PACKAGES: {
    COMMISSION_PACKAGES: "/admin/commission-packages",
  },
  REVIEWS: {
    REVIEWS: "/reviews",
  },
  DASHBOARD: {
    DASHBOARD: "/dashboard",
  }
};
