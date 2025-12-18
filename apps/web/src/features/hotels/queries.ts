import { useQuery } from '@tanstack/react-query';
import { getHotelById, getHotels, getPublicHotels } from './api';
import { HotelsQueryParams } from './types';

export const useHotelsQuery = (params?: HotelsQueryParams) => {
  return useQuery({
    queryKey: ['hotels', params],
    queryFn: () => getHotels(params),
  });
};

export const useHotelDetailQuery = (hotelId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['hotel', hotelId],
    queryFn: () => getHotelById(hotelId),
    enabled,
  });
};

export const usePublicHotelsQuery = (params?: HotelsQueryParams) => {
  return useQuery({
    queryKey: ['public-hotels', params],
    queryFn: () => getPublicHotels(params),
  });
};
