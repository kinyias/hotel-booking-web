import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { HotelMemberRole } from '@prisma/client';

export class AddMemberDto {
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map(v => typeof v === 'string' ? v.trim() : v);
    }
    return value;
  })
  userIds!: string[];
}
