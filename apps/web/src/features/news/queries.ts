import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  getNewsDetail,
  getNewsList,
  getPublicNewsDetail,
  getPublicNewsList,
} from './api';
import { NewsListParams } from './types';

export const newsKeys = {
  all: ['news'] as const,
  list: (params: NewsListParams) => [...newsKeys.all, 'list', params] as const,
  detail: (id: string) => [...newsKeys.all, 'detail', id] as const,
  publicList: (params: NewsListParams) =>
    [...newsKeys.all, 'public-list', params] as const,
  publicDetail: (slug: string) => [...newsKeys.all, 'public-detail', slug] as const,
};

// Admin Queries
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

// Public Queries
export const usePublicNewsListQuery = (params: NewsListParams) => {
  return useQuery({
    queryKey: newsKeys.publicList(params),
    queryFn: () => getPublicNewsList(params),
    placeholderData: keepPreviousData,
  });
};

export const usePublicNewsDetailQuery = (slug: string) => {
  return useQuery({
    queryKey: newsKeys.publicDetail(slug),
    queryFn: () => getPublicNewsDetail(slug),
    enabled: !!slug,
  });
};
