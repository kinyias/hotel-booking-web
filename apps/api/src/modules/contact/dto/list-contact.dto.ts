import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ListContactDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsIn(['NEW', 'IN_PROGRESS', 'RESOLVED', 'SPAM'])
  status?: 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'SPAM';

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 20;
}
