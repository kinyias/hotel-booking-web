import { useQuery } from '@tanstack/react-query';
import { listHotelReviews } from './api';
import { ListReviewsParams } from './types';

export const REVIEWS_QUERY_KEY = 'reviews';

export const useReviewsQuery = (hotelId: string, params: ListReviewsParams = {}) => {
  return useQuery({
    queryKey: [REVIEWS_QUERY_KEY, hotelId, params],
    queryFn: () => listHotelReviews(hotelId, params),
    enabled: !!hotelId,
  });
};
