import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReview } from './api';
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
