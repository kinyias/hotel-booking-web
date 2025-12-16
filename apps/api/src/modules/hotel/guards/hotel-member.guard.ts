import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class HotelMemberGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    const userId = req.user?.id;
    const hotelId = req.params.hotelId;

    if (!userId || !hotelId) return false;

    const membership = await this.prisma.hotelMember.findUnique({
      where: { hotelId_userId: { hotelId, userId } },
      select: { role: true },
    });

    // nếu là owner nhưng chưa có member record (hiếm) vẫn có thể check ownerId
    if (!membership) {
      const hotel = await this.prisma.hotel.findUnique({
        where: { id: hotelId },
        select: { ownerId: true },
      });
      if (hotel?.ownerId === userId) {
        req.hotelMemberRole = 'OWNER';
        return true;
      }
      return false;
    }

    req.hotelMemberRole = membership.role;
    
    console.log('userId', userId, 'hotelId', hotelId);
    console.log('req.user', req.user);

    return true;
  }
}
