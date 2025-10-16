import { createZodDto } from '@anatine/zod-nestjs';
import z from 'zod';

export const VerifyEmailZ = z.object({ token: z.string().min(20) });

export class VerifyEmailDto extends createZodDto(VerifyEmailZ) {}
