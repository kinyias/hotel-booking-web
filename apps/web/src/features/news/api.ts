import axios from '@/lib/axios';
import {
  CreateNewsRequest,
  News,
  NewsListParams,
  NewsListResponse,
  UpdateNewsRequest,
} from './types';

export const getNewsList = async (params: NewsListParams): Promise<NewsListResponse> => {
  const { data } = await axios.get('/admin/news', { params });
  return data;
};

export const getNewsDetail = async (id: string): Promise<News> => {
  const { data } = await axios.get(`/admin/news/id/${id}`);
  return data;
};

export const createNews = async (data: CreateNewsRequest): Promise<News> => {
  const { data: res } = await axios.post('/admin/news', data);
  return res;
};

export const updateNews = async (
  id: string,
  data: UpdateNewsRequest
): Promise<News> => {
  const { data: res } = await axios.patch(`/admin/news/${id}`, data);
  return res;
};

export const deleteNews = async (id: string): Promise<News> => {
  const { data } = await axios.delete(`/admin/news/${id}`);
  return data;
};
