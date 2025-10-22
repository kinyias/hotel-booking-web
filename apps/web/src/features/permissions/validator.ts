import { z } from 'zod';

export const permissionFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});
export type PermissionFormValues = z.infer<typeof permissionFormSchema>;
