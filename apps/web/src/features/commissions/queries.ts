import { useQuery } from '@tanstack/react-query';
import { getCommissionPackages, getCommissionPackageById } from './api';

export const COMMISSION_PACKAGES_QUERY_KEY = 'commission-packages';

export const useCommissionPackagesQuery = () => {
  return useQuery({
    queryKey: [COMMISSION_PACKAGES_QUERY_KEY],
    queryFn: getCommissionPackages,
  });
};

export const useCommissionPackageQuery = (id: string, enabled = true) => {
  return useQuery({
    queryKey: [COMMISSION_PACKAGES_QUERY_KEY, id],
    queryFn: () => getCommissionPackageById(id),
    enabled: enabled && !!id,
  });
};
