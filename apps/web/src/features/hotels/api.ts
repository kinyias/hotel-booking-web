import { API_ENDPOINTS } from '@/constants';
import api from '@/lib/axios';
import { PaginatedResponse } from '@/types';
import { Hotel, HotelsQueryParams } from './types';

export const getHotels = async (params?: HotelsQueryParams) => {
  const response = await api.get<PaginatedResponse<Hotel>>(
    API_ENDPOINTS.HOTEL.HOTELS,
    { params }
  );
  return response.data;
};

export const getHotelById = async (id: string) => {
  const response = await api.get<Hotel>(
    `${API_ENDPOINTS.HOTEL.HOTELS}/${id}`
  );
  return response.data;
};