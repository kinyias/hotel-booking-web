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
import * as crypto from 'crypto';
import dayjs from 'dayjs';
import { AuthProvider } from '@prisma/client';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';

type TokenPair = { accessToken: string; refreshToken: string; jti: string };
const RESET_TTL_MINUTES = 30;

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

  async issueTokens(
    userId: string,
    ctx?: { ua?: string; ip?: string; provider?: AuthProvider },
  ): Promise<TokenPair> {
    // 1) Xác định provider hợp lý
    let provider: AuthProvider | undefined = ctx?.provider;
    if (!provider) {
      const u = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { provider: true },
      });
      provider = u?.provider ?? AuthProvider.LOCAL;
    }

    // 2) Ký token với jti riêng
    const jti = crypto.randomUUID();
    const refreshToken = await this.signRefreshToken(userId, jti);
    const accessToken = await this.signAccessToken(userId, jti);

    // 3) Tính expiresAt từ refresh (exp là seconds)
    const payload = this.jwt.decode(refreshToken) as { exp: number } | null;
    if (!payload?.exp) {
      // Phòng hờ cấu hình JWT sai
      throw new Error('Failed to decode refresh token exp');
    }
    const expiresAt = dayjs.unix(payload.exp).toDate();

    // 4) Lưu phiên với provider đúng nguồn
    const refreshHash = await argon2.hash(refreshToken);
    await this.prisma.authSession.create({
      data: {
        userId,
        jti,
        provider,
        refreshHash,
        userAgent: ctx?.ua,
        ip: ctx?.ip,
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
    const valid = await argon2.verify(session.refreshHash, oldRefresh);
    if (!valid) {
      await this.revokeAllUserSessions(userId, 'Refresh token reuse detected');
      throw new UnauthorizedException('Token reuse detected');
    }

    // 4) Rotation: revoke phiên cũ, phát hành phiên mới
    await this.revokeSessionByJti(jti, userId, 'rotated');

    return this.issueTokens(userId, {
      ua,
      ip,
    });
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

  async register(input: RegisterDto) {
    const user = await this.users.createLocalUser(
      input.email.toLowerCase().trim(),
      input.password,
      input.firstName,
      input.lastName,
    );
    if (input.password !== input.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
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

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    // Trả về 202 luôn để tránh lộ user enumeration
    if (!user) return;

    // Xoá token cũ (nếu có) của user để tránh spam
    await this.prisma.passwordResetToken.deleteMany({
      where: { userId: user.id, usedAt: null },
    });

    // tạo token thô + hash
    const raw = crypto.randomBytes(32).toString('hex'); // 64 hex chars
    const tokenHash = crypto.createHash('sha256').update(raw).digest('hex');

    const expiresAt = new Date(Date.now() + RESET_TTL_MINUTES * 60_000);
    await this.prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt },
    });

    // link về FE
    const resetUrl = `${process.env.PUBLIC_WEB_URL}/auth/reset?token=${raw}`;
    await this.mail.sendPasswordResetEmail(user.email, resetUrl);
  }

  async resetPassword(
    rawToken: string,
    newPassword: string,
    confirmPassword: string,
    ip?: string,
    ua?: string,
  ) {
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    const tokenHash = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    const token = await this.prisma.passwordResetToken.findFirst({
      where: { tokenHash },
      include: { user: true },
    });
    if (!token) throw new UnauthorizedException('Invalid or expired token');
    if (token.usedAt) throw new UnauthorizedException('Token already used');
    if (token.expiresAt.getTime() < Date.now())
      throw new UnauthorizedException('Token expired');

    // hash pwd
    const passwordHash = await argon2.hash(newPassword, {
      type: argon2.argon2id,
    });
    // update user
    await this.prisma.user.update({
      where: { id: token.userId },
      data: { passwordHash },
    });

    // mark token used
    await this.prisma.passwordResetToken.update({
      where: { id: token.id },
      data: { usedAt: new Date() },
    });

    // revoke all sessions of user
    await this.prisma.authSession.deleteMany({
      where: { userId: token.userId },
    });
    // Optional: push jti vào Redis blocklist nếu bạn đang giữ refresh jti ở đâu đó

    return { ok: true };
  }

  async loginWithGoogle(
    googleUser: {
      providerId: string;
      email: string | null;
      name: string;
      avatar?: string | null;
    },
    ctx: { ip?: string; userAgent?: string },
  ) {
    const { providerId, email } = googleUser;

    // 1) Kiếm user bằng providerId
    let user = await this.prisma.user.findUnique({ where: { providerId } });

    // 2) Nếu chưa có, cân nhắc email
    if (!user) {
      if (email) {
        const existingByEmail = await this.prisma.user.findUnique({
          where: { email },
        });
        if (existingByEmail && existingByEmail.provider === 'LOCAL') {
          // KHÔNG tự động gộp để tránh takeover.
          // Có thể trả về 409 và yêu cầu liên kết thủ công trong trang bảo mật.
          throw new UnauthorizedException(
            'Email already registered. Please login with password, then link Google in account settings.',
          );
        }
      }

      user = await this.prisma.user.create({
        data: {
          email: email ?? `${providerId}@google.local`, // fallback
          provider: 'GOOGLE',
          providerId,
          emailVerified: true, // Google đã xác minh email → có thể đặt true nếu email != null
          // name/avatar… nếu schema có
        },
      });
    }

    // 3) Tạo phiên + refresh rotation
    const jti = crypto.randomUUID();
    const accessToken = await this.signAccessToken(user.id, jti);
    const refreshToken = await this.signRefreshToken(user.id, jti);
    const refreshHash = await argon2.hash(refreshToken);

    const expiresAt = dayjs().add(30, 'day').toDate(); // hoặc dùng TTL env
    await this.prisma.authSession.create({
      data: {
        userId: user.id,
        jti,
        provider: 'GOOGLE',
        ip: ctx.ip,
        userAgent: ctx.userAgent,
        refreshHash,
        expiresAt,
      },
    });

    return { accessToken, refreshToken, user };
  }

  async getSessions(userId: string) {
    const sessions = await this.prisma.authSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        jti: true,
        provider: true,
        ip: true,
        userAgent: true,
        createdAt: true,
        expiresAt: true,
        revokedAt: true,
      },
    });
    return sessions;
  }
}
