import { IsString, MinLength, Matches } from 'class-validator';
import { Match } from '../../../validators/match.decorator';

const PW_MIN = 8;
const UPPER = /[A-Z]/;
const LOWER = /[a-z]/;
const DIGIT = /[0-9]/;
const SPECIAL = /[!@#$%^&*]/;

export class ResetPasswordDto {
  @IsString()
  @MinLength(1)
  token!: string;

  @IsString()
  @MinLength(PW_MIN, { message: 'Password must be at least 8 characters' })
  @Matches(/[A-Za-z]/, { message: 'Password must contain letters' })
  @Matches(/\d/, { message: 'Password must contain numbers' })
  @Matches(UPPER, {
    message: 'Password must contain at least one uppercase letter (A–Z).',
  })
  @Matches(LOWER, {
    message: 'Password must contain at least one lowercase letter (a–z).',
  })
  @Matches(SPECIAL, {
    message:
      'Password must contain at least one special character (!, @, #, $, %, ^, &, *).',
  })
  newPassword!: string;

  @IsString()
  @MinLength(PW_MIN)
  @Match('password')
  confirmPassword!: string;
}
