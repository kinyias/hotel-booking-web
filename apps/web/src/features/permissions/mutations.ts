import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPermission, updatePermission, deletePermission } from "./api";
import { Permission } from "./types";
import { PermissionFormValues } from "./validator";

export const useUpdatePermissionMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PermissionFormValues }) => 
      updatePermission(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
  });
};

export const useCreatePermissionMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ data }: { data: PermissionFormValues }) => 
      createPermission(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
  });
};

export const useDeletePermissionMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deletePermission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
  });
};