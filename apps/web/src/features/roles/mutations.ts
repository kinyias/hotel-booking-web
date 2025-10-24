import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignPermissionsToRole, createRole, updateRole } from "./api";
import { Role } from "./types";
import { PermissionAssignRoleFormValues, RoleFormValues } from "./validator";
export const useUpdateRoleMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RoleFormValues }) => 
      updateRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};
export const useCreateRoleMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ data }: { data: RoleFormValues }) => 
      createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};

export const useAssignPermissionToRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PermissionAssignRoleFormValues }) => 
      assignPermissionsToRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};
