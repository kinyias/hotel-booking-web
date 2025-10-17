import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from 'src/modules/auth/decorator/permissions.decorator';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermissions) return true;

    const { user } = context.switchToHttp().getRequest();

    const userRoles = await this.prisma.userRole.findMany({
      where: { userId: user.id },
      include: {
        role: { include: { permissions: { include: { permission: true } } } },
      },
    });

    const userPerms = new Set<string>();
    userRoles.forEach((ur) =>
      ur.role.permissions.forEach((rp) => userPerms.add(rp.permission.name)),
    );

    const hasPerm = requiredPermissions.every((p) => userPerms.has(p));
    if (!hasPerm)
      throw new ForbiddenException('Access denied: missing permissions');
    return true;
  }
}
