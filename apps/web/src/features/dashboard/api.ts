import { API_ENDPOINTS } from '@/constants';
import api from '@/lib/axios';
import { DashboardStats, LatestReview, NewestBooking, RevenueChartParams } from './types';

export const getDashboardStats = async (hotelId?: string) => {
  const params = hotelId ? { hotelId } : {};
  const response = await api.get<DashboardStats>(API_ENDPOINTS.DASHBOARD.DASHBOARD + '/stats', { params });
  return response.data;
};

export const getRevenueChart = async (params: RevenueChartParams) => {
  const response = await api.get<number[] | { date: string; revenue: number }[]>(
    API_ENDPOINTS.DASHBOARD.DASHBOARD + '/revenue-chart',
    { params }
  );
  return response.data;
};

export const getLatestReviews = async (hotelId?: string, limit = 5) => {
  const params = { hotelId, limit };
  const response = await api.get<LatestReview[]>(API_ENDPOINTS.DASHBOARD.DASHBOARD + '/latest-reviews', { params });
  return response.data;
};

export const getNewestBookings = async (hotelId?: string, limit = 5) => {
  const params = { hotelId, limit };
  const response = await api.get<NewestBooking[]>(API_ENDPOINTS.DASHBOARD.DASHBOARD + '/newest-bookings', { params });
  return response.data;
};
