import { Injectable } from '@nestjs/common';
import { CreateCommissionPackageDto } from './dto/create-commission-package.dto';
import { UpdateCommissionPackageDto } from './dto/update-commission-package.dto';
import { CommissionRevenueQueryDto } from './dto/commission-revenue-query.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommissionPackageService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.commissionPackage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.commissionPackage.findUnique({
      where: { id },
    });
  }

  async create(dto: CreateCommissionPackageDto) {
    return this.prisma.commissionPackage.create({ data: dto });
  }

  async update(id: string, dto: UpdateCommissionPackageDto) {
    return this.prisma.commissionPackage.update({
      where: { id },
      data: dto,
    });
  }

  async deactivate(id: string) {
    return this.prisma.commissionPackage.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async setCommissionPackage(hotelId: string, commissionPackageId: string) {
    return this.prisma.hotel.update({
      where: { id: hotelId },
      data: { commissionPackageId: commissionPackageId },
    });
  }

  async getCommissionRevenue(query: CommissionRevenueQueryDto) {
    const { from, to, year } = query;

    // If year is provided, return monthly aggregation for that year
    if (year) {
      const yearNum = parseInt(year);
      const startDate = new Date(yearNum, 0, 1); // January 1st
      const endDate = new Date(yearNum, 11, 31, 23, 59, 59); // December 31st

      const bookings = await this.prisma.booking.findMany({
        where: {
          status: 'COMPLETED',
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
          commissionAmount: {
            not: null,
          },
        },
        select: {
          createdAt: true,
          commissionAmount: true,
        },
      });

      // Aggregate by month (0-11)
      const monthlyTotals = new Array(12).fill(0);
      bookings.forEach((booking) => {
        const month = booking.createdAt.getMonth();
        monthlyTotals[month] += booking.commissionAmount || 0;
      });

      return monthlyTotals;
    }

    // If from/to are provided, return individual booking data for custom range
    if (from && to) {
      const startDate = new Date(from);
      const endDate = new Date(to);
      endDate.setHours(23, 59, 59, 999);

      const bookings = await this.prisma.booking.findMany({
        where: {
          status: 'COMPLETED',
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
          commissionAmount: {
            not: null,
          },
        },
        select: {
          createdAt: true,
          commissionAmount: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      return bookings.map((booking) => ({
        date: booking.createdAt.toISOString(),
        revenue: booking.commissionAmount || 0,
      }));
    }

    // Default: return current year monthly data
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, 11, 31, 23, 59, 59);

    const bookings = await this.prisma.booking.findMany({
      where: {
        status: 'COMPLETED',
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        commissionAmount: {
          not: null,
        },
      },
      select: {
        createdAt: true,
        commissionAmount: true,
      },
    });

    const monthlyTotals = new Array(12).fill(0);
    bookings.forEach((booking) => {
      const month = booking.createdAt.getMonth();
      monthlyTotals[month] += booking.commissionAmount || 0;
    });

    return monthlyTotals;
  }
}
