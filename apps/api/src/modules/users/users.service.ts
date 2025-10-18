import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import { ChangePasswordDto } from '../auth/dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async createLocalUser(
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
  ) {
    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) throw new ConflictException('Email already in use');
    const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
    return this.prisma.user.create({
      data: { email, passwordHash, firstName, lastName },
    });
  }
  async markEmailVerified(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true },
    });
  }
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
  async changePassword(userId: string, dto: ChangePasswordDto) {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.passwordHash)
      throw new BadRequestException('Password auth not available');

    const ok = await argon2.verify(user.passwordHash, dto.currentPassword);
    if (!ok) throw new BadRequestException('Current password is incorrect');

    const passwordHash = await argon2.hash(dto.newPassword, {
      type: argon2.argon2id,
    });
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    // revoke other sessions (giữ lại phiên hiện tại tuỳ policy; ở đây revoke tất)
    await this.prisma.authSession.deleteMany({ where: { userId } });

    return { ok: true };
  }

  async me(userId: string) {
    const result = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
        roles: {
          select: {
            role: true,
          },
        },
        avatar: {
          select: {
            id: true,
            secureUrl: true,
            publicId: true,
          },
        },
      },
    });
    return {
      user: result,
    };
  }
}
