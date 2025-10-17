import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class ActionsService {
  constructor(private prisma: PrismaService) {}

  upsert(dto: {
    key: string;
    description?: string;
    mode?: 'ANY' | 'ALL';
    enabled?: boolean;
  }) {
    return this.prisma.apiAction.upsert({
      where: { key: dto.key },
      create: {
        key: dto.key,
        description: dto.description,
        mode: (dto.mode ?? 'ANY') as any,
        enabled: dto.enabled ?? true,
      },
      update: {
        description: dto.description,
        mode: (dto.mode ?? 'ANY') as any,
        enabled: dto.enabled ?? true,
      },
    });
  }

  findAll() {
    return this.prisma.apiAction.findMany({
      orderBy: { key: 'asc' },
      include: { policies: { include: { permission: true } } },
    });
  }

  async findOneByKey(key: string) {
    const item = await this.prisma.apiAction.findUnique({
      where: { key },
      include: { policies: { include: { permission: true } } },
    });
    if (!item) throw new NotFoundException('Action not found');
    return item;
  }

  async setActionPermissions(key: string, permissionNames: string[]) {
    const action = await this.prisma.apiAction.findUnique({ where: { key } });
    if (!action) throw new NotFoundException('Action not found');

    const perms = await this.prisma.permission.findMany({
      where: { name: { in: permissionNames } },
      select: { id: true, name: true },
    });
    if (perms.length !== permissionNames.length) {
      const found = new Set(perms.map((p) => p.name));
      const missing = permissionNames.filter((n) => !found.has(n));
      throw new NotFoundException(
        `Permissions not found: ${missing.join(', ')}`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.apiActionPolicy.deleteMany({ where: { actionId: action.id } });
      await tx.apiActionPolicy.createMany({
        data: perms.map((p) => ({ actionId: action.id, permissionId: p.id })),
      });
      return tx.apiAction.findUnique({
        where: { id: action.id },
        include: { policies: { include: { permission: true } } },
      });
    });
  }

}
