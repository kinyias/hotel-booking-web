import { z } from 'zod';

export const hotelFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  description: z.string().min(1, 'Description is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  status: z.enum(['DRAFT', 'ACTIVE', 'SUSPENDED', 'ARCHIVED']),
  images: z
    .array(
      z.object({
        id: z.string().optional(),
        url: z.string().url('Must be a valid URL'),
      })
    )
    .optional(),
});

export type HotelFormValues = z.infer<typeof hotelFormSchema>;



