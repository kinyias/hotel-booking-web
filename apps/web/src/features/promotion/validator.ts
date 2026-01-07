import { z } from 'zod';

export const createPromotionSchema = z.object({
  code: z.string().min(1, 'Code is required').max(50, 'Code is too long').toUpperCase(),
  name: z.string().min(1, 'Name is required').max(200, 'Name is too long'),
  description: z.string().max(1000, 'Description is too long').optional().or(z.literal('')),
  discountType: z.enum(['PERCENT', 'FIXED'] as const),
  discountValue: z.number().min(0, 'Discount value must be positive'),
  maxDiscountAmount: z.number().min(0, 'Max discount amount must be positive').optional().nullable(),
  minBookingAmount: z.number().min(0, 'Min booking amount must be positive').optional().nullable(),
  totalUsageLimit: z.number().int().min(1, 'Total usage limit must be at least 1').optional().nullable(),
  perUserLimit: z.number().int().min(1, 'Per user limit must be at least 1').optional().nullable(),
  startAt: z.string().min(1, 'Start date is required'),
  endAt: z.string().min(1, 'End date is required'),
  isActive: z.boolean().optional(),
}).refine(
  (data) => {
    if (data.discountType === 'PERCENT' && data.discountValue > 100) {
      return false;
    }
    return true;
  },
  {
    message: 'Percent discount cannot exceed 100%',
    path: ['discountValue'],
  }
).refine(
  (data) => {
    const start = new Date(data.startAt);
    const end = new Date(data.endAt);
    return end > start;
  },
  {
    message: 'End date must be after start date',
    path: ['endAt'],
  }
);

export type CreatePromotionFormValues = z.infer<typeof createPromotionSchema>;

export const updatePromotionSchema = z.object({
  code: z.string().min(1, 'Code is required').max(50, 'Code is too long').toUpperCase().optional(),
  name: z.string().min(1, 'Name is required').max(200, 'Name is too long').optional(),
  description: z.string().max(1000, 'Description is too long').optional().nullable(),
  discountType: z.enum(['PERCENT', 'FIXED'] as const).optional(),
  discountValue: z.number().min(0, 'Discount value must be positive').optional(),
  maxDiscountAmount: z.number().min(0, 'Max discount amount must be positive').optional().nullable(),
  minBookingAmount: z.number().min(0, 'Min booking amount must be positive').optional().nullable(),
  totalUsageLimit: z.number().int().min(1, 'Total usage limit must be at least 1').optional().nullable(),
  perUserLimit: z.number().int().min(1, 'Per user limit must be at least 1').optional().nullable(),
  startAt: z.string().optional(),
  endAt: z.string().optional(),
  isActive: z.boolean().optional(),
  hotelId: z.string().optional().nullable(),
}).refine(
  (data) => {
    if (data.discountType === 'PERCENT' && data.discountValue && data.discountValue > 100) {
      return false;
    }
    return true;
  },
  {
    message: 'Percent discount cannot exceed 100%',
    path: ['discountValue'],
  }
).refine(
  (data) => {
    if (data.startAt && data.endAt) {
      const start = new Date(data.startAt);
      const end = new Date(data.endAt);
      return end > start;
    }
    return true;
  },
  {
    message: 'End date must be after start date',
    path: ['endAt'],
  }
);

export type UpdatePromotionFormValues = z.infer<typeof updatePromotionSchema>;
