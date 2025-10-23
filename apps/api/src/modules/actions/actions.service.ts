import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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

 async setActionPermissions(id: string, permissionIds: string[]) {

  const cleanIds = permissionIds.filter((x) => typeof x === 'string' && x.trim().length > 0);

  const seen = new Set<string>();
  const dupes: string[] = [];
  for (const pid of cleanIds) {
    const key = pid.trim();
    if (seen.has(key)) dupes.push(key);
    else seen.add(key);
  }
  if (dupes.length > 0) {
    const uniqDupes = [...new Set(dupes)];
    throw new BadRequestException(`Duplicate permissionIds: ${uniqDupes.join(', ')}`);
  }

  const action = await this.prisma.apiAction.findUnique({ where: { id } });
  if (!action) throw new NotFoundException('Action not found');

  const perms = await this.prisma.permission.findMany({
    where: { id: { in: cleanIds } },
    select: { id: true, name: true },
  });
  const foundIds = new Set(perms.map((p) => p.id));
  const missingIds = cleanIds.filter((pid) => !foundIds.has(pid));
  if (missingIds.length > 0) {
    throw new NotFoundException(`Permissions not found (by id): ${missingIds.join(', ')}`);
  }

  return this.prisma.$transaction(async (tx) => {
    await tx.apiActionPolicy.deleteMany({ where: { actionId: action.id } });
    await tx.apiActionPolicy.createMany({
      data: cleanIds.map((pid) => ({ actionId: action.id, permissionId: pid })),
      skipDuplicates: true, 
    });
    return tx.apiAction.findUnique({
      where: { id: action.id },
      include: { policies: { include: { permission: true } } },
    });
  });
}

}
