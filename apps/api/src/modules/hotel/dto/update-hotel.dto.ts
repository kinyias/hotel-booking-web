import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateHotelDto } from './create-hotel.dto';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { HotelStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class HotelImageDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  url!: string;
}

class CreateHotelDtoWithoutImages extends OmitType(CreateHotelDto, [
  'images',
] as const) {}

export class UpdateHotelDto extends PartialType(CreateHotelDtoWithoutImages) {
  @IsOptional()
  @IsEnum(HotelStatus)
  status?: HotelStatus;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => HotelImageDto)
  images?: HotelImageDto[];
}
