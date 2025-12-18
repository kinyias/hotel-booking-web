import { Type } from 'class-transformer';
import { IsBoolean, IsISO8601, IsOptional, IsString } from 'class-validator';

export class ListInventoryDto {
  @IsISO8601()
  from: string; 
  
  @IsISO8601()
  to: string; 

  @IsOptional()
  @IsString()
  roomTypeId?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  includeStopped?: boolean;
}
