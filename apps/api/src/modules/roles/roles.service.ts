import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignRolesToUserDto } from './dto/assign-roles-to-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateRoleDto) {
    try {
      return await this.prisma.role.create({ data: dto });
    } catch (e) {
      if (String(e?.code) === 'P2002') {
        throw new ConflictException('Role name already exists');
      }
      throw e;
    }
  }

  findAll(q?: { search?: string; skip?: number; take?: number }) {
    const where = q?.search
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

    return this.prisma.role.findMany({
      where,
      skip: q?.skip,
      take: q?.take ?? 50,
      orderBy: { name: 'asc' },
      include: {
        permissions: { include: { permission: true } }, // để show sẵn danh sách permission
      },
    });
  }

  async findOne(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        permissions: { include: { permission: true } },
        users: { include: { user: true } },
      },
    });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async update(id: string, dto: UpdateRoleDto) {
    await this.findOne(id);
    return this.prisma.role.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.role.delete({ where: { id } });
  }


async setRolePermissions(roleId: string, dto: AssignPermissionsDto) {
  await this.findOne(roleId);

  const cleanIds = dto.permissionIds
    .map((x) => (typeof x === 'string' ? x.trim() : ''))
    .filter((x) => x.length > 0);

  if (cleanIds.length === 0) {
    throw new BadRequestException('permissionIds contains no valid id');
  }

  const seen = new Set<string>();
  const dupes = new Set<string>();
  for (const pid of cleanIds) {
    if (seen.has(pid)) dupes.add(pid);
    else seen.add(pid);
  }
  if (dupes.size > 0) {
    throw new BadRequestException(`Duplicate permissionIds: ${[...dupes].join(', ')}`);
  }

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
    await tx.rolePermission.deleteMany({ where: { roleId } });
    await tx.rolePermission.createMany({
      data: cleanIds.map((permissionId) => ({ roleId, permissionId })),
      skipDuplicates: true, // phòng race-condition
    });

    return tx.role.findUnique({
      where: { id: roleId },
      include: { permissions: { include: { permission: true } } },
    });
  });
}


async setUserRoles(dto: AssignRolesToUserDto) {
  const user = await this.prisma.user.findUnique({ where: { id: dto?.userId } });
  if (!user) throw new NotFoundException('User not found');


  const cleanIds = dto.roleIds
    .map((x) => (typeof x === 'string' ? x.trim() : ''))
    .filter((x) => x.length > 0);

  if (cleanIds.length === 0) {
    throw new BadRequestException('roleIds contains no valid id');
  }

  const seen = new Set<string>();
  const dupes = new Set<string>();
  for (const rid of cleanIds) {
    if (seen.has(rid)) dupes.add(rid);
    else seen.add(rid);
  }
  if (dupes.size > 0) {
    throw new BadRequestException(`Duplicate roleIds: ${[...dupes].join(', ')}`);
  }

  const roles = await this.prisma.role.findMany({
    where: { id: { in: cleanIds } },
    select: { id: true, name: true },
  });

  const foundIds = new Set(roles.map((r) => r.id));
  const missingIds = cleanIds.filter((rid) => !foundIds.has(rid));
  if (missingIds.length > 0) {
    throw new NotFoundException(`Roles not found (by id): ${missingIds.join(', ')}`);
  }

  return this.prisma.$transaction(async (tx) => {
    await tx.userRole.deleteMany({ where: { userId: dto.userId } });
    await tx.userRole.createMany({
      data: cleanIds.map((roleId) => ({ userId: dto.userId, roleId })),
      skipDuplicates: true, 
    });

    return tx.user.findUnique({
      where: { id: dto.userId },
      include: { roles: { include: { role: true } } },
    });
  });
}
