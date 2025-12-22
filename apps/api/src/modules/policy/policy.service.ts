import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class PolicyService {
  constructor(private prisma: PrismaService) {}
  async assertHotelAccess(hotelId: string, userId: string) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { id: hotelId },
      select: { ownerId: true },
    });
    if (!hotel) throw new NotFoundException('Hotel not found');

    if (hotel.ownerId === userId) return;

    const member = await this.prisma.hotelMember.findUnique({
      where: {
        hotelId_userId: { hotelId, userId },
      },
    });

    if (!member) throw new ForbiddenException('Not a member of this hotel');
  }

  async listPublic(hotelId: string) {
    return this.prisma.hotelPolicy.findMany({
      where: { hotelId, enabled: true },
      orderBy: { order: 'asc' },
    });
  }

  async listAdmin(hotelId: string, userId: string) {
    await this.assertHotelAccess(hotelId, userId);

    return this.prisma.hotelPolicy.findMany({
      where: { hotelId },
      orderBy: { order: 'asc' },
    });
  }

  async getOne(hotelId: string, userId: string, id: string) {
    await this.assertHotelAccess(hotelId, userId);

    const policy = await this.prisma.hotelPolicy.findUnique({
      where: { id },
    });

    if (!policy || policy.hotelId !== hotelId) {
      throw new NotFoundException('Policy not found');
    }

    return policy;
  }

  async create(hotelId: string, userId: string, dto: CreatePolicyDto) {
    await this.assertHotelAccess(hotelId, userId);

    return this.prisma.hotelPolicy.create({
      data: { hotelId, ...dto },
    });
  }

  async update(
    hotelId: string,
    userId: string,
    id: string,
    dto: UpdatePolicyDto,
  ) {
    await this.assertHotelAccess(hotelId, userId);

    return this.prisma.hotelPolicy.update({
      where: { id },
      data: dto,
    });
  }

  async remove(hotelId: string, userId: string, id: string) {
    await this.assertHotelAccess(hotelId, userId);

    return this.prisma.hotelPolicy.delete({ where: { id } });
  }
}
