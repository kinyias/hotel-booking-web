import { z } from 'zod';

export const boookingFormSchema = z.object({
    guestName: z.string().min(1, 'Guest name is required'),
    guestEmail: z.string().email('Invalid email'),
    guestPhone: z.string().min(1, 'Guest phone is required'),
    note: z.string().optional(),
    promotionCode: z.string().optional(),
});

export type BoookingFormValues = z.infer<typeof boookingFormSchema>;

export const checkInGuestSchema = z.object({
    userId: z.string().optional(),
    fullName: z.string().min(1, 'FullName is required'),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    idNumber: z.string().optional(),
    nationality: z.string().optional(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
    dateOfBirth: z.string().optional(), // Date picker might return string or Date, handle conversion in component
});

export const checkInSchema = z.object({
    note: z.string().optional(),
    primary: checkInGuestSchema,
    companions: z.array(checkInGuestSchema).optional(),
});

export type CheckInFormValues = z.infer<typeof checkInSchema>;
