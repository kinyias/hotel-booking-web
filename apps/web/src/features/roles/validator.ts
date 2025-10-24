import { z } from 'zod';

export const roleFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});
export const permissionAssignRoleFormSchema = z.object({
  roleId: z.string().min(1, 'Role is required'),
  permissionIds: z.array(z.string()).min(1, 'At least one permission is required'),
});
export type PermissionAssignRoleFormValues = z.infer<typeof permissionAssignRoleFormSchema>;
export type RoleFormValues = z.infer<typeof roleFormSchema>;
