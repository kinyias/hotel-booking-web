import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReview, deleteReview, moderateReview } from './api';
import { CreateReviewInput } from './types';
import { REVIEWS_QUERY_KEY } from './queries';
import { toast } from 'react-hot-toast';

export const useCreateReviewMutation = (hotelId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewInput) => createReview(hotelId, data),
    onSuccess: () => {
      toast.success('Review created successfully');
      queryClient.invalidateQueries({ queryKey: [REVIEWS_QUERY_KEY, hotelId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create review');
    },
  });
};

export const useModerateReviewMutation = (hotelId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isHidden }: { id: string; isHidden: boolean }) =>
      moderateReview(hotelId, id, { isHidden }),
    onSuccess: () => {
      toast.success('Review status updated');
      queryClient.invalidateQueries({ queryKey: [REVIEWS_QUERY_KEY, 'moderation', hotelId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update review');
    },
  });
};

export const useDeleteReviewMutation = (hotelId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteReview(hotelId, id),
    onSuccess: () => {
      toast.success('Review deleted');
      queryClient.invalidateQueries({ queryKey: [REVIEWS_QUERY_KEY, 'moderation', hotelId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete review');
    },
  });
};
