import { z } from 'zod';

export const userFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  roles: z.array(z.string()).min(1, 'At least one role must be selected'),
});
export type UserFormValues = z.infer<typeof userFormSchema>;
