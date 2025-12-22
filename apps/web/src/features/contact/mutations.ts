import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createContact, updateContact } from './api';
import { CreateContactFormValues, UpdateContactFormValues } from './validator';
import { toast } from 'react-hot-toast';

export const useCreateContactMutation = () => {
  return useMutation({
    mutationFn: (data: CreateContactFormValues) => createContact(data),
    onSuccess: () => {
      toast.success('Thank you for contacting us! We will get back to you soon.');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to send message. Please try again.');
    },
  });
};

export const useUpdateContactMutation = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateContactFormValues) => updateContact(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['contact', id] });
      toast.success('Contact updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update contact');
    },
  });
};
