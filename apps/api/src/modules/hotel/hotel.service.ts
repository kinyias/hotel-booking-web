import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HotelMemberRole, Prisma } from '@prisma/client';
import { AddMemberDto } from './dto/add-member.dto';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { ListHotelsQueryDto } from './dto/list-hotels.query';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class HotelService {
  constructor(private prisma: PrismaService) {}

  async createHotel(userId: string, dto: CreateHotelDto) {
    const { images, ...hotelData } = dto;
    return this.prisma.hotel.create({
      data: {
        ...hotelData,
        ownerId: userId,
        members: {
          create: {
            userId,
          },
        },
        images:
          images && images.length > 0
            ? {
                create: images.map((i) => ({ url: i.url }) as any),
              }
            : undefined,
      },
      include: {
        owner: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        members: true,
        images: true,
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

  async updateHotel(hotelId: string, dto: UpdateHotelDto) {
    const { images, ...otherData } = dto;

    const hotel = await this.prisma.hotel.findFirst({
      where: {
        id: hotelId,
        deletedAt: null,
      },
      include: { images: true },
    });

    if (!hotel) {
      throw new NotFoundException('Hotel not found or has been deleted');
    }

    let imageOps: any = undefined;

    if (images) {
      const currentImageIds = hotel.images.map((img) => img.id);

      // Separate incoming images
      const imagesToUpdate = images.filter(
        (img) => img.id && currentImageIds.includes(img.id),
      );
      const imagesToCreate = images.filter(
        (img) => !img.id || (img.id && !currentImageIds.includes(img.id)),
      );

      // Identify images to delete (present in DB but not in valid updates)
      const validUpdateIds = new Set(imagesToUpdate.map((img) => img.id));
      const imagesToDeleteIds = currentImageIds.filter(
        (id) => !validUpdateIds.has(id),
      );

      imageOps = {
        deleteMany: { id: { in: imagesToDeleteIds } },
        update: imagesToUpdate.map((img) => ({
          where: { id: img.id },
          data: { url: img.url },
        })),
        create: imagesToCreate.map((img) => ({ url: img.url })),
      };
    }

    return this.prisma.hotel.update({
      where: { id: hotelId },
      data: {
        ...otherData,
        ...(imageOps ? { images: imageOps } : {}),
      },
      include: {
        images: true,
      },
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

    // Validate that all users exist
    const users = await this.prisma.user.findMany({
      where: {
        id: { in: dto.userIds },
      },
      select: { id: true },
    });

    if (users.length !== dto.userIds.length) {
      throw new BadRequestException('One or more users not found');
    }

    // Create or update members in a transaction
    const members = await this.prisma.$transaction(
      dto.userIds.map((userId) =>
        this.prisma.hotelMember.upsert({
          where: {
            hotelId_userId: {
              hotelId,
              userId,
            },
          },
          create: {
            hotelId,
            userId,
          },
          update: {},
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
        }),
      ),
    );

    return members;
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
        images: true,
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
          images: true,
          owner: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
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

  async listPublicHotels(query: ListHotelsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const offset = (page - 1) * limit;

    const andWhere: Prisma.HotelWhereInput[] = [];

    // only active hotels
    andWhere.push({ deletedAt: null });

    // only hotels WITH room types
    andWhere.push({
      roomTypes: {
        some: {
          deletedAt: null,
        },
      },
    });
    
    andWhere.push({ status: 'ACTIVE' });
    // 🔑 PRICE RANGE FILTER
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      if (query.minPrice !== undefined && query.maxPrice !== undefined) {
        // Both min and max specified
        andWhere.push({
          roomTypes: {
            some: {
              deletedAt: null,
              price_per_night: {
                gte: query.minPrice,
                lte: query.maxPrice,
              },
            },
          },
        });
      } else if (query.minPrice !== undefined) {
        // Only min specified
        andWhere.push({
          roomTypes: {
            some: {
              deletedAt: null,
              price_per_night: {
                gte: query.minPrice,
              },
            },
          },
        });
      } else if (query.maxPrice !== undefined) {
        // Only max specified
        andWhere.push({
          roomTypes: {
            some: {
              deletedAt: null,
              price_per_night: {
                lte: query.maxPrice,
              },
            },
          },
        });
      }
    }

    // 🔑 DATE RANGE / INVENTORY AVAILABILITY FILTER
    if (query.checkIn && query.checkOut) {
      // Generate array of dates between checkIn and checkOut (exclusive of checkOut)
      const dates: Date[] = [];
      const currentDate = new Date(query.checkIn);
      const endDate = new Date(query.checkOut);
      
      while (currentDate < endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Hotels must have at least one room type with available inventory
      // for the date range (checking that inventory exists and has availability)
      andWhere.push({
        inventories: {
          some: {
            date: {
              in: dates,
            },
            availableRooms: {
              gt: 0,
            },
            stopSell: false,
            deletedAt: null,
          },
        },
      });
    }

    if (query.city) {
      andWhere.push({
        city: { contains: query.city, mode: 'insensitive' },
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

    const where: Prisma.HotelWhereInput = { AND: andWhere };

    const [total, items] = await this.prisma.$transaction([
      this.prisma.hotel.count({ where }),

      this.prisma.hotel.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },

        include: {
          images: true,

          roomTypes: {
            where: { deletedAt: null },
            select: {
              price_per_night: true,
            },
          },
        },
      }),
    ]);

    // 🔑 TÍNH MIN PRICE
    const data = items.map((hotel) => {
      const prices = hotel.roomTypes.map((rt) => Number(rt.price_per_night));

      const minPrice = prices.length > 0 ? Math.min(...prices) : null;

      return {
        ...hotel,
        minPrice,
        roomTypes: undefined, // không cần trả
      };
    });

    return {
      data,
      meta: {
        limit,
        offset,
        total,
      },
    };
  }
}
