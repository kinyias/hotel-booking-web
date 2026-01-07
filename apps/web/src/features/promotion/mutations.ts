import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPromotion, updatePromotion, deletePromotion } from './api';
import { CreatePromotionFormValues, UpdatePromotionFormValues } from './validator';
import { toast } from 'react-hot-toast';

export const useCreatePromotionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePromotionFormValues) => createPromotion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      toast.success('Promotion created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create promotion');
    },
  });
};

export const useUpdatePromotionMutation = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdatePromotionFormValues) => updatePromotion(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      queryClient.invalidateQueries({ queryKey: ['promotion', id] });
      toast.success('Promotion updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update promotion');
    },
  });
};

export const useDeletePromotionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePromotion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      toast.success('Promotion deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete promotion');
    },
  });
};
