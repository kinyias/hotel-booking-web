import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const RegisterDto = z
  .object({
    email: z
      .string()
      .email({ message: 'Invalid email format. Please enter a valid email.' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' })
      .max(20, { message: 'Password must not exceed 20 characters.' })
      .refine((password) => /[A-Z]/.test(password), {
        message: 'Password must contain at least one uppercase letter (A–Z).',
      })
      .refine((password) => /[a-z]/.test(password), {
        message: 'Password must contain at least one lowercase letter (a–z).',
      })
      .refine((password) => /[0-9]/.test(password), {
        message: 'Password must contain at least one number (0–9).',
      })
      .refine((password) => /[!@#$%^&*]/.test(password), {
        message:
          'Password must contain at least one special character (!, @, #, $, %, ^, &, *).',
      }),
    confirmPassword: z.string({ message: 'Please confirm your password.' }),
    firstName: z
      .string()
      .max(50, { message: 'First name must not exceed 50 characters.' })
      .optional(),
    lastName: z
      .string()
      .max(50, { message: 'Last name must not exceed 50 characters.' })
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });

  export const VerifyEmailDto = z.object({ token: z.string().min(20) });

export class RegisterDtoType extends createZodDto(RegisterDto) {}

export class VerifyEmailDtoType extends createZodDto(VerifyEmailDto) {}
