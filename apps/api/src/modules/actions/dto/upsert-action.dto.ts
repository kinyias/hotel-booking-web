import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpsertActionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  key: string; // "hotel.update"

  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;

  @IsEnum(['ANY', 'ALL'] as const)
  mode: 'ANY' | 'ALL' = 'ANY';
  
  @IsOptional()
  @IsBoolean()
  enabled?: boolean = true;
}
