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

export const roomTypeFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price_per_night: z.number().min(0, 'Price must be positive'),
  max_guests: z.number().min(1, 'Must have at least 1 guest'),
  description: z.string().min(1, 'Description is required'),
});

export type RoomTypeFormValues = z.infer<typeof roomTypeFormSchema>;

export const roomFormSchema = z.object({
  room_number: z.string().min(1, 'Room number is required'),
  floor: z.number().int().min(0, 'Floor must be a positive integer'),
  status: z.enum(['AVAILABLE', 'BOOKED', 'MAINTENANCE']),
  // Simple validation for list of image URLs for this demo
  images: z
    .array(
      z.object({
        url: z.string().url('Must be a valid URL'),
      })
    )
    .optional(),
});

export type RoomFormValues = z.infer<typeof roomFormSchema>;
