import { z } from 'zod';

export const boookingFormSchema = z.object({
    guestName: z.string().min(1, 'Guest name is required'),
    guestEmail: z.string().email('Invalid email'),
    guestPhone: z.string().min(1, 'Guest phone is required'),
    note: z.string().optional(),
});

export type BoookingFormValues = z.infer<typeof boookingFormSchema>;