import { z } from 'zod';

export const roleFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});
export type RoleFormValues = z.infer<typeof roleFormSchema>;
