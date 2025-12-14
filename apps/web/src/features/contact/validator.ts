import z from "zod";

export const contactFormSchema = z.object({
  hotel_id: z.string().min(1, {
    message: 'Hotel ID is required.',
  }),
  type: z.enum(['feedback', 'complaint', 'inquiry', 'other'], {
    message: 'Please select a feedback type.',
  }),
  content: z.string().min(10, {
    message: 'Content must be at least 10 characters.',
  }),
});