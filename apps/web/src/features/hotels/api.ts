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
  const response = await api.get<Hotel>(`${API_ENDPOINTS.HOTEL.HOTELS}/${id}`);
  return response.data;
};

export const createHotel = async (payload: any) => {
  const response = await api.post<Hotel>(API_ENDPOINTS.HOTEL.HOTELS, payload);
  return response.data;
};

export const updateHotel = async (id: string, payload: any) => {
  const response = await api.patch<Hotel>(
    `${API_ENDPOINTS.HOTEL.HOTELS}/${id}`,
    payload
  );
  return response.data;
};

export const deleteHotel = async (id: string) => {
  const response = await api.delete<Hotel>(
    `${API_ENDPOINTS.HOTEL.HOTELS}/${id}`
  );
  return response.data;
};