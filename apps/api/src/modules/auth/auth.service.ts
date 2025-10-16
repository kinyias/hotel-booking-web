// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from 'src/modules/users/users.service';
import { MailService } from 'src/modules/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { addMinutes, isAfter } from 'date-fns';
import { generateToken, sha256 } from 'src/shared/utils';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private users: UsersService,
    private mail: MailService,
    private cfg: ConfigService,
    private jwt: JwtService,
  ) {}

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

  async login(dto: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (user.passwordHash) {
      const valid = await argon2.verify(user.passwordHash, dto.password);
      if (!valid) throw new UnauthorizedException('Invalid credentials');
    }

    return this.signToken(user.id, user.email);
  }

  async signToken(userId: string, email: string) {
    const payload = { sub: userId, email };
    const token = await this.jwt.signAsync(payload);
    return { access_token: token };
  }
}
