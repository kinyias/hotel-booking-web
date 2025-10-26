import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryLocationDto } from './dto/query-location.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class LocationService {
  constructor(private readonly prisma: PrismaService) {}

  async listCountries(q?: QueryLocationDto) {
    const where: Prisma.CountryWhereInput | undefined = q?.q
      ? { name: { contains: q.q, mode: 'insensitive' } }
      : undefined;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.country.findMany({
        where,
        skip: q?.offset,
        take: q?.limit ?? 50,
        orderBy: { name: 'asc' },
      }),
      this.prisma.country.count({ where }),
    ]);
    return {
      items,
      meta: { total, limit: q?.limit ?? 50, offset: q?.offset ?? 0 },
    };
  }

  async getCountry(id: string) {
    const item = await this.prisma.country.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Country not found');
    return item;
  }

  async createCountry(data: { name: string; code: string }) {
    return this.prisma.country.create({ data });
  }

  async createProvince(data: {
    name: string;
    code: string;
    countryId: string;
  }) {
    const country = await this.prisma.country.findUnique({
      where: { id: data.countryId },
      select: { id: true },
    });
    if (!country) throw new NotFoundException('Country not found');
    return this.prisma.province.create({ data });
  }

  async createDistrict(data: {
    name: string;
    code: string;
    provinceId: string;
  }) {
    const province = await this.prisma.province.findUnique({
      where: { id: data.provinceId },
      select: { id: true },
    });
    if (!province) throw new NotFoundException('Province not found');
    return this.prisma.district.create({ data });
  }

  async createWard(data: { name: string; code: string; districtId: string }) {
    const district = await this.prisma.district.findUnique({
      where: { id: data.districtId },
      select: { id: true },
    });
    if (!district) throw new NotFoundException('District not found');
    return this.prisma.ward.create({ data });
  }

  async listProvinces(countryId?: string, q?: QueryLocationDto) {
    const where: Prisma.ProvinceWhereInput = {
      AND: [
        countryId ? { countryId } : {},
        q?.q ? { name: { contains: q.q, mode: 'insensitive' } } : {},
      ],
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.province.findMany({
        where,
        skip: q?.offset,
        take: q?.limit ?? 50,
        orderBy: { name: 'asc' },
      }),
      this.prisma.province.count({ where }),
    ]);
    return {
      items,
      meta: { total, limit: q?.limit ?? 50, offset: q?.offset ?? 0 },
    };
  }

  async listDistricts(provinceId?: string, q?: QueryLocationDto) {
    const where: Prisma.DistrictWhereInput = {
      AND: [
        provinceId ? { provinceId } : {},
        q?.q ? { name: { contains: q.q, mode: 'insensitive' } } : {},
      ],
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.district.findMany({
        where,
        skip: q?.offset,
        take: q?.limit ?? 50,
        orderBy: { name: 'asc' },
      }),
      this.prisma.district.count({ where }),
    ]);
    return {
      items,
      meta: { total, limit: q?.limit ?? 50, offset: q?.offset ?? 0 },
    };
  }

  async listWards(districtId?: string, q?: QueryLocationDto) {
    const where: Prisma.WardWhereInput = {
      AND: [
        districtId ? { districtId } : {},
        q?.q ? { name: { contains: q.q, mode: 'insensitive' } } : {},
      ],
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.ward.findMany({
        where,
        skip: q?.offset,
        take: q?.limit ?? 50,
        orderBy: { name: 'asc' },
      }),
      this.prisma.ward.count({ where }),
    ]);
    return {
      items,
      meta: { total, limit: q?.limit ?? 50, offset: q?.offset ?? 0 },
    };
  }

  async getFullAddress(wardId: string) {
    const ward = await this.prisma.ward.findUnique({
      where: { id: wardId },
      include: {
        district: { include: { province: { include: { country: true } } } },
      },
    });
    if (!ward) throw new NotFoundException('Ward not found');
    const d = ward.district;
    const p = d?.province;
    const c = p?.country;
    return {
      ward: { id: ward.id, name: ward.name },
      district: d ? { id: d.id, name: d.name } : null,
      province: p ? { id: p.id, name: p.name } : null,
      country: c ? { id: c.id, name: c.name, code: c.code } : null,
      asText: [ward.name, d?.name, p?.name, c?.name].filter(Boolean).join(', '),
    };
  }
}
