export enum NotificationType {
  NEW_BOOKING = 'NEW_BOOKING',
  BOOKING_CANCELLED = 'BOOKING_CANCELLED',
  BOOKING_CONFIRMED = 'BOOKING_CONFIRMED',
  CHECK_IN = 'CHECK_IN',
  CHECK_OUT = 'CHECK_OUT',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  SYSTEM = 'SYSTEM',
}

export interface Notification {
  id: string;
  userId: string;
  hotelId?: string;
  bookingId?: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface NotificationListResponse {
  data: Notification[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UnreadCountResponse {
  count: number;
}
