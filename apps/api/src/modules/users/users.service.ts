import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import { ChangePasswordDto } from '../auth/dto/change-password.dto';
import { ListUsersQuery } from '../users/dto/list-users.query';
import { UpdateMeDto } from '../users/dto/update-me.dto';

const userPublicSelect = {
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
};
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
      select: userPublicSelect,
    });
    return {
      user: result,
    };
  }

  async updateMe(userId: string, dto: UpdateMeDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.firstName !== undefined ? { firstName: dto.firstName } : {}),
        ...(dto.lastName !== undefined ? { lastName: dto.lastName } : {}),
      },
      select: userPublicSelect,
    });
    return user;
  }

  // ========== PUBLIC PROFILE ==========
  async getPublicProfile(requesterId: string, targetUserId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: userPublicSelect,
    });
    if (!user) throw new NotFoundException('User not found');

    const isSelf = requesterId === targetUserId;
    const isPrivileged = await this.isPrivileged(requesterId);

    if (!isSelf && !isPrivileged) {
      delete (user as any).email;
    }
    return user;
  }
  private async isPrivileged(userId: string): Promise<boolean> {
    if (!userId) return false;
    const exists = await this.prisma.user.findFirst({
      where: {
        id: userId,
        roles: {
          some: {
            role: {
              name: { in: ['admin', 'manager'], mode: 'insensitive' },
            },
          },
        },
      },
      select: { id: true },
    });
    return !!exists;
  }

  // ========== LIST ==========
  async listUsers(query: ListUsersQuery) {
    const { q, role, emailVerified, limit, offset, sortBy, order } = query;

    const where: any = {
      AND: [
        q
          ? {
              OR: [
                { email: { contains: q, mode: 'insensitive' } },
                { fullName: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {},
        emailVerified !== undefined
          ? { emailVerified: String(emailVerified).toLowerCase() === 'true' }
          : {},
        role
          ? {
              roles: {
                some: {
                  role: { name: { equals: role, mode: 'insensitive' } },
                },
              },
            }
          : {},
      ],
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          avatar: { select: { id: true, url: true, publicId: true } },
          roles: { select: { role: { select: { id: true, name: true } } } }, // ✅ thêm roles
        },
        orderBy: { [sortBy]: order },
        skip: offset,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return { items, total, meta: { limit, offset } };
  }
}
