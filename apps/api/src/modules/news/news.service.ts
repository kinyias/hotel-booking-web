import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, NewsStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNewsDto, NewsStatusDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { ListNewsDto } from './dto/list-news.dto';

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  private mapStatus(s?: NewsStatusDto): NewsStatus | undefined {
    if (!s) return undefined;
    return s as unknown as NewsStatus;
  }

  private async loadGalleryImagesOrThrow(userId: string, imageIds?: string[]) {
    if (!imageIds || imageIds.length === 0) return [];

    const imgs = await this.prisma.imageGallery.findMany({
      where: { id: { in: imageIds }, userId }, // đảm bảo ảnh thuộc user
      select: { id: true, secureUrl: true, url: true },
    });

    if (imgs.length !== imageIds.length) {
      throw new BadRequestException(
        'Some imageIds are invalid or not belong to current user',
      );
    }

    // ưu tiên secureUrl
    return imgs.map((i) => i.secureUrl || i.url);
  }

  async create(userId: string, dto: CreateNewsDto) {
    const status = this.mapStatus(dto.status) ?? NewsStatus.DRAFT;

    // tạo slug unique (đơn giản: thêm hậu tố nếu trùng)
    const baseSlug = slugify(dto.title);
    let slug = baseSlug || `news-${Date.now()}`;
    const existed = await this.prisma.news.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (existed) slug = `${slug}-${Date.now()}`;

    const imageUrls = await this.loadGalleryImagesOrThrow(userId, dto.imageIds);

    const data: Prisma.NewsCreateInput = {
      title: dto.title,
      slug,
      summary: dto.summary,
      content: dto.content,
      status,
      publishedAt: status === NewsStatus.PUBLISHED ? new Date() : null,
      createdBy: { connect: { id: userId } },
      images: imageUrls.length
        ? { create: imageUrls.map((url) => ({ url })) }
        : undefined,
    };

    return this.prisma.news.create({
      data,
      include: {
        images: true,
        createdBy: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async list(q: ListNewsDto, isAdmin = false) {
    const page = q.page ?? 1;
    const limit = q.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.NewsWhereInput = {
      deletedAt: null,
      ...(q.q
        ? {
            OR: [
              { title: { contains: q.q, mode: 'insensitive' } },
              { summary: { contains: q.q, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(q.status ? { status: this.mapStatus(q.status) } : {}),
    };

    // Nếu là public list: chỉ show PUBLISHED
    if (!isAdmin) where.status = NewsStatus.PUBLISHED;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.news.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        include: { images: true },
      }),
      this.prisma.news.count({ where }),
    ]);

    return { page, limit, total, items };
  }

  async getById(id: string, isAdmin = false) {
    const news = await this.prisma.news.findFirst({
      where: {
        id,
        deletedAt: null,
        ...(isAdmin ? {} : { status: NewsStatus.PUBLISHED }),
      },
      include: { images: true },
    });
    if (!news) throw new NotFoundException('News not found');
    return news;
  }

  async getBySlug(slug: string, isAdmin = false) {
    const news = await this.prisma.news.findFirst({
      where: {
        slug,
        deletedAt: null,
        ...(isAdmin ? {} : { status: NewsStatus.PUBLISHED }),
      },
      include: { images: true },
    });
    if (!news) throw new NotFoundException('News not found');
    return news;
  }

  async update(userId: string, id: string, dto: UpdateNewsDto) {
    const current = await this.prisma.news.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, status: true },
    });
    if (!current) throw new NotFoundException('News not found');

    const status = this.mapStatus(dto.status);

    // nếu có imageIds -> replace toàn bộ images
    const imageUrls = dto.imageIds
      ? await this.loadGalleryImagesOrThrow(userId, dto.imageIds)
      : null;

    const data: Prisma.NewsUpdateInput = {
      title: dto.title,
      summary: dto.summary,
      content: dto.content,
      ...(status
        ? {
            status,
            publishedAt: status === NewsStatus.PUBLISHED ? new Date() : null,
          }
        : {}),
    };

    return this.prisma.$transaction(async (tx) => {
      if (imageUrls) {
        await tx.newsImage.deleteMany({ where: { newsId: id } });
        if (imageUrls.length) {
          await tx.newsImage.createMany({
            data: imageUrls.map((url) => ({ newsId: id, url })),
          });
        }
      }

      return tx.news.update({
        where: { id },
        data,
        include: { images: true },
      });
    });
  }

  async remove(id: string) {
    const exists = await this.prisma.news.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException('News not found');

    return this.prisma.news.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
