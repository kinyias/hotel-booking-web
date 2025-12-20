import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ListRoomDto } from './dto/list-room.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertHotelAccess(hotelId: string, userId: string) {
    const hotel = await this.prisma.hotel.findFirst({
      where: {
        id: hotelId,
        deletedAt: null,
        OR: [{ ownerId: userId }, { members: { some: { userId } } }],
      },
      select: { id: true },
    });
    if (!hotel)
      throw new ForbiddenException('You have no access to this hotel');
  }

  async create(hotelId: string, userId: string, dto: CreateRoomDto) {
    await this.assertHotelAccess(hotelId, userId);

    const rt = await this.prisma.roomType.findFirst({
      where: { id: dto.roomTypeId, hotelId },
      select: { id: true },
    });
    if (!rt) throw new BadRequestException('RoomType not found in this hotel');

    try {
      const dup = await this.prisma.room.findFirst({
        where: { hotelId, code: dto.code, deletedAt: null },
        select: { id: true },
      });
      if (dup)
        throw new BadRequestException('Room code already exists in this hotel');

      return await this.prisma.room.create({
        data: {
          hotelId,
          roomTypeId: dto.roomTypeId,
          code: dto.code,
          floor: dto.floor,
          note: dto.note,
        },
      });
    } catch (e: any) {
      throw new BadRequestException('Room code already exists in this hotel');
    }
  }

  async list(hotelId: string, userId: string, q: ListRoomDto) {
    await this.assertHotelAccess(hotelId, userId);

    const limit = q.limit ?? 20;
    const page = q.page ?? 1;
    const offset = (page - 1) * limit;

    const where: Prisma.RoomWhereInput = {
      hotelId,
      deletedAt: null,
      ...(q.roomTypeId ? { roomTypeId: q.roomTypeId } : {}),
      ...(q.q
        ? {
            OR: [
              { code: { contains: q.q, mode: 'insensitive' } },
              { note: { contains: q.q, mode: 'insensitive' } },
              { floor: { contains: q.q, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.room.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: {
          roomType: true,
        },
      }),
      this.prisma.room.count({ where }),
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

  async get(hotelId: string, userId: string, id: string) {
    await this.assertHotelAccess(hotelId, userId);

    const room = await this.prisma.room.findFirst({
      where: { id, hotelId, deletedAt: null },
      include: { roomType: true },
    });
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  async update(
    hotelId: string,
    userId: string,
    id: string,
    dto: UpdateRoomDto,
  ) {
    await this.assertHotelAccess(hotelId, userId);

    const exists = await this.prisma.room.findFirst({
      where: { id, hotelId, deletedAt: null },
      select: { id: true, code: true },
    });
    if (!exists) throw new NotFoundException('Room not found');

    try {
      if (dto.code && dto.code !== exists.code) {
        const dup = await this.prisma.room.findFirst({
          where: { hotelId, code: dto.code, deletedAt: null, NOT: { id } },
          select: { id: true },
        });
        if (dup)
          throw new BadRequestException(
            'Room code already exists in this hotel',
          );
      }
      return await this.prisma.room.update({
        where: { id },
        data: dto,
        include: { roomType: true },
      });
    } catch (e: any) {
      throw new BadRequestException('Room code already exists in this hotel');
    }
  }

  async remove(hotelId: string, userId: string, id: string) {
    await this.assertHotelAccess(hotelId, userId);

    const room = await this.prisma.room.findFirst({
      where: { id, hotelId, deletedAt: null },
      select: { id: true },
    });
    if (!room) throw new NotFoundException('Room not found');

    await this.prisma.room.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: 'INACTIVE', // optional: để UI dễ hiểu
      },
    });

    return { ok: true };
  }
}
