import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { ListPromotionsQueryDto } from './dto/list-promotions.query';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@Injectable()
export class PromotionService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePromotionDto) {
    // // If hotelId is provided, check if user is owner/member or admin
    // if (dto.hotelId) {
    //   const hasPermission = await this.checkHotelPermission(userId, dto.hotelId);
    //   if (!hasPermission) {
    //     throw new ForbiddenException(
    //       'You do not have permission to create promotion for this hotel',
    //     );
    //   }
    // } else {
    //   const isAdmin = await this.checkIsAdmin(userId);
    //   if (!isAdmin) {
    //     throw new ForbiddenException(
    //       'Only admin can create global promotions',
    //     );
    //   }
    // }

    // Check code uniqueness
    const exist = await this.prisma.promotion.findUnique({
      where: { code: dto.code },
    });
    if (exist) {
      throw new BadRequestException('Promotion code already exists');
    }

    return this.prisma.promotion.create({
      data: {
        code: dto.code,
        name: dto.name,
        description: dto.description,
        discountType: dto.discountType,
        discountValue: dto.discountValue,
        maxDiscountAmount: dto.maxDiscountAmount,
        minBookingAmount: dto.minBookingAmount,
        totalUsageLimit: dto.totalUsageLimit,
        perUserLimit: dto.perUserLimit,
        startAt: new Date(dto.startAt),
        endAt: new Date(dto.endAt),
        isActive: dto.isActive ?? true,
      },
    });
  }

  async listAdmin(query: ListPromotionsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const offset = (page - 1) * limit;

    const where: Prisma.PromotionWhereInput = {};

    if (query.search) {
      where.OR = [
        { code: { contains: query.search, mode: 'insensitive' } },
        { name: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (typeof query.isActive === 'boolean') {
      where.isActive = query.isActive;
    }

    const [total, items] = await this.prisma.$transaction([
      this.prisma.promotion.count({ where }),
      this.prisma.promotion.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          hotel: {
            select: { id: true, name: true },
          },
        },
      }),
    ]);

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
      },
    };
  }

  async listPublic(query: ListPromotionsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const offset = (page - 1) * limit;

    const now = new Date();
    const where: Prisma.PromotionWhereInput = {
      isActive: true,
      startAt: { lte: now },
      endAt: { gte: now },
    };

    if (query.hotelId) {
      where.hotelId = query.hotelId;
    }
    
    // public only sees promotions for valid hotels (active, not deleted)
    where.hotel = {
      deletedAt: null,
      status: 'ACTIVE',
    };

    const [total, items] = await this.prisma.$transaction([
      this.prisma.promotion.count({ where }),
      this.prisma.promotion.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
           hotel: {
            select: { id: true, name: true}
           }
        }
      }),
    ]);

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
      },
    };
  }

  async findOne(id: string) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
      include: {
        hotel: true,
      },
    });
    if (!promotion) throw new NotFoundException('Promotion not found');
    return promotion;
  }

  async update(id: string, userId: string, dto: UpdatePromotionDto) {
    const promotion = await this.findOne(id);

    // Permission check
    if (promotion.hotelId) {
      const hasPermission = await this.checkHotelPermission(userId, promotion.hotelId);
      if (!hasPermission) {
        throw new ForbiddenException('No permission to update this promotion');
      }
    } else {
       // if global promotion, only admin
       const isAdmin = await this.checkIsAdmin(userId);
       if (!isAdmin) throw new ForbiddenException('Only admin can update global promotion');
    }

    return this.prisma.promotion.update({
      where: { id },
      data: {
        ...dto,
        startAt: dto.startAt ? new Date(dto.startAt) : undefined,
        endAt: dto.endAt ? new Date(dto.endAt) : undefined,
      },
    });
  }

  async remove(id: string, userId: string) {
    const promotion = await this.findOne(id);

     // Permission check
    if (promotion.hotelId) {
      const hasPermission = await this.checkHotelPermission(userId, promotion.hotelId);
      if (!hasPermission) {
        throw new ForbiddenException('No permission to delete this promotion');
      }
    } else {
       const isAdmin = await this.checkIsAdmin(userId);
       if (!isAdmin) throw new ForbiddenException('Only admin can delete global promotion');
    }

    return this.prisma.promotion.delete({
      where: { id },
    });
  }

  // --- Helper ---
  private async checkIsAdmin(userId: string): Promise<boolean> {
     const userRoles = await this.prisma.userRole.findMany({
      where: { userId },
      include: { role: true },
    });
    return userRoles.some((ur) => ur.role.name.toUpperCase() === 'ADMIN');
  }

  private async checkHotelPermission(userId: string, hotelId: string): Promise<boolean> {
    if (await this.checkIsAdmin(userId)) return true;

    const hotel = await this.prisma.hotel.findUnique({
      where: { id: hotelId },
      select: { ownerId: true },
    });
    if (hotel?.ownerId === userId) return true;

    const member = await this.prisma.hotelMember.findUnique({
       where: { hotelId_userId: { hotelId, userId } },
    });
    return !!member;
  }
}
