import { useQuery } from '@tanstack/react-query';
import { getPromotions, getPromotionById } from './api';
import { PromotionsQueryParams } from './types';

export const usePromotionsQuery = (params?: PromotionsQueryParams) => {
  return useQuery({
    queryKey: ['promotions', params],
    queryFn: () => getPromotions(params),
  });
};

export const usePromotionQuery = (id: string) => {
  return useQuery({
    queryKey: ['promotion', id],
    queryFn: () => getPromotionById(id),
    enabled: !!id,
  });
};
