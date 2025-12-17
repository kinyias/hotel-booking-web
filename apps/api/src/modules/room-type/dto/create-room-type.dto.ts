import { Transform, Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateRoomTypeDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  // Prisma Decimal: nhận string để tránh float
  @IsNotEmpty()
  @Transform(({ value }) =>
    value === null || value === undefined ? value : String(value),
  )
  price_per_night!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  max_guests!: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  amenityIds?: string[];
}
