import {
  IsBooleanString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ListUsersQuery {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsBooleanString()
  emailVerified?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset = 0;

  @IsOptional()
  @IsIn(['createdAt', 'updatedAt', 'email', 'fullName'])
  sortBy: string = 'createdAt';

  @IsOptional()
   @IsIn(['asc', 'desc'])
    order: 'asc' | 'desc' = 'desc';
}
