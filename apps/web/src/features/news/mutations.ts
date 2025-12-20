import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNews, deleteNews, updateNews } from './api';
import { newsKeys } from './queries';
import { CreateNewsRequest, UpdateNewsRequest } from './types';

export const useCreateNewsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateNewsRequest) => createNews(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsKeys.all });
    },
  });
};

export const useUpdateNewsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNewsRequest }) =>
      updateNews(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: newsKeys.all });
      queryClient.invalidateQueries({ queryKey: newsKeys.detail(data.id) });
    },
  });
};

export const useDeleteNewsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteNews(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsKeys.all });
    },
  });
};
