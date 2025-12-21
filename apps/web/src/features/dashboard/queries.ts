import { useQuery } from '@tanstack/react-query';
import { getDashboardStats, getLatestReviews, getNewestBookings, getRevenueChart } from './api';
import { RevenueChartParams } from './types';

export const useDashboardStatsQuery = (hotelId?: string) => {
  return useQuery({
    queryKey: ['dashboard-stats', hotelId],
    queryFn: () => getDashboardStats(hotelId),
  });
};

export const useRevenueChartQuery = (params: RevenueChartParams) => {
  return useQuery({
    queryKey: ['dashboard-revenue-chart', params],
    queryFn: () => getRevenueChart(params),
  });
};

export const useLatestReviewsQuery = (hotelId?: string) => {
  return useQuery({
    queryKey: ['dashboard-latest-reviews', hotelId],
    queryFn: () => getLatestReviews(hotelId),
  });
};

export const useNewestBookingsQuery = (hotelId?: string) => {
  return useQuery({
    queryKey: ['dashboard-newest-bookings', hotelId],
    queryFn: () => getNewestBookings(hotelId),
  });
};
