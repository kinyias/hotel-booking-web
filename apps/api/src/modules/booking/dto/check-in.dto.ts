// src/modules/booking/dto/check-in.dto.ts
import {
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Gender } from '@prisma/client';

export class CheckInGuestDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  idNumber?: string;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  // schema bạn là DateTime? => nhận ISO string rồi new Date()
  @IsOptional()
  @IsString()
  dateOfBirth?: string; // ISO, vd "1999-01-01"
}

export class CheckInDto {
  @IsOptional()
  @IsString()
  note?: string;

  // người đại diện / người chính
  @ValidateNested()
  @Type(() => CheckInGuestDto)
  primary: CheckInGuestDto;

  // người đi cùng
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => CheckInGuestDto)
  companions?: CheckInGuestDto[];
}
