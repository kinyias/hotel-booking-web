import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRole, updateRole } from "./api";
import { Role } from "./types";
import { RoleFormValues } from "./validator";
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