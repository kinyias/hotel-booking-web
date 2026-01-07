import { useQuery } from '@tanstack/react-query';
import { getPromotions, getPromotionById, getPublicPromotions } from './api';
import { PromotionsQueryParams } from './types';

export const usePromotionsQuery = (params?: PromotionsQueryParams) => {
  return useQuery({
    queryKey: ['promotions', params],
    queryFn: () => getPromotions(params),
  });
};

export const usePublicPromotionsQuery = (params?: PromotionsQueryParams) => {
  return useQuery({
    queryKey: ['public-promotions', params],
    queryFn: () => getPublicPromotions(params),
    enabled: !!params?.search,
  });
};

export const usePromotionQuery = (id: string) => {
  return useQuery({
    queryKey: ['promotion', id],
    queryFn: () => getPromotionById(id),
    enabled: !!id,
  });
};
