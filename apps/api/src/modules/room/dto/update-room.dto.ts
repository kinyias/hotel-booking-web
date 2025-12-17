import { RoomCleanStatus, RoomStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';

export class UpdateRoomDto {
  @IsOptional()
  @IsString()
  @Length(1, 30)
  code?: string;

  @IsOptional()
  @IsString()
  @Length(0, 30)
  floor?: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  note?: string;

  @IsOptional()
  @IsEnum(RoomStatus)
  status?: RoomStatus;

  @IsOptional()
  @IsEnum(RoomCleanStatus)
  cleanStatus?: RoomCleanStatus;
}
