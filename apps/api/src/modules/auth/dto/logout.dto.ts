import { IsOptional, IsUUID } from 'class-validator';

export class LogoutDto {
  @IsOptional()
  @IsUUID()
  jti?: string;
}
