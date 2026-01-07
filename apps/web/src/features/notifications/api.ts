import api from '@/lib/axios';
import { NotificationListResponse, UnreadCountResponse } from './types';

export const getNotifications = async (page = 1, limit = 10): Promise<NotificationListResponse> => {
  const response = await api.get('/notifications', {
    params: { page, limit },
  });
  return response.data;
};

export const getUnreadCount = async (): Promise<UnreadCountResponse> => {
  const response = await api.get('/notifications/unread-count');
  return response.data;
};

export const markAsRead = async (id: string): Promise<{ ok: boolean }> => {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data;
};

export const markAllAsRead = async (): Promise<{ ok: boolean }> => {
  const response = await api.patch('/notifications/read-all');
  return response.data;
};

export const deleteNotification = async (id: string): Promise<void> => {
  await api.delete(`/notifications/${id}`);
};

