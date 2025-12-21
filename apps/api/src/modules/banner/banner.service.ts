import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BannerService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateBannerDto) {
    if (
      dto.startAt &&
      dto.endAt &&
      new Date(dto.startAt) > new Date(dto.endAt)
    ) {
      throw new BadRequestException('startAt must be <= endAt');
    }

    return this.prisma.banner.create({
      data: {
        title: dto.title,
        subtitle: dto.subtitle,
        link: dto.link,
        linkType: dto.linkType,
        position: dto.position ?? 0,
        isActive: dto.isActive ?? true,
        startAt: dto.startAt ? new Date(dto.startAt) : undefined,
        endAt: dto.endAt ? new Date(dto.endAt) : undefined,
        createdById: userId,
        images: {
          create: dto.images.map((url) => ({ url })),
        },
      },
      include: { images: true },
    });
  }

  async update(id: string, dto: UpdateBannerDto) {
    const banner = await this.prisma.banner.findUnique({ where: { id } });
    if (!banner) throw new NotFoundException('Banner not found');

    if (
      dto.startAt &&
      dto.endAt &&
      new Date(dto.startAt) > new Date(dto.endAt)
    ) {
      throw new BadRequestException('startAt must be <= endAt');
    }

    // Nếu truyền images => replace toàn bộ images
    const ops: Prisma.PrismaPromise<any>[] = [];

    ops.push(
      this.prisma.banner.update({
        where: { id },
        data: {
          title: dto.title,
          subtitle: dto.subtitle,
          link: dto.link,
          linkType: dto.linkType,
          position: dto.position,
          isActive: dto.isActive,
          startAt: dto.startAt ? new Date(dto.startAt) : undefined,
          endAt: dto.endAt ? new Date(dto.endAt) : undefined,
        },
      }),
    );

    if (dto.images) {
      ops.push(this.prisma.bannerImage.deleteMany({ where: { bannerId: id } }));
      ops.push(
        this.prisma.bannerImage.createMany({
          data: dto.images.map((url) => ({ bannerId: id, url })),
        }),
      );
    }

    await this.prisma.$transaction(ops);

    return this.prisma.banner.findUnique({
      where: { id },
      include: { images: true },
    });
  }

  async remove(id: string) {
    // bannerImage sẽ tự cascade delete
    return this.prisma.banner.delete({ where: { id } });
  }

  async listPublic() {
    const now = new Date();
    return this.prisma.banner.findMany({
      where: {
        isActive: true,
        AND: [
          { OR: [{ startAt: null }, { startAt: { lte: now } }] },
          { OR: [{ endAt: null }, { endAt: { gte: now } }] },
        ],
      },
      orderBy: { position: 'asc' },
      include: { images: true },
    });
  }

  async listAdmin() {
    return this.prisma.banner.findMany({
      orderBy: { createdAt: 'desc' },
      include: { images: true },
    });
  }
}
