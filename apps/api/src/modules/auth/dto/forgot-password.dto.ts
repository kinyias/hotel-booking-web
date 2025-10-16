import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});
export class ForgotPasswordDto extends createZodDto(ForgotPasswordSchema) {}
