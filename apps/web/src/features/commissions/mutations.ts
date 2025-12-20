import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createCommissionPackage,
  updateCommissionPackage,
  deactivateCommissionPackage,
  setHotelCommissionPackage,
} from './api';
import { COMMISSION_PACKAGES_QUERY_KEY } from './queries';
import {
  CreateCommissionPackageInput,
  UpdateCommissionPackageInput,
} from './types';

export const useCreateCommissionPackageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommissionPackageInput) =>
      createCommissionPackage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [COMMISSION_PACKAGES_QUERY_KEY],
      });
    },
  });
};

export const useUpdateCommissionPackageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCommissionPackageInput;
    }) => updateCommissionPackage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [COMMISSION_PACKAGES_QUERY_KEY],
      });
    },
  });
};

export const useDeactivateCommissionPackageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deactivateCommissionPackage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [COMMISSION_PACKAGES_QUERY_KEY],
      });
    },
  });
};

export const useSetHotelCommissionPackageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      hotelId,
      commissionPackageId,
    }: {
      hotelId: string;
      commissionPackageId: string;
    }) => setHotelCommissionPackage(hotelId, commissionPackageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['hotels'],
      });
      queryClient.invalidateQueries({
        queryKey: ['hotel'],
      });
    },
  });
};
