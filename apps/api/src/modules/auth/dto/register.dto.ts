// src/auth/dto/register.dto.ts
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  Matches,
  IsStrongPassword,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  confirmPassword: string;
}
