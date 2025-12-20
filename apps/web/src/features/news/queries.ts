import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getNewsDetail, getNewsList } from './api';
import { NewsListParams } from './types';

export const newsKeys = {
  all: ['news'] as const,
  list: (params: NewsListParams) => [...newsKeys.all, 'list', params] as const,
  detail: (id: string) => [...newsKeys.all, 'detail', id] as const,
};

export const useNewsListQuery = (params: NewsListParams) => {
  return useQuery({
    queryKey: newsKeys.list(params),
    queryFn: () => getNewsList(params),
    placeholderData: keepPreviousData,
  });
};

export const useNewsDetailQuery = (id: string) => {
  return useQuery({
    queryKey: newsKeys.detail(id),
    queryFn: () => getNewsDetail(id),
    enabled: !!id,
  });
};
