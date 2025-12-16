import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { HotelMemberRole } from '@prisma/client';

export class AddMemberDto {
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  userId!: string;

  @IsOptional()
  @IsEnum(HotelMemberRole)
  role?: HotelMemberRole;
}
