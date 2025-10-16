// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from 'src/modules/users/users.service';
import { MailService } from 'src/modules/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { addMinutes, isAfter } from 'date-fns';
import { generateToken, sha256 } from 'src/shared/utils';
import { createHash, randomUUID } from 'crypto';
import * as dayjs from 'dayjs';

type TokenPair = { accessToken: string; refreshToken: string; jti: string };

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private users: UsersService,
    private mail: MailService,
    private cfg: ConfigService,
    private jwt: JwtService,
  ) {}

  private async signAccessToken(userId: string, jti: string) {
    const accessTtl = (process.env.JWT_ACCESS_TTL ??
      '15m') as `${number}${'ms' | 's' | 'm' | 'h' | 'd'}`;

    return await this.jwt.signAsync(
      { sub: userId, jti },
      {
        secret: process.env.JWT_SECRET!,
        expiresIn: accessTtl,
      },
    );
  }

  private async signRefreshToken(userId: string, jti: string) {
    const refreshTtl = (process.env.JWT_REFRESH_TTL ??
      '30d') as `${number}${'ms' | 's' | 'm' | 'h' | 'd'}`;

    return this.jwt.signAsync(
      { sub: userId, jti, type: 'refresh' },
      {
        secret: process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET!,
        expiresIn: refreshTtl,
      },
    );
  }

  private hash(value: string) {
    return createHash('sha256').update(value, 'utf8').digest('hex');
  }

  async issueTokens(
    userId: string,
    ua?: string,
    ip?: string,
  ): Promise<TokenPair> {
    const jti = randomUUID();
    const refreshToken = await this.signRefreshToken(userId, jti);
    const accessToken = await this.signAccessToken(userId, jti);

    const payload = this.jwt.decode(refreshToken) as any;
    const expiresAt = dayjs.unix(payload.exp).toDate();

    await this.prisma.authSession.create({
      data: {
        userId,
        jti,
        refreshHash: this.hash(refreshToken),
        userAgent: ua,
        ip,
        expiresAt,
      },
    });

    return { accessToken, refreshToken, jti };
  }

  async validateUserByEmailPassword(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash)
      throw new UnauthorizedException('Invalid credentials');
    const ok = await argon2.verify(user.passwordHash, password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    if (!user.emailVerified) throw new ForbiddenException('Email not verified');
    return user;
  }

  async rotateRefreshToken(oldRefresh: string, ua?: string, ip?: string) {
    // 1) Verify & decode
    let decoded: any;
    try {
      decoded = await this.jwt.verifyAsync(oldRefresh, {
        secret: process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET!,
      });
      if (decoded?.type !== 'refresh') throw new Error('Not a refresh token');
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const { sub: userId, jti } = decoded;

    // 2) Tìm session hiện tại
    const session = await this.prisma.authSession.findUnique({
      where: { jti },
    });
    if (!session || session.revokedAt)
      throw new UnauthorizedException('Session revoked');

    // 3) Kiểm tra reuse (hash không khớp) ⇒ revoke toàn bộ phiên của user
    const matches = session.refreshHash === this.hash(oldRefresh);
    if (!matches) {
      await this.revokeAllUserSessions(userId, 'Refresh token reuse detected');
      throw new UnauthorizedException('Token reuse detected');
    }

    // 4) Rotation: revoke phiên cũ, phát hành phiên mới
    await this.prisma.authSession.update({
      where: { jti },
      data: { revokedAt: new Date(), reason: 'rotated' },
    });

    return this.issueTokens(userId, ua, ip);
  }

  async revokeSessionByJti(jti: string, by?: string, reason?: string) {
    await this.prisma.authSession.updateMany({
      where: { jti, revokedAt: null },
      data: { revokedAt: new Date(), revokedBy: by, reason },
    });
  }

  async revokeAllUserSessions(userId: string, reason?: string) {
    await this.prisma.authSession.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date(), reason: reason ?? 'bulk revoke' },
    });
  }

  async register(input: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) {
    const user = await this.users.createLocalUser(
      input.email.toLowerCase().trim(),
      input.password,
      input.firstName,
      input.lastName,
    );

    // Tạo token thô + hash
    const token = generateToken(32);
    const tokenHash = sha256(token);
    const expiresAt = addMinutes(new Date(), 30);

    await this.prisma.emailVerifyToken.create({
      data: { userId: user.id, tokenHash, expiresAt },
    });

    const verifyUrl =
      new URL(
        '/auth/verify-email',
        this.cfg.get<string>('PUBLIC_WEB_URL')!,
      ).toString() + `?token=${token}`;

    await this.mail.sendVerifyEmail(user.email, verifyUrl);

    return {
      userId: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
    };
  }

  async verifyEmail(token: string) {
    const tokenHash = sha256(token);
    const record = await this.prisma.emailVerifyToken.findUnique({
      where: { tokenHash },
    });
    if (!record) throw new NotFoundException('Invalid token');
    if (record.usedAt) throw new BadRequestException('Token already used');
    if (isAfter(new Date(), record.expiresAt))
      throw new BadRequestException('Token expired');

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: record.userId },
        data: { emailVerified: true },
      }),
      this.prisma.emailVerifyToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return { ok: true };
  }
}
