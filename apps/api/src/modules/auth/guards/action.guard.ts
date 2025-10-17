import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// (Tùy chọn) dùng Redis cho cache:
import * as crypto from 'crypto';
import { createClient } from 'redis';
import { ACTION_KEY } from '../../auth/decorator/action.decorator';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ActionGuard implements CanActivate {
  private redis?: ReturnType<typeof createClient>;
  private cacheTTL = 60; // giây

  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {
    // Nếu .env đã có REDIS_HOST/PORT, bật cache
    try {
      const url = process.env.REDIS_URL || undefined;
      const host = process.env.REDIS_HOST || undefined;
      const port = process.env.REDIS_PORT
        ? Number(process.env.REDIS_PORT)
        : undefined;
      if (url || host) {
        this.redis = createClient(url ? { url } : { socket: { host, port } });
        this.redis.connect().catch(() => (this.redis = undefined));
      }
    } catch (_) {}
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    const actionKey = this.reflector.getAllAndOverride<string>(ACTION_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (!actionKey) throw new ForbiddenException('Action is not configured');

    // Lấy policy cho action từ cache/DB
    const policy = await this.getActionPolicy(actionKey);
    if (!policy) {
      // Không có cấu hình DB cho action → deny (an toàn)
      throw new ForbiddenException(`No policy bound to action "${actionKey}"`);
    }

    // Lấy tập permission của user
    const userPerms = await this.getUserPermissions(user.id);

    // Kiểm tra theo mode
    const required = policy.permissionNames;
    const hasAll = required.every((p) => userPerms.has(p));
    const hasAny = required.some((p) => userPerms.has(p));

    const ok = policy.mode === 'ALL' ? hasAll : hasAny;
    if (!ok)
      throw new ForbiddenException('Missing permission(s) for this action');

    return true;
  }

  private cacheKeyAction(actionKey: string) {
    const h = crypto.createHash('sha1').update(actionKey).digest('hex');
    return `policy:action:${h}`;
  }
  private cacheKeyUserPerm(userId: string) {
    return `permissions:user:${userId}`;
  }

  private async getActionPolicy(
    actionKey: string,
  ): Promise<{ mode: 'ANY' | 'ALL'; permissionNames: string[] } | null> {
    const key = this.cacheKeyAction(actionKey);
    if (this.redis) {
      const raw = await this.redis.get(key);
      if (raw) return JSON.parse(raw);
    }

    const action = await this.prisma.apiAction.findUnique({
      where: { key: actionKey },
      include: { policies: { include: { permission: true } } },
    });
    if (!action || !action.enabled) return null;

    const value = {
      mode: action.mode as 'ANY' | 'ALL',
      permissionNames: action.policies.map((p) => p.permission.name),
    };

    if (this.redis)
      await this.redis.setEx(key, this.cacheTTL, JSON.stringify(value));
    return value;
  }

  private async getUserPermissions(userId: string): Promise<Set<string>> {
    const key = this.cacheKeyUserPerm(userId);
    if (this.redis) {
      const raw = await this.redis.get(key);
      if (raw) return new Set<string>(JSON.parse(raw));
    }

    const roles = await this.prisma.userRole.findMany({
      where: { userId },
      include: {
        role: { include: { permissions: { include: { permission: true } } } },
      },
    });

    const set = new Set<string>();
    roles.forEach((ur) =>
      ur.role.permissions.forEach((rp) => set.add(rp.permission.name)),
    );

    if (this.redis)
      await this.redis.setEx(key, this.cacheTTL, JSON.stringify([...set]));
    return set;
  }
}
