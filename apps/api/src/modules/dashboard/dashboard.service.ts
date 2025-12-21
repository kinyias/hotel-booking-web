import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentStatus, BookingStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(hotelId?: string) {
    const whereHotel = hotelId ? { hotelId } : {};
    
    let totalUsers = 0;
    if (hotelId) {
      const distinctUsers = await this.prisma.booking.findMany({
        where: { hotelId, userId: { not: null } },
        select: { userId: true },
        distinct: ['userId'],
      });
      totalUsers = distinctUsers.length;
    } else {
      totalUsers = await this.prisma.user.count();
    }

    const totalBookings = await this.prisma.booking.count({
      where: whereHotel,
    });

    const revenueAgg = await this.prisma.booking.aggregate({
      where: {
        status: BookingStatus.COMPLETED,
        ...(hotelId ? { hotelId } : {}),
      },
      _sum: {
        totalAmount: true,
      },
    });
    
    const revenue = Number(revenueAgg._sum.totalAmount || 0);

    let activeHotels = 0;
    if (hotelId) {
       const hotel = await this.prisma.hotel.findUnique({
         where: { id: hotelId },
         select: { status: true }
       });
       activeHotels = hotel?.status === 'ACTIVE' ? 1 : 0;
    } else {
      activeHotels = await this.prisma.hotel.count({
        where: { status: 'ACTIVE' },
      });
    }

    return {
      totalUsers,
      totalBookings,
      revenue,
      activeHotels,
    };
  }

  async getRevenueChart(
    hotelId?: string,
    groupBy: 'day' | 'week' | 'month' = 'month',
    year: number = new Date().getFullYear(),
    from?: string,
    to?: string,
  ) {
    let startDate: Date;
    let endDate: Date;

    if (from && to) {
        startDate = new Date(from);
        endDate = new Date(to);
    } else {
        startDate = new Date(year, 0, 1);
        endDate = new Date(year, 11, 31, 23, 59, 59);
    }

    const bookings = await this.prisma.booking.findMany({
      where: {
        ...(hotelId ? { hotelId } : {}),
        status: BookingStatus.COMPLETED,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        totalAmount: true,
        createdAt: true,
      },
    });

    // Grouping Logic
    const result = new Map<string, number>();

    // Initialize for month if year view
    if (groupBy === 'month' && !from) {
      for (let i = 0; i < 12; i++) {
        result.set(`${i}`, 0); // 0-11
      }
    }

    bookings.forEach((b) => {
      const date = new Date(b.createdAt);
      let key = '';

      if (groupBy === 'month') {
        key = date.getMonth().toString();
      } else {
         key = date.toISOString().split('T')[0];
      }
      
      const current = result.get(key) || 0;
      result.set(key, current + Number(b.totalAmount));
    });

    if (groupBy === 'month' && !from) {
       return Array.from(result.entries()).sort((a,b) => parseInt(a[0]) - parseInt(b[0])).map(([, value]) => value);
    }
    
    return Array.from(result.entries()).map(([date, revenue]) => ({ date, revenue }));
  }

  async getLatestReviews(hotelId?: string, limit = 5) {
    return this.prisma.review.findMany({
      where: hotelId ? { hotelId } : undefined,
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          }
        }
      }
    });
  }

  async getNewestBookings(hotelId?: string, limit = 5) {
    return this.prisma.booking.findMany({
      where: hotelId ? { hotelId } : undefined,
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
      include: {
         items: {
          include: {
            roomType: true
          }
         }
      }
    });
  }
}
