import { z } from 'zod';

export const hotelFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  description: z.string().min(1, 'Description is required'),
  star: z.number().min(1).max(5),
  phone: z.string().min(1, 'Phone is required'),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

export type HotelFormValues = z.infer<typeof hotelFormSchema>;

export const roomTypeFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price_per_night: z.number().min(0, 'Price must be positive'),
  max_guests: z.number().min(1, 'Must have at least 1 guest'),
  description: z.string().min(1, 'Description is required'),
});

export type RoomTypeFormValues = z.infer<typeof roomTypeFormSchema>;
