import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBanner, updateBanner, deleteBanner } from './api';
import { CreateBannerInput, UpdateBannerInput } from './types';
import { BANNER_QUERY_KEYS } from './queries';

export const useCreateBannerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateBannerInput) => createBanner(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BANNER_QUERY_KEYS.admin() });
      queryClient.invalidateQueries({ queryKey: BANNER_QUERY_KEYS.public() });
    },
  });
};

export const useUpdateBannerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateBannerInput }) =>
      updateBanner(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BANNER_QUERY_KEYS.admin() });
      queryClient.invalidateQueries({ queryKey: BANNER_QUERY_KEYS.public() });
    },
  });
};

export const useDeleteBannerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BANNER_QUERY_KEYS.admin() });
      queryClient.invalidateQueries({ queryKey: BANNER_QUERY_KEYS.public() });
    },
  });
};
