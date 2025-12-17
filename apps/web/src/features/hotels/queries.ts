import { useQuery } from '@tanstack/react-query';
import { getHotelById, getHotels } from './api';
import { HotelsQueryParams } from './types';

export const useHotelsQuery = (params?: HotelsQueryParams) => {
  return useQuery({
    queryKey: ['hotels', params],
    queryFn: () => getHotels(params),
  });
};

export const useHotelDetailQuery = (hotelId: string) => {
  return useQuery({
    queryKey: ['hotel', hotelId],
    queryFn: () => getHotelById(hotelId),
  });
};
