import { z } from 'zod';

export const createContactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(120, 'Name is too long'),
  email: z.string().email('Invalid email address').max(200, 'Email is too long').optional().or(z.literal('')),
  phone: z.string().max(20, 'Phone number is too long').optional().or(z.literal('')),
  subject: z.string().max(200, 'Subject is too long').optional().or(z.literal('')),
  message: z.string().min(1, 'Message is required').max(5000, 'Message is too long'),
}).refine(
  (data) => data.email || data.phone,
  {
    message: 'Please provide either email or phone number',
    path: ['email'],
  }
);

export type CreateContactFormValues = z.infer<typeof createContactSchema>;

export const updateContactSchema = z.object({
  status: z.enum(['NEW', 'IN_PROGRESS', 'RESOLVED', 'SPAM']).optional(),
  handledById: z.string().optional().nullable(),
  note: z.string().max(2000, 'Note is too long').optional().nullable(),
});

export type UpdateContactFormValues = z.infer<typeof updateContactSchema>;
