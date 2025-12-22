import { useMutation } from '@tanstack/react-query';
import { createContact } from './api';
import { CreateContactFormValues } from './validator';
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
