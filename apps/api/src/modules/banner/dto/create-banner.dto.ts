import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { BannerLinkType } from '@prisma/client';

export class CreateBannerDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsUrl({}, { each: true })
  images: string[]; // list url

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsEnum(BannerLinkType)
  linkType?: BannerLinkType;

  @IsOptional()
  @IsInt()
  position?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsDateString()
  startAt?: string;

  @IsOptional()
  @IsDateString()
  endAt?: string;
}
