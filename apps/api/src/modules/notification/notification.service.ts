import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: {
        userId: dto.userId,
        hotelId: dto.hotelId,
        bookingId: dto.bookingId,
        type: dto.type,
        title: dto.title,
        message: dto.message,
        actionUrl: dto.actionUrl,
      },
    });
  }

  async findAllByUser(userId: string, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const [total, items] = await this.prisma.$transaction([
      this.prisma.notification.count({ where: { userId } }),
      this.prisma.notification.findMany({
        where: { userId },
        skip: offset,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUnreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });
    return { count };
  }

  async findOne(id: string, userId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id, userId },
    });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }

  async markAsRead(id: string, userId: string) {
    await this.findOne(id, userId); // check existence/ownership

    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async update(id: string, userId: string, dto: UpdateNotificationDto) {
    // Mostly for admin or system updates if needed, but rarely used by user
    await this.findOne(id, userId);
    return this.prisma.notification.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.notification.delete({
      where: { id },
    });
  }
}
