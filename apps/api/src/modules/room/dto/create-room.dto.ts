import { IsOptional, IsString, Length } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  roomTypeId!: string;

  @IsString()
  @Length(1, 30)
  code!: string;

  @IsOptional()
  @IsString()
  @Length(0, 30)
  floor?: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  note?: string;
}
