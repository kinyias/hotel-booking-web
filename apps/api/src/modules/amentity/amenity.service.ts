import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { UpdateAmenityDto } from './dto/update-amenity.dto';
import { ListAmenityDto } from './dto/list-amenity.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AmenityService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAmenityDto) {
    try {
      return await this.prisma.amenity.create({
        data: {
          key: dto.key.trim(),
          label: dto.label.trim(),
          sortOrder: dto.sortOrder ?? 0,
          isActive: dto.isActive ?? true,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new BadRequestException('Amenity key already exists');
      }
      throw e;
    }
  }

  async list(q: ListAmenityDto) {
    const limit = q.limit ?? 50;
    const offset = q.page ? (q.page - 1) * limit : 0;

    const where: Prisma.AmenityWhereInput = {
      ...(q.isActive !== undefined ? { isActive: q.isActive } : {}),
      ...(q.q
        ? {
            OR: [
              { key: { contains: q.q, mode: Prisma.QueryMode.insensitive } },
              { label: { contains: q.q, mode: Prisma.QueryMode.insensitive } },
            ],
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.amenity.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
        take: limit,
        skip: offset,
      }),
      this.prisma.amenity.count({ where }),
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

  async getOne(id: string) {
    const amenity = await this.prisma.amenity.findUnique({ where: { id } });
    if (!amenity) throw new NotFoundException('Amenity not found');
    return amenity;
  }

  async update(id: string, dto: UpdateAmenityDto) {
    try {
      return await this.prisma.amenity.update({
        where: { id },
        data: {
          ...(dto.key !== undefined
            ? { key: dto.key.trim() }
            : {}),
          ...(dto.label !== undefined ? { label: dto.label.trim() } : {}),
          ...(dto.sortOrder !== undefined ? { sortOrder: dto.sortOrder } : {}),
          ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new BadRequestException('Amenity key already exists');
      }
      throw e;
    }
  }

  async disable(id: string) {
    await this.getOne(id);
    return this.prisma.amenity.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
