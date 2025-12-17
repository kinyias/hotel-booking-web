import z from "zod";

export const amenityFormSchema = z.object({
    label: z.string().min(3, "Label must be at least 3 characters long"),
    key: z.string().min(1, "Key is required"),
});

export type AmenityFormSchema = z.infer<typeof amenityFormSchema>;
