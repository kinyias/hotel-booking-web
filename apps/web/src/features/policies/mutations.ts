import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPolicy, updatePolicy, deletePolicy } from './api';
import { CreatePolicyPayload, UpdatePolicyPayload } from './types';
import toast from 'react-hot-toast';

export const useCreatePolicyMutation = (hotelId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePolicyPayload) => createPolicy(hotelId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies', hotelId] });
      toast.success('Policy created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create policy');
    },
  });
};

export const useUpdatePolicyMutation = (hotelId: string, policyId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdatePolicyPayload) => updatePolicy(hotelId, policyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies', hotelId] });
      queryClient.invalidateQueries({ queryKey: ['policy', hotelId, policyId] });
      toast.success('Policy updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update policy');
    },
  });
};

export const useDeletePolicyMutation = (hotelId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (policyId: string) => deletePolicy(hotelId, policyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies', hotelId] });
      toast.success('Policy deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete policy');
    },
  });
};
