import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { PolicyType } from '@prisma/client';

export class CreatePolicyDto {
  @IsEnum(PolicyType)
  type: PolicyType;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  enabled?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
