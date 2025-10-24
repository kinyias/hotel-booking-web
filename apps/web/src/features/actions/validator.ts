import { z } from 'zod';
export const permissionAssignActionFormSchema = z.object({
  permissionIds: z.array(z.string()).min(1, 'At least one permission is required'),
});
export type PermissionAssignActionFormValues = z.infer<typeof permissionAssignActionFormSchema>;
