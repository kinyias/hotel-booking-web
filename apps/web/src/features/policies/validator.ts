import { z } from 'zod';

export const policyTypeEnum = z.enum(['CHECKIN', 'CANCELLATION', 'PAYMENT', 'CHILDREN', 'PET', 'SMOKING', 'GENERAL']);

export const createPolicySchema = z.object({
  type: policyTypeEnum,
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  content: z.string().min(1, 'Content is required').max(5000, 'Content is too long'),
  enabled: z.boolean().optional().default(true),
  order: z.number().int().min(0).optional().default(0),
});

export const updatePolicySchema = z.object({
  type: policyTypeEnum.optional(),
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long').optional(),
  content: z.string().min(1, 'Content is required').max(5000, 'Content is too long').optional(),
  enabled: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
});

export type CreatePolicyFormValues = z.infer<typeof createPolicySchema>;
export type UpdatePolicyFormValues = z.infer<typeof updatePolicySchema>;
