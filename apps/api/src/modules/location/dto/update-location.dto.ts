import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateLocationDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() @Length(2, 10) code?: string;
}
