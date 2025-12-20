import { z } from 'zod';
import { NewsStatus } from './types';

export const newsFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  summary: z.string().max(400, 'Summary is too long').optional(),
  content: z.string().optional(),
  status: z.nativeEnum(NewsStatus),
  images: z
    .array(
      z.object({
        id: z.string(),
        url: z.string().url(),
      })
    )
    .optional(),
});

export type NewsFormValues = z.infer<typeof newsFormSchema>;
