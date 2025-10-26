import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { QueryLocationDto } from './dto/query-location.dto';
import { CreateCountryDto } from './dto/create-country.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateDistrictDto } from './dto/create-district.dto';
import { CreateWardDto } from './dto/create-ward.dto';
import { CreateProvinceDto } from './dto/create-province.dto';

@Controller('locations')
export class LocationController {
  constructor(private readonly service: LocationService) {}
  @Get('countries')
  async listCountries(@Query() q: QueryLocationDto) {
    const { items, meta } = await this.service.listCountries(q);
    return { data: items, meta };
  }

  @Get('countries/:id')
  getCountry(@Param('id') id: string) {
    return this.service.getCountry(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('countries')
  createCountry(@Body() dto: CreateCountryDto) {
    return this.service.createCountry(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('provinces')
  createProvince(@Body() dto: CreateProvinceDto) {
    return this.service.createProvince(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('districts')
  createDistrict(@Body() dto: CreateDistrictDto) {
    return this.service.createDistrict(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('wards')
  createWard(@Body() dto: CreateWardDto) {
    return this.service.createWard(dto);
  }

  @Get('provinces')
  async listProvinces(
    @Query('countryId') countryId: string,
    @Query() q: QueryLocationDto,
  ) {
    const { items, meta } = await this.service.listProvinces(countryId, q);
    return { data: items, meta };
  }

  @Get('districts')
  async listDistricts(
    @Query('provinceId') provinceId: string,
    @Query() q: QueryLocationDto,
  ) {
    const { items, meta } = await this.service.listDistricts(provinceId, q);
    return {
      data: items,
      meta,
    };
  }

  @Get('wards')
  async listWards(
    @Query('districtId') districtId: string,
    @Query() q: QueryLocationDto,
  ) {
    const { items, meta } = await this.service.listWards(districtId, q);
    return { data: items, meta };
  }

  @Get('full-address/:wardId')
  fullAddress(@Param('wardId') wardId: string) {
    return this.service.getFullAddress(wardId);
  }
}
