import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateBookingItemDto {
  @IsString()
  @IsNotEmpty()
  roomTypeId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateBookingDto {
  @IsDateString()
  checkIn: string; // yyyy-mm-dd

  @IsDateString()
  checkOut: string; // yyyy-mm-dd (exclusive)

  @IsString()
  @IsNotEmpty()
  guestName: string;

  @IsOptional()
  @IsEmail()
  guestEmail?: string;

  @IsOptional()
  @IsPhoneNumber('VN')
  guestPhone?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateBookingItemDto)
  items: CreateBookingItemDto[];
}
