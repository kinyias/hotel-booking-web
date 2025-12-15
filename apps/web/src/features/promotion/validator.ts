import { z } from 'zod';

export const promotionFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  type_id: z.string().min(1, 'Promotion type is required'),
  discount_type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
  discount_value: z.number().min(0, 'Discount value must be positive'),
  start_date: z.date({ message: 'Start date is required' }),
  end_date: z.date({ message: 'End date is required' }),
  status: z.enum(['ACTIVE', 'INACTIVE', 'DRAFT', 'EXPIRED']),
  hotel_id: z.string().min(1, "Hotel is required")
}).refine((data) => data.end_date >= data.start_date, {
  message: 'End date must be after start date',
  path: ['end_date'],
}).refine((data) => {
  if (data.discount_type === 'PERCENTAGE') {
    return data.discount_value <= 100;
  }
  return true;
}, {
  message: 'Percentage discount cannot exceed 100%',
  path: ['discount_value'],
});

export type PromotionFormValues = z.infer<typeof promotionFormSchema>;
