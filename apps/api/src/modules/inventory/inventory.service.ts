import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Inventory } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ListInventoryDto } from './dto/list-inventory.dto';
import { BulkSetInventoryDto } from './dto/bulk-set-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

function toDateOnly(d: string) {
  // YYYY-MM-DD -> Date (UTC midnight)
  return new Date(`${d}T00:00:00.000Z`);
}

function eachDay(from: Date, to: Date) {
  const days: Date[] = [];
  const cur = new Date(from);
  while (cur <= to) {
    days.push(new Date(cur));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return days;
}

@Injectable()
export class InventoryService {
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
    if (!member) throw new BadRequestException('No access to this hotel');
  }

  async list(hotelId: string, userId: string, q: ListInventoryDto) {
    await this.assertHotelAccess(hotelId, userId);

    const from = toDateOnly(q.from);
    const to = toDateOnly(q.to);
    if (from > to) throw new BadRequestException('from must be <= to');

    const where: Prisma.InventoryWhereInput = {
      hotelId,
      deletedAt: null,
      date: { gte: from, lte: to },
      ...(q.roomTypeId ? { roomTypeId: q.roomTypeId } : {}),
      ...(q.includeStopped ? {} : { stopSell: false }),
    };

    const items = await this.prisma.inventory.findMany({
      where,
      orderBy: [{ roomTypeId: 'asc' }, { date: 'asc' }],
      include: { roomType: { select: { id: true, name: true } } },
    });

    return { from: q.from, to: q.to, items };
  }

  async bulkSet(hotelId: string, userId: string, dto: BulkSetInventoryDto) {
    await this.assertHotelAccess(hotelId, userId);

    const from = toDateOnly(dto.from);
    const to = toDateOnly(dto.to);
    if (from > to) throw new BadRequestException('from must be <= to');

    // đảm bảo roomType thuộc hotel
    const rt = await this.prisma.roomType.findFirst({
      where: { id: dto.roomTypeId, hotelId },
      select: { id: true },
    });
    if (!rt) throw new NotFoundException('RoomType not found in this hotel');

    const days = eachDay(from, to);

    const ops = days.map((date) =>
      this.prisma.inventory.upsert({
        // ✅ đúng composite unique theo schema: @@unique([roomTypeId, hotelId, date])
        where: {
          roomTypeId_hotelId_date: {
            roomTypeId: dto.roomTypeId,
            hotelId,
            date,
          },
        },

        create: {
          hotelId,
          roomTypeId: dto.roomTypeId,
          date,
          // ✅ không truyền null cho Prisma
          ...(dto.totalRooms !== undefined
            ? { totalRooms: dto.totalRooms }
            : {}),
          ...(dto.availableRooms !== undefined
            ? { availableRooms: dto.availableRooms }
            : {}),
          stopSell: dto.stopSell ?? false,
        },

        update: {
          deletedAt: null,
          ...(dto.totalRooms !== undefined
            ? { totalRooms: dto.totalRooms }
            : {}),
          ...(dto.availableRooms !== undefined
            ? { availableRooms: dto.availableRooms }
            : {}),
          ...(dto.stopSell !== undefined ? { stopSell: dto.stopSell } : {}),
        },
      }),
    );

    const result = await this.prisma.$transaction(ops);
    return { count: result.length };
  }

  async updateOne(
    hotelId: string,
    userId: string,
    id: string,
    dto: UpdateInventoryDto,
  ) {
    await this.assertHotelAccess(hotelId, userId);

    const inv = await this.prisma.inventory.findFirst({
      where: { id, hotelId, deletedAt: null },
      select: { id: true },
    });
    if (!inv) throw new NotFoundException('Inventory not found');

    return this.prisma.inventory.update({
      where: { id },
      data: {
        ...(dto.totalRooms !== undefined ? { totalRooms: dto.totalRooms } : {}),
        ...(dto.availableRooms !== undefined
          ? { availableRooms: dto.availableRooms }
          : {}),
        ...(dto.stopSell !== undefined ? { stopSell: dto.stopSell } : {}),
      },
    });
  }

  async softDelete(hotelId: string, userId: string, id: string) {
    await this.assertHotelAccess(hotelId, userId);

    const inv = await this.prisma.inventory.findFirst({
      where: { id, hotelId, deletedAt: null },
      select: { id: true },
    });
    if (!inv) throw new NotFoundException('Inventory not found');

    await this.prisma.inventory.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { deleted: true };
  }
}
