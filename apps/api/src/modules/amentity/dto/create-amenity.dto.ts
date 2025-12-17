import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAmenityDto {
  @IsString()
  @IsNotEmpty()
  key!: string; // WIFI

  @IsString()
  @IsNotEmpty()
  label!: string; // Wi-Fi

  @IsString()
  @IsNotEmpty()
  iconKey!: string; // Wifi (lucide-react)

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number = 0;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean = true;
}
