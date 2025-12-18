import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class BulkSetInventoryDto {
  @IsISO8601()
  from: string; // YYYY-MM-DD

  @IsISO8601()
  to: string; // YYYY-MM-DD

  @IsString()
  roomTypeId: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  totalRooms?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  availableRooms?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  stopSell?: boolean;
}
