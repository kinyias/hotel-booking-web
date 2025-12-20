import { useQuery } from '@tanstack/react-query';
import { listHotelReviews, listModerationReviews, listMyReviews } from './api';
import { ListReviewsParams } from './types';

export const REVIEWS_QUERY_KEY = 'reviews';

export const useReviewsQuery = (hotelId: string, params: ListReviewsParams = {}) => {
  return useQuery({
    queryKey: [REVIEWS_QUERY_KEY, hotelId, params],
    queryFn: () => listHotelReviews(hotelId, params),
    enabled: !!hotelId,
  });
};

export const useModerationReviewsQuery = (hotelId: string, params: ListReviewsParams = {}) => {
  return useQuery({
    queryKey: [REVIEWS_QUERY_KEY, 'moderation', hotelId, params],
    queryFn: () => listModerationReviews(hotelId, params),
    enabled: !!hotelId,
  });
};

export const useMyReviewsQuery = (params: ListReviewsParams = {}) => {
  return useQuery({
    queryKey: [REVIEWS_QUERY_KEY, 'my', params],
    queryFn: () => listMyReviews(params),
  });
};
