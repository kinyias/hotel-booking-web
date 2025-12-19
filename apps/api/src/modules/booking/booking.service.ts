import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Prisma, BookingStatus } from '@prisma/client';
import { parseISO, startOfDay } from 'date-fns';
import { ListMyBookingDto } from 'src/modules/booking/dto/list-my-bookings.dto';
import { UpdateBookingStatusDto } from 'src/modules/booking/dto/update-booking-status.dto';

function eachDate(from: Date, to: Date) {
  const dates: Date[] = [];
  const d = new Date(from);
  while (d < to) {
    dates.push(new Date(d));
    d.setHours(0, 0, 0, 0);
    dates.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  // NOTE: ở trên bị push 2 lần nếu copy nhầm — dùng bản đúng dưới:
}

function eachDateFixed(from: Date, to: Date) {
  const dates: Date[] = [];
  const d = new Date(from);
  d.setUTCHours(0, 0, 0, 0);

  const end = new Date(to);
  end.setUTCHours(0, 0, 0, 0);

  while (d < end) {
    dates.push(new Date(d));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return dates;
}

function toDateOnly(d: string) {
  // YYYY-MM-DD -> Date (UTC midnight)
  return new Date(`${d}T00:00:00.000Z`);
}

@Injectable()
export class BookingService {
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
    if (!member) throw new BadRequestException('Forbidden');
  }
  
  async create(hotelId: string, userId: string, dto: CreateBookingDto) {
    const checkIn = toDateOnly(dto.checkIn);
    const checkOut = toDateOnly(dto.checkOut);

    if (!(checkIn < checkOut)) {
      throw new BadRequestException('checkOut must be after checkIn');
    }

    const nights = eachDateFixed(checkIn, checkOut);
    const nightsCount = nights.length;
    if (nightsCount <= 0) throw new BadRequestException('Invalid date range');

    const roomTypeIds = [...new Set(dto.items.map((i) => i.roomTypeId))];

    const roomTypes = await this.prisma.roomType.findMany({
      where: { id: { in: roomTypeIds }, hotelId },
      select: { id: true, name: true, price_per_night: true },
    });

    if (roomTypes.length !== roomTypeIds.length) {
      throw new BadRequestException('Some roomTypeId not belong to this hotel');
    }

    const priceMap = new Map<string, Prisma.Decimal>(
      roomTypes.map((rt) => [rt.id, rt.price_per_night]),
    );

    return this.prisma.$transaction(async (tx) => {
      // 1) Check inventory đủ cho từng item, từng ngày
      for (const item of dto.items) {
        for (const day of nights) {
          const inv = await tx.inventory.findUnique({
            where: {
              roomTypeId_hotelId_date: {
                roomTypeId: item.roomTypeId,
                hotelId,
                date: day,
              },
            },
            select: { id: true, availableRooms: true, stopSell: true },
          });

          if (!inv) {
            throw new BadRequestException(
              `Missing inventory for ${item.roomTypeId} on ${day.toISOString().slice(0, 10)}`,
            );
          }
          if (inv.stopSell) {
            throw new BadRequestException(
              `StopSell on ${day.toISOString().slice(0, 10)}`,
            );
          }
          if (inv.availableRooms < item.quantity) {
            throw new BadRequestException(
              `Not enough rooms on ${day.toISOString().slice(0, 10)}`,
            );
          }
        }
      }

      // 2) Trừ tồn
      for (const item of dto.items) {
        for (const day of nights) {
          const updated = await tx.inventory.updateMany({
            where: {
              hotelId,
              roomTypeId: item.roomTypeId,
              date: day,
              stopSell: false,
              availableRooms: { gte: item.quantity },
            },
            data: { availableRooms: { decrement: item.quantity } },
          });

          if (updated.count !== 1) {
            throw new BadRequestException(
              `Inventory changed, cannot book ${day.toISOString().slice(0, 10)}`,
            );
          }
        }
      }

      // 3) ✅ Tính tiền bằng Decimal + snapshot unitPrice
      const itemsCreate = dto.items.map((i) => {
        const unitPrice = priceMap.get(i.roomTypeId);
        if (!unitPrice) {
          throw new BadRequestException(
            `Missing price for roomTypeId ${i.roomTypeId}`,
          );
        }

        const lineTotal = unitPrice
          .mul(new Prisma.Decimal(i.quantity))
          .mul(new Prisma.Decimal(nightsCount));

        return {
          roomTypeId: i.roomTypeId,
          quantity: i.quantity,
          unitPrice,
          lineTotal,
        };
      });

      const totalAmount = itemsCreate.reduce(
        (sum, x) => sum.add(x.lineTotal),
        new Prisma.Decimal(0),
      );

      // 4) Create booking
      const booking = await tx.booking.create({
        data: {
          hotelId,
          userId,
          status: BookingStatus.PENDING,
          checkIn,
          checkOut,
          guestName: dto.guestName,
          guestEmail: dto.guestEmail,
          guestPhone: dto.guestPhone,
          note: dto.note,
          totalAmount,
          items: { create: itemsCreate },
        },
        include: { items: true },
      });

      return booking;
    });
  }

  async cancel(hotelId: string, bookingId: string) {
    return this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findFirst({
        where: { id: bookingId, hotelId },
        include: { items: true },
      });
      if (!booking) throw new NotFoundException('Booking not found');
      if (booking.status === BookingStatus.CANCELLED) return booking;

      const nights = eachDateFixed(booking.checkIn, booking.checkOut);

      // trả tồn
      for (const item of booking.items) {
        for (const day of nights) {
          await tx.inventory.updateMany({
            where: { hotelId, roomTypeId: item.roomTypeId, date: day },
            data: { availableRooms: { increment: item.quantity } },
          });
        }
      }

      return tx.booking.update({
        where: { id: booking.id },
        data: { status: BookingStatus.CANCELLED },
        include: { items: true },
      });
    });
  }

  async findOne(hotelId: string, id: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { id, hotelId },
      include: {
        items: {
            include: {
                roomType: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        },
        payments: true
    },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async list(
    hotelId: string,
    q: {
      status?: BookingStatus;
      from?: string;
      to?: string;
      page?: number;
      limit?: number;
    },
  ) {
    const page = Number(q.page) ?? 1;
    const limit = Number(q.limit) ?? 10;
    const offset = (page - 1) * limit;

    const where: Prisma.BookingWhereInput = {
      hotelId,
      ...(q.status ? { status: q.status } : {}),
      ...(q.from || q.to
        ? {
            checkIn: {
              ...(q.from ? { gte: new Date(q.from) } : {}),
              ...(q.to ? { lt: new Date(q.to) } : {}),
            },
          }
        : {}),
    };

    const [total, items] = await this.prisma.$transaction([
      this.prisma.booking.count({ where }),
      this.prisma.booking.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { items: true },
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

  async getMyBookings(userId: string, q: ListMyBookingDto) {
    const page = q.page ?? 1;
    const limit = q.limit ?? 10;
    const offset = (page - 1) * limit;

    const where: Prisma.BookingWhereInput = {
      userId,
      ...(q.status ? { status: q.status } : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.booking.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: {
          hotel: {
            select: {
              id: true,
              name: true,
              address: true,
            },
          },
          items: {
            include: {
              roomType: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          payments: {
            select: {
              id: true,
              status: true,
              amount: true,
              provider: true,
            },
          },
        },
      }),
      this.prisma.booking.count({ where }),
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

  private assertTransition(from: BookingStatus, to: BookingStatus) {
    // Terminal states không cho đổi nữa
    const terminal = new Set<BookingStatus>([
      BookingStatus.CANCELLED,
      BookingStatus.NO_SHOW,
      BookingStatus.COMPLETED, // (schema của bạn đang là COMPLETED)
    ]);
    if (terminal.has(from)) {
      throw new BadRequestException(`Booking is ${from}, cannot change status`);
    }

    const allowed: Record<BookingStatus, BookingStatus[]> = {
      [BookingStatus.PENDING]: [
        BookingStatus.CONFIRMED,
        BookingStatus.CANCELLED,
      ],
      [BookingStatus.CONFIRMED]: [
        BookingStatus.CANCELLED,
        BookingStatus.CHECKED_IN,
        BookingStatus.NO_SHOW,
      ],
      [BookingStatus.CHECKED_IN]: [BookingStatus.COMPLETED],
      [BookingStatus.CANCELLED]: [],
      [BookingStatus.NO_SHOW]: [],
      [BookingStatus.COMPLETED]: [],
    };

    if (!allowed[from]?.includes(to)) {
      throw new BadRequestException(`Invalid transition: ${from} -> ${to}`);
    }
  }

  async updateStatus(
    hotelId: string,
    userId: string,
    bookingId: string,
    dto: UpdateBookingStatusDto,
  ) {
    await this.assertHotelAccess(hotelId, userId);

    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, hotelId },
      select: { id: true, status: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    if (booking.status === dto.status) {
      return this.prisma.booking.findUnique({
        where: { id: bookingId },
        include: { items: true, payments: true },
      });
    }

    this.assertTransition(booking.status, dto.status);

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: dto.status },
      include: {
        items: true,
        payments: true,
        hotel: { select: { id: true, name: true } },
      },
    });
  }

  async getMyBookingDetail(userId: string, bookingId: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, userId },
      include: {
        hotel: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            country: true,
            images: { take: 1, select: { url: true } },
          },
        },
        items: {
          include: {
            roomType: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        payments: true,
      },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

}
