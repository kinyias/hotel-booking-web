import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Action } from '../auth/decorator/action.decorator';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @Action('dashboard.read')
  getStats(@Query('hotelId') hotelId?: string) {
    return this.dashboardService.getStats(hotelId);
  }

  @Get('revenue-chart')
  @Action('dashboard.read')
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
  @Action('dashboard.read')
  getLatestReviews(
    @Query('hotelId') hotelId?: string,
    @Query('limit') limit?: number,
  ) {
    return this.dashboardService.getLatestReviews(hotelId, limit);
  }

  @Get('newest-bookings')
  @Action('dashboard.read')
  getNewestBookings(
    @Query('hotelId') hotelId?: string,
    @Query('limit') limit?: number,
  ) {
    return this.dashboardService.getNewestBookings(hotelId, limit);
  }
}
