import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateReviewDto } from './dto/create-review.dto';
import { ListReviewsDto } from './dto/list-reviews.dto';
import { ModerateReviewDto, UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
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
    if (!member) throw new ForbiddenException('No permission on this hotel');
  }

  async create(hotelId: string, userId: string, dto: CreateReviewDto) {
    // 1) booking hợp lệ
    const booking = await this.prisma.booking.findFirst({
      where: { id: dto.bookingId, hotelId, userId },
      select: { id: true, status: true },
    });
    if (!booking)
      throw new NotFoundException(
        'Booking not found (or not belong to you / this hotel)',
      );
    if (booking.status !== 'COMPLETED')
      throw new BadRequestException('Only COMPLETED bookings can be reviewed');

    // 2) load gallery images (nếu có)
    const imageIds = (dto.imageIds ?? []).filter(Boolean);
    let galleryImages: { id: string; secureUrl: string; url: string }[] = [];

    if (imageIds.length > 0) {
      galleryImages = await this.prisma.imageGallery.findMany({
        where: {
          id: { in: imageIds },
          userId, // bắt buộc ảnh thuộc user
        },
        select: { id: true, secureUrl: true, url: true },
      });

      if (galleryImages.length !== imageIds.length) {
        throw new ForbiddenException(
          'Some images are not in your gallery (or not found)',
        );
      }
    }

    // 3) transaction: tạo review + tạo review images
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const review = await tx.review.create({
          data: {
            hotelId,
            userId,
            bookingId: booking.id,
            rating: dto.rating,
            title: dto.title,
            content: dto.content,
          },
        });

        if (galleryImages.length > 0) {
          await tx.reviewImage.createMany({
            data: galleryImages.map((img) => ({
              reviewId: review.id,
              url: img.secureUrl || img.url,
            })),
          });
        }

        return tx.review.findUnique({
          where: { id: review.id },
          include: {
            images: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarId: true,
              },
            },
          },
        });
      });

      return result;
    } catch (e: any) {
      // bookingId unique => P2002 nếu đã review
      if (e?.code === 'P2002') {
        throw new BadRequestException('This booking has already been reviewed');
      }
      throw e;
    }
  }

  // Public list: chỉ hiện review chưa deleted + không bị hidden
  async listPublic(hotelId: string, q: ListReviewsDto) {
    const page = q.page ?? 1;
    const limit = q.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.ReviewWhereInput = {
      hotelId,
      deletedAt: null,
      isHidden: false,
      ...(q.q
        ? {
            OR: [
              { title: { contains: q.q, mode: 'insensitive' } },
              { content: { contains: q.q, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          images:true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: {
                select: {
                  id: true,
                  secureUrl: true,
                  publicId: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.review.count({ where }),
    ]);

    return { page, limit, total, items };
  }

  async listForModeration(hotelId: string, userId: string, q: ListReviewsDto) {
    await this.assertHotelAccess(hotelId, userId);

    const page = q.page ?? 1;
    const limit = q.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.ReviewWhereInput = {
      hotelId,
      deletedAt: null,
      ...(q.q
        ? {
            OR: [
              { title: { contains: q.q, mode: 'insensitive' } },
              { content: { contains: q.q, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          images: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: {
                select: {
                  id: true,
                  secureUrl: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.review.count({ where }),
    ]);

    return { page, limit, total, items };
  }

  async listMy(userId: string, q: ListReviewsDto) {
    const page = q.page ?? 1;
    const limit = q.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.ReviewWhereInput = {
      userId,
      deletedAt: null,
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          hotel: { select: { id: true, name: true } },
        },
      }),
      this.prisma.review.count({ where }),
    ]);

    return { page, limit, total, items };
  }

  async updateMy(reviewId: string, userId: string, dto: UpdateReviewDto) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      select: { id: true, userId: true, deletedAt: true },
    });
    if (!review || review.deletedAt)
      throw new NotFoundException('Review not found');
    if (review.userId !== userId)
      throw new ForbiddenException('Not your review');

    return this.prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: dto.rating,
        title: dto.title,
        content: dto.content,
      },
    });
  }

  // moderation: owner/member/admin (tuỳ bạn gắn ActionGuard) có thể ẩn/hiện
  async moderate(
    hotelId: string,
    userId: string,
    reviewId: string,
    dto: ModerateReviewDto,
  ) {
    await this.assertHotelAccess(hotelId, userId);

    const review = await this.prisma.review.findFirst({
      where: { id: reviewId, hotelId, deletedAt: null },
      select: { id: true },
    });
    if (!review) throw new NotFoundException('Review not found');

    return this.prisma.review.update({
      where: { id: reviewId },
      data: { isHidden: dto.isHidden ?? undefined },
    });
  }

  // soft delete (moderation)
  async remove(hotelId: string, userId: string, reviewId: string) {
    await this.assertHotelAccess(hotelId, userId);

    const review = await this.prisma.review.findFirst({
      where: { id: reviewId, hotelId, deletedAt: null },
      select: { id: true },
    });
    if (!review) throw new NotFoundException('Review not found');

    return this.prisma.review.update({
      where: { id: reviewId },
      data: { deletedAt: new Date() },
    });
  }
}
