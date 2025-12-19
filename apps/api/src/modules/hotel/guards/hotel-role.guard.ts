import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { HotelMemberRole } from '@prisma/client';
import { HOTEL_ROLES_KEY } from '../decorator/hotel-role.decorator';

@Injectable()
export class HotelRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();

    const roles =
      this.reflector.getAllAndOverride<HotelMemberRole[]>(HOTEL_ROLES_KEY, [
        ctx.getHandler(),
        ctx.getClass(),
      ]) ?? [];

    // Không yêu cầu role => cho qua
    if (roles.length === 0) return true;

    console.log('required roles', roles);
    console.log('myRole', req.hotelMemberRole);

    const myRole = req.hotelMemberRole as HotelMemberRole | undefined;

    // Chưa set role (quên chạy HotelContextGuard) => fail
    if (!myRole) return false;

    return roles.includes(myRole);
  }
}
