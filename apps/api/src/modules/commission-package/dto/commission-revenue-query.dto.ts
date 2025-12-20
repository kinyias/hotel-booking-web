import { IsDateString, IsOptional } from 'class-validator';

export class CommissionRevenueQueryDto {
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  @IsOptional()
  year?: string;
}
