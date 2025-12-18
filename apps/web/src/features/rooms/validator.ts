import z from "zod";

export const roomFormSchema = z.object({
  code: z.string().min(1, 'Room code is required'),
  floor: z.string().optional(),
  note: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'MAINTENANCE']).optional(),
  cleanStatus: z.enum(['CLEAN', 'DIRTY', 'INSPECT']).optional(),
});

export type RoomFormValues = z.infer<typeof roomFormSchema>;