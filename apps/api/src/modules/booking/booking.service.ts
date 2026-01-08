import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Prisma, BookingStatus, PaymentStatus, Gender, NotificationType, DiscountType } from '@prisma/client';
import { NotificationService } from '../notification/notification.service';
import { ListMyBookingDto } from './dto/list-my-bookings.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  CheckInDto,
  CheckInGuestDto,
} from 'src/modules/booking/dto/check-in.dto';

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
  constructor(
    private prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  private readonly PENDING_TTL_MINUTES = 15;
  private readonly logger = new Logger(BookingService.name);

  private async assertHotelAccessByBooking(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        status: true,
        hotelId: true,
        hotel: { select: { ownerId: true } },
      },
    });
    if (!booking) throw new NotFoundException('Booking not found');

    if (booking.hotel.ownerId === userId) return booking;

    const member = await this.prisma.hotelMember.findUnique({
      where: { hotelId_userId: { hotelId: booking.hotelId, userId } },
      select: { userId: true },
    });
    if (member) return booking;

    throw new ForbiddenException(
      'You are not allowed to check-in this booking',
    );
  }

  private normalizeGuests(dto: CheckInDto): CheckInGuestDto[] {
    const companions = dto.companions ?? [];
    const all = [dto.primary, ...companions];

    // lọc trùng cơ bản
    const seen = new Set<string>();
    const res: CheckInGuestDto[] = [];
    for (const g of all) {
      const userKey = g.userId ? `u:${g.userId}` : null;
      const naturalKey = `n:${(g.fullName || '').trim().toLowerCase()}|${g.idNumber || ''}|${g.email || ''}`;
      const key = userKey ?? naturalKey;
      if (seen.has(key)) continue;
      seen.add(key);
      res.push(g);
    }
    return res;
  }

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
    if (!member) throw new ForbiddenException('Forbidden');
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

    const hotelCommission = await this.prisma.hotel.findUnique({
      where: { id: hotelId },
      select: {
        ownerId: true,
        commissionPackage: {
          select: { commissionRate: true, isActive: true },
        },
        members: {
          select: { userId: true },
        },
      },
    });


    const commissionRate = hotelCommission?.commissionPackage?.isActive
      ? hotelCommission.commissionPackage.commissionRate
      : 0;

    // validate nhẹ để tránh dữ liệu bậy
    if (commissionRate < 0 || commissionRate > 1) {
      throw new BadRequestException('Invalid commissionRate on hotel package');
    }

    const result = await this.prisma.$transaction(async (tx) => {
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

      let discountAmount = new Prisma.Decimal(0);
      let finalTotal = totalAmount;
      let promotionId: string | null = null;

      if (dto.promotionCode) {
        const promotion = await tx.promotion.findUnique({
          where: { code: dto.promotionCode },
        });

        if (!promotion) {
          throw new BadRequestException('Invalid promotion code');
        }

        if (!promotion.isActive) {
          throw new BadRequestException('Promotion is inactive');
        }

        const now = new Date();
        if (now < promotion.startAt || now > promotion.endAt) {
          throw new BadRequestException('Promotion is expired or not started');
        }

        if (promotion.hotelId && promotion.hotelId !== hotelId) {
          throw new BadRequestException('Promotion not valid for this hotel');
        }

        if (
          promotion.totalUsageLimit !== null &&
          promotion.usedCount >= promotion.totalUsageLimit
        ) {
          throw new BadRequestException('Promotion usage limit exceeded');
        }

        if (promotion.perUserLimit !== null) {
          if (!userId) {
            throw new BadRequestException(
              'Login required to use this promotion',
            );
          }
          const userUsage = await tx.booking.count({
            where: {
              userId,
              promotionId: promotion.id,
              status: { not: BookingStatus.CANCELLED },
            },
          });
          if (userUsage >= promotion.perUserLimit) {
            throw new BadRequestException(
              'You have exceeded the usage limit for this promotion',
            );
          }
        }

        if (
          promotion.minBookingAmount &&
          totalAmount.lt(promotion.minBookingAmount)
        ) {
          throw new BadRequestException(
            `Minimum booking amount of ${promotion.minBookingAmount} required`,
          );
        }

        if (promotion.discountType === DiscountType.PERCENT) {
          const percent = new Prisma.Decimal(promotion.discountValue).div(100);
          let discount = totalAmount.mul(percent);
          if (
            promotion.maxDiscountAmount &&
            discount.gt(promotion.maxDiscountAmount)
          ) {
            discount = promotion.maxDiscountAmount;
          }
          discountAmount = discount;
        } else {
          discountAmount = new Prisma.Decimal(promotion.discountValue);
        }

        if (discountAmount.gt(totalAmount)) {
          discountAmount = totalAmount;
        }

        finalTotal = totalAmount.sub(discountAmount);
        promotionId = promotion.id;

        await tx.promotion.update({
          where: { id: promotion.id },
          data: { usedCount: { increment: 1 } },
        });
      }

      const commissionAmount = finalTotal
        .mul(new Prisma.Decimal(commissionRate))
        .toDecimalPlaces(0, Prisma.Decimal.ROUND_HALF_UP);

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
          totalAmount: finalTotal, // Use finalTotal
          discountAmount,
          promotionId,

          commissionRateSnapshot: commissionRate,
          commissionAmount: Number(commissionAmount.toString()),

          items: { create: itemsCreate },
        },
        include: { items: true },
      });

      return booking;
    });

    if (hotelCommission) {
      const recipients = new Set<string>();
      if (hotelCommission.ownerId) recipients.add(hotelCommission.ownerId);
      if (hotelCommission.members) {
        hotelCommission.members.forEach((m) => recipients.add(m.userId));
      }

      await Promise.all(
        Array.from(recipients).map((recipientId) =>
          this.notificationService.create({
            userId: recipientId,
            hotelId: hotelId,
            bookingId: result.id,
            type: NotificationType.NEW_BOOKING,
            title: 'New Booking',
            message: `You have a new booking from ${dto.guestName}`,
            actionUrl: `/admin/bookings/${hotelId}/booking/${result.id}`,
          }),
        ),
      );
    }

    return result;
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

  async list(
    hotelId: string,
    q: {
      status?: BookingStatus;
      from?: string;
      to?: string;
      page?: number;
      limit?: number;
      q?: string;
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
      ...(q.q ? { OR: [
          { guestName: { contains: q.q, mode: Prisma.QueryMode.insensitive } },
          { guestEmail: { contains: q.q, mode: Prisma.QueryMode.insensitive } },
        ] } : {}),
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

  @Cron(CronExpression.EVERY_MINUTE)
  async cancelExpiredPendingBookings() {
    const cutoff = new Date(Date.now() - this.PENDING_TTL_MINUTES * 60 * 1000);

    // 1) lấy các booking pending quá hạn và chưa có payment thành công
    // (PaymentStatus tuỳ schema bạn đặt: SUCCESS/PAID/... bạn sửa lại đúng enum)
    const expired = await this.prisma.booking.findMany({
      where: {
        status: BookingStatus.PENDING,
        createdAt: { lt: cutoff },
        payments: {
          none: {
            // sửa lại cho đúng PaymentStatus của bạn
            status: { in: [PaymentStatus.SUCCEEDED] },
          },
        },
      },
      select: {
        id: true,
        hotelId: true,
        checkIn: true,
        checkOut: true,
        items: { select: { roomTypeId: true, quantity: true } },
      },
      take: 100, // tránh “quét” quá nặng mỗi phút
    });

    if (!expired.length) return;

    let cancelledCount = 0;

    for (const b of expired) {
      try {
        await this.prisma.$transaction(async (tx) => {
          // 2) chống race: chỉ cancel nếu vẫn còn PENDING
          const updated = await tx.booking.updateMany({
            where: { id: b.id, status: BookingStatus.PENDING },
            data: { status: BookingStatus.CANCELLED },
          });
          if (updated.count !== 1) return; // đã được thanh toán / đổi trạng thái bởi luồng khác

          // 3) trả tồn
          const nights = eachDateFixed(b.checkIn, b.checkOut);

          for (const item of b.items) {
            for (const day of nights) {
              await tx.inventory.updateMany({
                where: {
                  hotelId: b.hotelId,
                  roomTypeId: item.roomTypeId,
                  date: day,
                },
                data: { availableRooms: { increment: item.quantity } },
              });
            }
          }
        });

        cancelledCount++;
      } catch (e: any) {
        this.logger.warn(
          `Cancel expired booking failed: ${b.id} - ${e?.message ?? e}`,
        );
      }
    }

    if (cancelledCount) {
      this.logger.log(
        `Auto-cancelled ${cancelledCount} expired pending booking(s).`,
      );
    }
  }

  async checkIn(bookingId: string, actorUserId: string, dto: CheckInDto) {
    const booking = await this.assertHotelAccessByBooking(
      bookingId,
      actorUserId,
    );

    // rule theo enum BookingStatus của bạn
    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking is cancelled');
    }
    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Booking already completed');
    }

    const guests = this.normalizeGuests(dto);
    if (!guests.length) throw new BadRequestException('Guests are required');

    const result = await this.prisma.$transaction(async (tx) => {
      // 1) tạo/ cập nhật CheckIn record
      const checkIn = await tx.checkIn.upsert({
        where: { bookingId },
        create: {
          bookingId,
          checkedInBy: actorUserId,
          note: dto.note ?? null,
          checkedInAt: new Date(),
        },
        update: {
          checkedInBy: actorUserId,
          note: dto.note ?? null,
          checkedInAt: new Date(),
        },
      });

      // 2) replace toàn bộ BookingGuest của booking (đơn giản & ít bug)
      await tx.bookingGuest.deleteMany({ where: { bookingId } });

      await tx.bookingGuest.createMany({
        data: guests.map((g) => ({
          bookingId,
          userId: g.userId ?? null,
          fullName: g.fullName,
          email: g.email ?? null,
          phone: g.phone ?? null,
          dateOfBirth: g.dateOfBirth ? new Date(g.dateOfBirth) : null,
          gender: (g.gender as Gender) ?? null,
          idNumber: g.idNumber ?? null,
          nationality: g.nationality ?? null,
        })),
      });

      // 3) cập nhật status booking -> CHECKED_IN (nếu bạn muốn)
      //    (bạn đã có enum CHECKED_IN trong schema)
      await tx.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.CHECKED_IN },
      });

      const guestsAfter = await tx.bookingGuest.findMany({
        where: { bookingId },
        orderBy: { createdAt: 'asc' },
      });

      return { checkIn, guests: guestsAfter };
    });

    return { data: result };
  }

  async getCheckIn(bookingId: string, actorUserId: string) {
    await this.assertHotelAccessByBooking(bookingId, actorUserId);

    const checkIn = await this.prisma.checkIn.findUnique({
      where: { bookingId },
    });

    const guests = await this.prisma.bookingGuest.findMany({
      where: { bookingId },
      orderBy: { createdAt: 'asc' },
    });

    return { data: { checkIn, guests } };
  }
}
