import { useQuery } from '@tanstack/react-query';
import { getAdminBanners, getPublicBanners } from './api';

export const BANNER_QUERY_KEYS = {
  all: ['banners'] as const,
  public: () => [...BANNER_QUERY_KEYS.all, 'public'] as const,
  admin: () => [...BANNER_QUERY_KEYS.all, 'admin'] as const,
};

export const usePublicBannersQuery = () => {
  return useQuery({
    queryKey: BANNER_QUERY_KEYS.public(),
    queryFn: getPublicBanners,
  });
};

export const useAdminBannersQuery = () => {
  return useQuery({
    queryKey: BANNER_QUERY_KEYS.admin(),
    queryFn: getAdminBanners,
  });
};
