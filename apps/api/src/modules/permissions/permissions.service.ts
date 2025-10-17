import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreatePermissionDto } from '../permissions/dto/create-permission.dto';
import { UpdatePermissionDto } from '../permissions/dto/update-permission.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreatePermissionDto) {
    return this.prisma.permission.create({ data: dto });
  }

  findAll(q?: { search?: string; skip?: number; take?: number }) {
    const where: Prisma.PermissionWhereInput | undefined = q?.search
      ? {
          OR: [
            {
              name: { contains: q.search, mode: Prisma.QueryMode.insensitive },
            },
            {
              description: {
                contains: q.search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        }
      : undefined;

    return this.prisma.permission.findMany({
      where,
      skip: q?.skip,
      take: q?.take ?? 50,
      orderBy: { name: 'asc' },
    });
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
