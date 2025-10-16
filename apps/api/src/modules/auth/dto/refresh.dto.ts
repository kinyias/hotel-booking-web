import { createZodDto } from '@anatine/zod-nestjs';
import z from 'zod';

export const RefreshSchema = z.object({
  refreshToken: z.string().min(10),
});
export class RefreshDto extends createZodDto(RefreshSchema) {}
