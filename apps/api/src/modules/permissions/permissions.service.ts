import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreatePermissionDto } from '../permissions/dto/create-permission.dto';
import { UpdatePermissionDto } from '../permissions/dto/update-permission.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ListPermissionsQueryDto } from './dto/list-permissions-query.dto';

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreatePermissionDto) {
    return this.prisma.permission.create({ data: dto });
  }

  async listPermissions(query: ListPermissionsQueryDto = {}) {
  const {
    q,
    limit = 50,
    offset = 0,
    sortBy = 'name',
    order = 'asc',
  } = query;

  const MAX_LIMIT = 200;
  const take = Math.min(Math.max(0, limit), MAX_LIMIT);
  const skip = Math.max(0, offset);

  const allowedSort: Record<string, true> = {
    id: true,
    name: true,
    createdAt: true,
    updatedAt: true,
  };
  const sanitizedSort = allowedSort[sortBy] ? sortBy : 'name';
  const sanitizedOrder: Prisma.SortOrder =
    order?.toLowerCase() === 'desc' ? 'desc' : 'asc';

  const where: Prisma.PermissionWhereInput = {
    AND: [
      q
        ? {
            OR: [
              { name: { contains: q, mode: Prisma.QueryMode.insensitive } },
              {
                description: {
                  contains: q,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            ],
          }
        : {},
    ],
  };

  const [items, total] = await this.prisma.$transaction([
    this.prisma.permission.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { [sanitizedSort]: sanitizedOrder },
      skip,
      take,
    }),
    this.prisma.permission.count({ where }),
  ]);

  return {
    data: items,
    meta: {
      limit: take,
      offset: skip,
      total,
    },
  };
}

  async findOne(id: string) {
    const item = await this.prisma.permission.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Permission not found');
    return item;
  }

  async update(id: string, dto: UpdatePermissionDto) {
    await this.findOne(id);
    return this.prisma.permission.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.permission.delete({ where: { id } });
  }
}
