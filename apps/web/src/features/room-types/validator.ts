import z from "zod";

export const roomTypeFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price_per_night: z.string().min(1, 'Price must be positive'),
  max_guests: z.number().min(1, 'Must have at least 1 guest'),
  description: z.string().min(1, 'Description is required'),
  amenityIds: z.array(z.string()).optional(),
  images: z.array(z.object({ id: z.string().optional(), url: z.string() })).optional(),
});

export type RoomTypeFormValues = z.infer<typeof roomTypeFormSchema>;