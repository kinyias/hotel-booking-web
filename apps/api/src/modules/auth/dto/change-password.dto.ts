import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

const strong = z
  .string()
  .min(8)
  .regex(/[A-Za-z]/)
  .regex(/\d/);

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: strong,
    confirmPassword: strong,
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Confirm password does not match',
    path: ['confirmPassword'],
  });

export class ChangePasswordDto extends createZodDto(ChangePasswordSchema) {}
