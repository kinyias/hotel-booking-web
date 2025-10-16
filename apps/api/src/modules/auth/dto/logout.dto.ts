import { createZodDto } from '@anatine/zod-nestjs';
import z from 'zod';

export const LogoutSchema = z.object({
  jti: z.string().uuid().optional(),
});
export class LogoutDto extends createZodDto(LogoutSchema) {}
