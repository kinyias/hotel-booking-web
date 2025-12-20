import api from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/api';
import { CreateReviewInput, ListReviewsParams, ListReviewsResponse, Review } from './types';

export const listHotelReviews = async (hotelId: string, params: ListReviewsParams) => {
  const response = await api.get<ListReviewsResponse>(
    `${API_ENDPOINTS.HOTEL.HOTELS}/${hotelId}/reviews`,
    { params }
  );
  return response.data;
};

export const createReview = async (hotelId: string, data: CreateReviewInput) => {
  const response = await api.post<Review>(
    `${API_ENDPOINTS.HOTEL.HOTELS}/${hotelId}/reviews`,
    data
  );
  return response.data;
};
