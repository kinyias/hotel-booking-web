import { IsEmail, IsString } from 'class-validator';

export class ResendEmailDto {
  @IsString()
  @IsEmail()
  email: string;
}
