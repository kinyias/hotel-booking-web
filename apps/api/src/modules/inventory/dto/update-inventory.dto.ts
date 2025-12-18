import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';

export class UpdateInventoryDto {
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
