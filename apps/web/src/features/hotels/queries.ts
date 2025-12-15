import { useQuery } from '@tanstack/react-query';
import { getHotels } from './api';
import { HotelsQueryParams } from './types';

export const useHotelsQuery = (params?: HotelsQueryParams) => {
  return useQuery({
    queryKey: ['hotels', params],
    queryFn: () => getHotels(params),
  });
};

