import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export class LoginDto extends createZodDto(LoginSchema) {}
