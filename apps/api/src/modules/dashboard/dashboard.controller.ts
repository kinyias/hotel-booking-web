import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  getStats(@Query('hotelId') hotelId?: string) {
    return this.dashboardService.getStats(hotelId);
  }

  @Get('revenue-chart')
  getRevenueChart(
    @Query('hotelId') hotelId?: string,
    @Query('groupBy') groupBy?: 'day' | 'week' | 'month',
    @Query('year') year?: number,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.dashboardService.getRevenueChart(hotelId, groupBy, year, from, to);
  }

  @Get('latest-reviews')
  getLatestReviews(
    @Query('hotelId') hotelId?: string,
    @Query('limit') limit?: number,
  ) {
    return this.dashboardService.getLatestReviews(hotelId, limit);
  }

  @Get('newest-bookings')
  getNewestBookings(
    @Query('hotelId') hotelId?: string,
    @Query('limit') limit?: number,
  ) {
    return this.dashboardService.getNewestBookings(hotelId, limit);
  }
}
