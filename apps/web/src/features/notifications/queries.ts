import { useQuery } from '@tanstack/react-query';
import { getNotifications, getUnreadCount } from './api';

export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (page: number, limit: number) => [...notificationKeys.lists(), { page, limit }] as const,
  unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
};

export const useNotifications = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: notificationKeys.list(page, limit),
    queryFn: () => getNotifications(page, limit),
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: () => getUnreadCount(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

