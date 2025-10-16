import { z } from 'zod';
export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(16),
  JWT_ACCESS_TTL: z.string(),
  JWT_REFRESH_TTL: z.string(),
  JWT_REFRESH_SECRET: z.string().min(16),
  MAIL_FROM: z.string().min(3),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number(),
  SMTP_SECURE: z.union([z.string(), z.boolean()]).optional(),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
  PUBLIC_WEB_URL: z.string().url(),
  BRAND_NAME: z.string(),
  BRAND_LOGO_URL: z.string().url(),
  SUPPORT_EMAIL: z.string().email().optional(),
  BRAND_ADDRESS: z.string().optional(),
});
export type AppEnv = z.infer<typeof envSchema>;
