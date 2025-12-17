import { PartialType } from '@nestjs/mapped-types';
import { CreateHotelDto } from './create-hotel.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { HotelStatus } from '@prisma/client';

export class UpdateHotelDto extends PartialType(CreateHotelDto) {
  @IsOptional()
  @IsEnum(HotelStatus)
  status?: HotelStatus;
}
