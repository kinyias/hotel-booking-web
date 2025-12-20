import { z } from 'zod';

export const commissionPackageSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  commissionRate: z
    .number()
    .min(0, 'Commission rate must be at least 0')
    .max(1, 'Commission rate must be at most 1'),
  isActive: z.boolean(),
});

export type CommissionPackageFormValues = z.infer<
  typeof commissionPackageSchema
>;
