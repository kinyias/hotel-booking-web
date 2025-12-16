import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HotelMemberRole, Prisma } from '@prisma/client';
import { AddMemberDto } from 'src/modules/hotel/dto/add-member.dto';
import { CreateHotelDto } from 'src/modules/hotel/dto/create-hotel.dto';
import { ListHotelsQueryDto } from 'src/modules/hotel/dto/list-hotels.query';
import { PrismaService } from 'src/modules/prisma/prisma.service';
@Injectable()
export class HotelService {
  constructor(private prisma: PrismaService) {}

  async createHotel(userId: string, dto: CreateHotelDto) {
    return this.prisma.hotel.create({
      data: {
        ...dto,
        ownerId: userId,
        members: {
          create: {
            userId,
          },
        },
      },
      include: {
        owner: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        members: true,
      },
    });
  }

  async getMyHotels(userId: string) {
    return this.prisma.hotel.findMany({
      where: {
        deletedAt: null, // 👈 thêm
        OR: [{ ownerId: userId }, { members: { some: { userId } } }],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateHotel(hotelId: string, dto: any) {
    const hotel = await this.prisma.hotel.findFirst({
      where: {
        id: hotelId,
        deletedAt: null,
      },
    });

    if (!hotel) {
      throw new NotFoundException('Hotel not found or has been deleted');
    }

    return this.prisma.hotel.update({
      where: { id: hotelId },
      data: dto,
    });
  }

  async addMember(hotelId: string, dto: AddMemberDto) {
    const hotel = await this.prisma.hotel.findFirst({
      where: {
        id: hotelId,
        deletedAt: null,
      },
    });

    if (!hotel) {
      throw new NotFoundException('Hotel not found or has been deleted');
    }

    return this.prisma.hotelMember.upsert({
      where: {
        hotelId_userId: {
          hotelId,
          userId: dto.userId,
        },
      },
      create: {
        hotelId,
        userId: dto.userId,
      },
      update: {},
    });
  }

  async removeMember(hotelId: string, userId: string) {
    return this.prisma.hotelMember.delete({
      where: { hotelId_userId: { hotelId, userId } },
    });
  }

  async getHotelDetail(hotelId: string) {
    const hotel = await this.prisma.hotel.findFirst({
      where: { id: hotelId, deletedAt: null },
      include: {
        owner: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!hotel) throw new NotFoundException('Hotel not found');
    return hotel;
  }

  async listMembers(hotelId: string) {
    const hotel = await this.prisma.hotel.findFirst({
      where: { id: hotelId, deletedAt: null },
      select: { id: true },
    });
    if (!hotel) throw new NotFoundException('Hotel not found');

    return this.prisma.hotelMember.findMany({
      where: { hotelId },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    });
  }

  
  async softDeleteHotel(hotelId: string, actorUserId: string) {
    const hotel = await this.prisma.hotel.findFirst({
      where: { id: hotelId, deletedAt: null },
      select: { ownerId: true },
    });
    if (!hotel) throw new NotFoundException('Hotel not found');

    // rule: chỉ owner được xoá (guard cũng có thể chặn, nhưng service nên tự bảo vệ)
    if (hotel.ownerId !== actorUserId) {
      throw new ForbiddenException('Only owner can delete hotel');
    }

    return this.prisma.hotel.update({
      where: { id: hotelId },
      data: { deletedAt: new Date() },
    });
  }

  async listHotelsAdmin(query: ListHotelsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const offset = (page - 1) * limit;

    const andWhere: Prisma.HotelWhereInput[] = [];

    // soft delete
    if (!query.includeDeleted) {
      andWhere.push({ deletedAt: null });
    }

    if (query.ownerId) {
      andWhere.push({ ownerId: query.ownerId });
    }

    if (query.city) {
      andWhere.push({
        city: { contains: query.city, mode: 'insensitive' },
      });
    }

    if (query.name) {
      andWhere.push({
        name: { contains: query.name, mode: 'insensitive' },
      });
    }

    if (query.q) {
      const q = query.q.trim();
      if (q) {
        andWhere.push({
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { address: { contains: q, mode: 'insensitive' } },
            { city: { contains: q, mode: 'insensitive' } },
            { country: { contains: q, mode: 'insensitive' } },
          ],
        });
      }
    }

    const where: Prisma.HotelWhereInput =
      andWhere.length > 0 ? { AND: andWhere } : {};

    const [total, items] = await this.prisma.$transaction([
      this.prisma.hotel.count({ where }),
      this.prisma.hotel.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          owner: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
          _count: { select: { members: true } },
        },
      }),
    ]);

    return {
      data: items,
      meta: {
        limit,
        offset,
        total,
      },
    };
  }
}
