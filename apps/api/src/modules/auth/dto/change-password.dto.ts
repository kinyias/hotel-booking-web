import { IsString, MinLength, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { Match } from 'src/validators/match.decorator';

// Mật khẩu mạnh: >= 8 ký tự, có hoa, thường, số, và ký tự đặc biệt
const PW_MIN = 8;
const UPPER = /[A-Z]/;
const LOWER = /[a-z]/;
const DIGIT = /[0-9]/;
const SPECIAL = /[!@#$%^&*]/;

export class ChangePasswordDto {
  @IsString()
  @MinLength(1)
  currentPassword!: string;

  @IsString()
  @MinLength(PW_MIN, {
    message: `Password must be at least ${PW_MIN} characters long.`,
  })
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
  newPassword!: string;

  @IsString()
  @MinLength(PW_MIN)
  @Match('password')
  confirmPassword!: string;
}
