import api from '@/lib/axios';
import { PaginatedResponse } from '@/types';
import { 
  Promotion, 
  PromotionsQueryParams,  
} from './types';
import { CreatePromotionFormValues, UpdatePromotionFormValues } from './validator';

export const getPromotions = async (params?: PromotionsQueryParams) => {
  const response = await api.get<PaginatedResponse<Promotion>>('/promotions', { params });
  return response.data;
};

export const getPublicPromotions = async (params?: PromotionsQueryParams) => {
  const response = await api.get<PaginatedResponse<Promotion>>('/promotions/public', { params });
  return response.data;
};

export const getPromotionById = async (id: string) => {
  const response = await api.get<Promotion>(`/promotions/${id}`);
  return response.data;
};

export const createPromotion = async (payload: CreatePromotionFormValues) => {
  const response = await api.post<Promotion>('/promotions', payload);
  return response.data;
};

export const updatePromotion = async (id: string, payload: UpdatePromotionFormValues) => {
  const response = await api.patch<Promotion>(`/promotions/${id}`, payload);
  return response.data;
};

export const deletePromotion = async (id: string) => {
  const response = await api.delete(`/promotions/${id}`);
  return response.data;
};
