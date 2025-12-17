import { IsOptional, IsString, Length, MaxLength, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
export class HotelImageDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  url!: string;
}
export class CreateHotelDto {
  @IsString()
  @Length(2, 120)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  country?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  description?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => HotelImageDto)
  images?: HotelImageDto[];
}
