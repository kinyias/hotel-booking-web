import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignRolesToUserDto } from './dto/assign-roles-to-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AssignPermissionsDto } from '../permissions/dto/assign-permissions.dto';
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

  /**
   * Gán danh sách permission theo tên cho 1 role.
   * Chiến lược: thay thế toàn bộ (reconcile) -> an toàn và đơn giản cho UI admin.
   */
  async setRolePermissions(roleId: string, dto: AssignPermissionsDto) {
    // đảm bảo role tồn tại
    await this.findOne(roleId);

    // lấy permission ids theo tên
    const perms = await this.prisma.permission.findMany({
      where: { name: { in: dto.permissionNames } },
      select: { id: true, name: true },
    });

    if (perms.length !== dto.permissionNames.length) {
      const found = new Set(perms.map((p) => p.name));
      const missing = dto.permissionNames.filter((n) => !found.has(n));
      throw new NotFoundException(
        `Permissions not found: ${missing.join(', ')}`,
      );
    }

    // transaction: xóa cũ -> thêm mới (reconcile)
    return this.prisma.$transaction(async (tx) => {
      await tx.rolePermission.deleteMany({ where: { roleId } });
      await tx.rolePermission.createMany({
        data: perms.map((p) => ({ roleId, permissionId: p.id })),
      });
      return tx.role.findUnique({
        where: { id: roleId },
        include: { permissions: { include: { permission: true } } },
      });
    });
  }

  /**
   * Gán danh sách role theo tên cho 1 user.
   * Chiến lược: thay thế toàn bộ (reconcile)
   */
  async setUserRoles(dto: AssignRolesToUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });
    if (!user) throw new NotFoundException('User not found');

    const roles = await this.prisma.role.findMany({
      where: { name: { in: dto.roleNames } },
      select: { id: true, name: true },
    });
    if (roles.length !== dto.roleNames.length) {
      const found = new Set(roles.map((r) => r.name));
      const missing = dto.roleNames.filter((n) => !found.has(n));
      throw new NotFoundException(`Roles not found: ${missing.join(', ')}`);
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.userRole.deleteMany({ where: { userId: dto.userId } });
      await tx.userRole.createMany({
        data: roles.map((r) => ({ userId: dto.userId, roleId: r.id })),
      });
      return tx.user.findUnique({
        where: { id: dto.userId },
        include: { roles: { include: { role: true } } },
      });
    });
  }
}
