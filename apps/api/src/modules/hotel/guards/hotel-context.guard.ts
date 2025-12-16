import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { HotelMemberRole } from '@prisma/client';

type JwtUserLike = {
  id: string;
  email: string;
  jti: string;
  hotelMemberships?: Array<{ hotelId: string; role: HotelMemberRole }>;
};

@Injectable()
export class HotelContextGuard implements CanActivate {
  canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();

    const user = req.user as JwtUserLike | undefined;
    if (!user) return false;

    // hotelId thường nằm ở params: /hotels/:hotelId/...
    const hotelId: string | undefined = req.params?.hotelId;
    if (!hotelId) {
      // Nếu route không theo hotel context thì không set role
      return true;
    }

    req.hotelId = hotelId;

    const membership = user.hotelMemberships?.find(
      (m) => m.hotelId === hotelId,
    );

    // Không phải member => chặn (tuỳ bạn: 403 hoặc 404)
    if (!membership) {
      throw new ForbiddenException('You are not a member of this hotel');
    }

    req.hotelMemberRole = membership.role;
    return true;
  }
}
