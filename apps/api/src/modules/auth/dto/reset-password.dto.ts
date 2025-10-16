import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

const strong = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Za-z]/, 'Password must contain letters')
  .regex(/\d/, 'Password must contain numbers');

export const ResetPasswordSchema = z
  .object({
    token: z.string().min(1),
    newPassword: strong,
    confirmPassword: strong,
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Confirm password does not match',
    path: ['confirmPassword'],
  });

export class ResetPasswordDto extends createZodDto(ResetPasswordSchema) {}
