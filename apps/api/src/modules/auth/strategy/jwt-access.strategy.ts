import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { HotelMemberRole } from '@prisma/client';

export type JwtUser = {
  id: string;
  email: string;
  jti: string;
  hotelMemberships: Array<{
    hotelId: string;
    // role: HotelMemberRole;
  }>;
};

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET!,
      ignoreExpiration: false,
    });
  }

  async validate(payload: any): Promise<JwtUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        hotelMemberships: {
          select: {
            hotelId: true,
            // role: true,
          },
        },
      },
    });

    if (!user) throw new UnauthorizedException();

    return {
      id: user.id,
      email: user.email,
      jti: payload.jti,
      hotelMemberships: user.hotelMemberships,
    };
  }
}
