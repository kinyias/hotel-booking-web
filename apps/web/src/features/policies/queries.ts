import { useQuery } from '@tanstack/react-query';
import { getPoliciesByHotel, getPolicyById, getPublicPoliciesByHotel } from './api';

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

export const usePublicPoliciesQuery = (hotelId: string) => {
  return useQuery({
    queryKey: ['public-policies', hotelId],
    queryFn: () => getPublicPoliciesByHotel(hotelId),
    enabled: !!hotelId,
  });
};
