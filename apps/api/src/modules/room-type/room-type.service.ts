import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';
import { AvailableRoomTypeDto, ListRoomTypeDto } from './dto/list-room-type.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoomTypeService {
  constructor(private prisma: PrismaService) {}

  private async assertHotelAccess(hotelId: string, userId: string) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { id: hotelId },
      select: { id: true, ownerId: true },
    });
    if (!hotel) throw new NotFoundException('Hotel not found');

    if (hotel.ownerId === userId) return;

    const member = await this.prisma.hotelMember.findUnique({
      where: { hotelId_userId: { hotelId, userId } },
      select: { userId: true },
    });
    if (!member)
      throw new ForbiddenException('You are not a member of this hotel');
  }

  private async assertAmenityIdsValid(amenityIds: string[]) {
    if (!amenityIds.length) return;

    const found = await this.prisma.amenity.findMany({
      where: { id: { in: amenityIds }, isActive: true },
      select: { id: true },
    });

    if (found.length !== amenityIds.length) {
      throw new BadRequestException('Some amenities are invalid or inactive');
    }
  }

  private async assertRoomTypeNameUnique(
    hotelId: string,
    name: string,
    excludeId?: string,
  ) {
    const dup = await this.prisma.roomType.findFirst({
      where: {
        hotelId,
        deletedAt: null,
        name: { equals: name, mode: Prisma.QueryMode.insensitive },
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });

    if (dup) {
      throw new BadRequestException(
        'Room type name already exists in this hotel',
      );
    }
  }

  async create(hotelId: string, userId: string, dto: CreateRoomTypeDto) {
    await this.assertHotelAccess(hotelId, userId);

    const amenityIds = dto.amenityIds ?? [];
    await this.assertAmenityIdsValid(amenityIds);

    const name = dto.name.trim();
    await this.assertRoomTypeNameUnique(hotelId, name);

    const roomType = await this.prisma.$transaction(async (tx) => {
      const created = await tx.roomType.create({
        data: {
          hotelId,
          name,
          price_per_night: new Prisma.Decimal(dto.price_per_night),
          max_guests: dto.max_guests,
          description: dto.description?.trim() || null,
          images: {
            create: dto.images?.map((img) => ({ url: img.url })) || [],
          },
        },
        select: { id: true },
      });

      if (amenityIds.length) {
        await tx.roomTypeAmenity.createMany({
          data: amenityIds.map((amenityId) => ({
            typeId: created.id,
            amenityId,
          })),
          skipDuplicates: true,
        });
      }

      return tx.roomType.findUnique({
        where: { id: created.id },
        include: {
          amenities: { include: { amenity: true } },
          images: true,
        },
      });
    });

    return roomType;
  }

  async list(hotelId: string, userId: string, q: ListRoomTypeDto) {
    await this.assertHotelAccess(hotelId, userId);

    const limit = q.limit ?? 20;
    const offset = q.page ? (q.page - 1) * limit : 0;

    const where: Prisma.RoomTypeWhereInput = {
      hotelId,
      deletedAt: null,
      ...(q.q
        ? {
            OR: [
              { name: { contains: q.q, mode: Prisma.QueryMode.insensitive } },
              {
                description: {
                  contains: q.q,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            ],
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.roomType.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          amenities: { include: { amenity: true } },
          images: true,
        },
      }),
      this.prisma.roomType.count({ where }),
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
  async getAvailableRoomTypes(
    hotelId: string,
    // userId: string | undefined, // userId is optional for public access
    q: AvailableRoomTypeDto,
  ) {
    // If we wanted to enforce access for admin/owner, we would check userId here.
    // But for 'available' endpoint intended for booking, we typically allow public access.
    
    const limit = q.limit ?? 20;
    const offset = q.page ? (q.page - 1) * limit : 0;

    const startDate = new Date(q.from);
    const endDate = new Date(q.to);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    if (startDate > endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    const where: Prisma.RoomTypeWhereInput = {
      hotelId,
      deletedAt: null,
      ...(q.q
        ? {
            OR: [
              { name: { contains: q.q, mode: Prisma.QueryMode.insensitive } },
              {
                description: {
                  contains: q.q,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            ],
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.roomType.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { price_per_night: 'asc' }, // usually sorting by price makes sense for availability
        include: {
          amenities: { include: { amenity: true } },
          images: true,
        },
      }),
      this.prisma.roomType.count({ where }),
    ]);

    // Calculate number of days in range for validation
    // difference in milliseconds / ms per day
    const dayCount =
      Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Fetch inventories for the found room types and date range
    const roomTypeIds = items.map((rt) => rt.id);
    const inventories = await this.prisma.inventory.findMany({
      where: {
        hotelId,
        roomTypeId: { in: roomTypeIds },
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const data = items.map((rt) => {
      const rtInvs = inventories.filter((inv) => inv.roomTypeId === rt.id);

      // 1. Check stopSell
      const hasStopSell = rtInvs.some((inv) => inv.stopSell);
      if (hasStopSell) {
        return { ...rt, availableRooms: 0 };
      }

      // 2. Check if we have inventory records for all days
      // If records are missing, it implies 0 availability (or unconfigured)
      if (rtInvs.length < dayCount) {
        return { ...rt, availableRooms: 0 };
      }

      // 3. Find minimum available rooms
      const minAvailable = Math.min(...rtInvs.map((inv) => inv.availableRooms));

      return {
        ...rt,
        availableRooms: minAvailable > 0 ? minAvailable : 0,
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
  async getOne(hotelId: string, userId: string, id: string) {
    await this.assertHotelAccess(hotelId, userId);

    const roomType = await this.prisma.roomType.findFirst({
      where: { id, hotelId, deletedAt: null },
      include: {
        amenities: { include: { amenity: true } },
        images: true,
      },
    });

    if (!roomType) throw new NotFoundException('Room type not found');
    return roomType;
  }

  async update(
    hotelId: string,
    userId: string,
    id: string,
    dto: UpdateRoomTypeDto,
  ) {
    await this.assertHotelAccess(hotelId, userId);

    const existing = await this.prisma.roomType.findFirst({
      where: { id, hotelId, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Room type not found');

    const { images, amenityIds, ...otherData } = dto;
    let imageOps: any = undefined;
    let amenityOps: any = undefined;

    if (otherData.name !== undefined) {
      const name = otherData.name.trim();
      await this.assertRoomTypeNameUnique(hotelId, name, id);
    }
    // HANDLE IMAGES (diff update)
    if (images) {
      const current = await this.prisma.roomType.findUnique({
        where: { id },
        include: { images: true },
      });

      if (current) {
        const currentImageIds = current.images.map((img) => img.id);
        const imagesToUpdate = images.filter(
          (img) => img.id && currentImageIds.includes(img.id),
        );
        const imagesToCreate = images.filter(
          (img) => !img.id || (img.id && !currentImageIds.includes(img.id)),
        );
        const validUpdateIds = new Set(imagesToUpdate.map((img) => img.id));
        const imagesToDeleteIds = currentImageIds.filter(
          (imgId) => !validUpdateIds.has(imgId),
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
    }
    //  HANDLE AMENITIES (diff update)
    if(amenityIds){
      const current = await this.prisma.roomType.findUnique({
      where: { id },
      include: { amenities: { include: { amenity: true } } },
    });
    if (current) {
      const currentAmenityIds = current.amenities.map(
        a => a.amenityId,
      );

      const toCreate = amenityIds.filter(
        aid => !currentAmenityIds.includes(aid),
      );

      const toDelete = currentAmenityIds.filter(
        aid => !amenityIds.includes(aid),
      );

      amenityOps = {
        deleteMany: {
          amenityId: { in: toDelete },
        },
        create: toCreate.map(amenityId => ({
          amenityId,
        })),
      };
    }
    }
    return await this.prisma.roomType.update({
      where: { id },
      data: {
        ...(otherData.name !== undefined
          ? { name: otherData.name.trim() }
          : {}),
        ...(otherData.price_per_night !== undefined
          ? { price_per_night: new Prisma.Decimal(otherData.price_per_night) }
          : {}),
        ...(otherData.max_guests !== undefined
          ? { max_guests: otherData.max_guests }
          : {}),
        ...(otherData.description !== undefined
          ? { description: otherData.description?.trim() || null }
          : {}),
        ...(imageOps ? { images: imageOps } : {}),
        ...(amenityOps ? { amenities: amenityOps } : {}),
      },
      include: {
        amenities: { include: { amenity: true } },
        images: true,
      },
    });
  }

  async remove(hotelId: string, userId: string, id: string) {
    await this.assertHotelAccess(hotelId, userId);

    const existing = await this.prisma.roomType.findFirst({
      where: { id, hotelId, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Room type not found');

    // Soft delete: không xoá DB
    await this.prisma.roomType.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return { deleted: true };
  }

  async listAll(q: ListRoomTypeDto) {
    const limit = q.limit ?? 20;
    const offset = q.page ? (q.page - 1) * limit : 0;

    const where: Prisma.RoomTypeWhereInput = {
      deletedAt: null,
      ...(q.q
        ? {
            OR: [
              { name: { contains: q.q, mode: Prisma.QueryMode.insensitive } },
              {
                description: {
                  contains: q.q,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            ],
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.roomType.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          amenities: { include: { amenity: true } },
          images: true,
          hotel: true,
        },
      }),
      this.prisma.roomType.count({ where }),
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
