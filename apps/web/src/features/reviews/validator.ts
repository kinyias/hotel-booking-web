import { z } from 'zod';

export const createReviewSchema = z.object({
  rating: z.coerce.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  title: z.string().optional(),
  content: z.string().optional(),
  imageIds: z.array(z.string()).optional(),
  bookingId: z.string(),
});

export type CreateReviewSchema = z.infer<typeof createReviewSchema>;

export const updateReviewSchema = z.object({
  rating: z.coerce.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  title: z.string().optional(),
  content: z.string().optional(),
});

export type UpdateReviewSchema = z.infer<typeof updateReviewSchema>;
