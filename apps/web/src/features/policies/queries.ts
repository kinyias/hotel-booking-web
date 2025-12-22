import { useQuery } from '@tanstack/react-query';
import { getPoliciesByHotel, getPolicyById } from './api';

export const usePoliciesQuery = (hotelId: string) => {
  return useQuery({
    queryKey: ['policies', hotelId],
    queryFn: () => getPoliciesByHotel(hotelId),
    enabled: !!hotelId,
  });
};

export const usePolicyQuery = (hotelId: string, policyId: string) => {
  return useQuery({
    queryKey: ['policy', hotelId, policyId],
    queryFn: () => getPolicyById(hotelId, policyId),
    enabled: !!hotelId && !!policyId && policyId !== 'new',
  });
};
