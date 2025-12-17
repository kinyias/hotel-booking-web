import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';
import { ListRoomTypeDto } from './dto/list-room-type.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';

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

  async create(hotelId: string, userId: string, dto: CreateRoomTypeDto) {
    await this.assertHotelAccess(hotelId, userId);

    const amenityIds = dto.amenityIds ?? [];
    await this.assertAmenityIdsValid(amenityIds);

    try {
      const roomType = await this.prisma.$transaction(async (tx) => {
        const created = await tx.roomType.create({
          data: {
            hotelId,
            name: dto.name.trim(),
            price_per_night: new Prisma.Decimal(dto.price_per_night),
            max_guests: dto.max_guests,
            description: dto.description?.trim() || null,
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
          include: { amenities: { include: { amenity: true } } },
        });
      });

      return roomType;
    } catch (e: any) {
      // unique [hotelId, name]
      if (e?.code === 'P2002') {
        throw new BadRequestException(
          'Room type name already exists in this hotel',
        );
      }
      throw e;
    }
  }

  async list(hotelId: string, userId: string, q: ListRoomTypeDto) {
    await this.assertHotelAccess(hotelId, userId);

    const limit = q.limit ?? 20;
    const offset = q.page ? (q.page - 1) * limit : 0;

    const where: Prisma.RoomTypeWhereInput = {
      hotelId,
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
          amenities: {
            include: { amenity: true },
          },
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

  async getOne(hotelId: string, userId: string, id: string) {
    await this.assertHotelAccess(hotelId, userId);

    const roomType = await this.prisma.roomType.findFirst({
      where: { id, hotelId },
      include: { amenities: { include: { amenity: true } } },
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
      where: { id, hotelId },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Room type not found');

    return await this.prisma.roomType.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.price_per_night !== undefined
          ? { price_per_night: new Prisma.Decimal(dto.price_per_night) }
          : {}),
        ...(dto.max_guests !== undefined ? { max_guests: dto.max_guests } : {}),
        ...(dto.description !== undefined
          ? { description: dto.description?.trim() || null }
          : {}),
      },
      include: { amenities: { include: { amenity: true } } },
    });
  }

  async remove(hotelId: string, userId: string, id: string) {
    await this.assertHotelAccess(hotelId, userId);

    const existing = await this.prisma.roomType.findFirst({
      where: { id, hotelId },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Room type not found');

    // onDelete: Cascade sẽ tự xoá RoomTypeAmenity
    await this.prisma.roomType.delete({ where: { id } });
    return { deleted: true };
  }
}
