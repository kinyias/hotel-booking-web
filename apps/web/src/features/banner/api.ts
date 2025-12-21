import axios from '@/lib/axios';
import { Banner, CreateBannerInput, UpdateBannerInput } from './types';

export const getPublicBanners = async (): Promise<Banner[]> => {
  const { data } = await axios.get('/banners');
  return data;
};

export const getAdminBanners = async (): Promise<Banner[]> => {
  const { data } = await axios.get('/admin/banners');
  return data;
};

export const createBanner = async (input: CreateBannerInput): Promise<Banner> => {
  const { data } = await axios.post('/admin/banners', input);
  return data;
};

export const updateBanner = async (id: string, input: UpdateBannerInput): Promise<Banner> => {
  const { data } = await axios.patch(`/admin/banners/${id}`, input);
  return data;
};

export const deleteBanner = async (id: string): Promise<void> => {
  await axios.delete(`/admin/banners/${id}`);
};
