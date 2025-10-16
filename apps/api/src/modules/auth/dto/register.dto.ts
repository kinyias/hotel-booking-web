import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Match } from 'src/validators/match.decorator';

const PW_MIN = 8;
const PW_MAX = 20;
const UPPER = /[A-Z]/;
const LOWER = /[a-z]/;
const DIGIT = /[0-9]/;
const SPECIAL = /[!@#$%^&*]/;

export class RegisterDto {
  @Transform(({ value }) => String(value).trim().toLowerCase())
  @IsEmail({}, { message: 'Invalid email format. Please enter a valid email.' })
  email!: string;

  @IsString()
  @MinLength(PW_MIN, {
    message: 'Password must be at least 8 characters long.',
  })
  @MaxLength(PW_MAX, { message: 'Password must not exceed 20 characters.' })
  @Matches(UPPER, {
    message: 'Password must contain at least one uppercase letter (A–Z).',
  })
  @Matches(LOWER, {
    message: 'Password must contain at least one lowercase letter (a–z).',
  })
  @Matches(DIGIT, {
    message: 'Password must contain at least one number (0–9).',
  })
  @Matches(SPECIAL, {
    message:
      'Password must contain at least one special character (!, @, #, $, %, ^, &, *).',
  })
  password!: string;

  @IsString({ message: 'Please confirm your password.' })
  @Match('password')
  confirmPassword!: string;

  @IsOptional()
  @Transform(({ value }) =>
    value === undefined || value === null ? value : String(value).trim(),
  )
  @IsString()
  @MaxLength(50, { message: 'First name must not exceed 50 characters.' })
  firstName?: string;

  @IsOptional()
  @Transform(({ value }) =>
    value === undefined || value === null ? value : String(value).trim(),
  )
  @IsString()
  @MaxLength(50, { message: 'Last name must not exceed 50 characters.' })
  lastName?: string;
}
