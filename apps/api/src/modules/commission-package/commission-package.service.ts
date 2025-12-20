import { Injectable } from '@nestjs/common';
import { CreateCommissionPackageDto } from 'src/modules/commission-package/dto/create-commission-package.dto';
import { UpdateCommissionPackageDto } from 'src/modules/commission-package/dto/update-commission-package.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class CommissionPackageService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.commissionPackage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.commissionPackage.findUnique({
      where: { id },
    });
  }

  async create(dto: CreateCommissionPackageDto) {
    return this.prisma.commissionPackage.create({ data: dto });
  }

  async update(id: string, dto: UpdateCommissionPackageDto) {
    return this.prisma.commissionPackage.update({
      where: { id },
      data: dto,
    });
  }

  async deactivate(id: string) {
    return this.prisma.commissionPackage.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async setCommissionPackage(hotelId: string, commissionPackageId: string) {
    return this.prisma.hotel.update({
      where: { id: hotelId },
      data: { commissionPackageId: commissionPackageId },
    });
  }
}
