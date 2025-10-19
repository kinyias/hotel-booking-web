import { Transform } from 'class-transformer';
import {
  IsInt,
  Min,
  IsOptional,
  IsString,
  IsIn,
  IsBooleanString,
} from 'class-validator';

export class ListUsersDto {
  @Transform(({ value }) => parseInt(value ?? '1', 10))
  @IsInt()
  @Min(1)
  page = 1;

  @Transform(({ value }) => parseInt(value ?? '20', 10))
  @IsInt()
  @Min(1)
  limit = 20;

  @IsOptional()
  @IsString()
  q?: string; // tìm theo email / tên

  @IsOptional()
  @IsString()
  role?: string; // filter theo role cụ thể

  @IsOptional()
  @IsBooleanString()
  emailVerified?: string; // "true" | "false"

  @IsOptional()
  @IsIn(['createdAt', 'updatedAt', 'firstName', 'lastName', 'email'])
  sortBy?: 'createdAt' | 'updatedAt' | 'firstName' | 'lastName' | 'email';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';
}
