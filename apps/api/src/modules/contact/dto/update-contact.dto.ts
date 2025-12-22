import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateContactDto {
  @IsOptional()
  @IsIn(['NEW', 'IN_PROGRESS', 'RESOLVED', 'SPAM'])
  status?: 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'SPAM';

  @IsOptional()
  @IsString()
  handledById?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  note?: string;
}
