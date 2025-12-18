import { z } from "zod";

export const BulkSetInventorySchema = z
  .object({
    from: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "from must be YYYY-MM-DD"),

    to: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "to must be YYYY-MM-DD"),

    roomTypeId: z.string().min(1),

    totalRooms: z
      .number()
      .int()
      .min(0)
      .optional(),

    availableRooms: z
      .number()
      .int()
      .min(0)
      .optional(),

    stopSell: z.boolean().optional(),
  })
  .refine(
    (data) => data.totalRooms === undefined || data.availableRooms === undefined
      ? true
      : data.availableRooms <= data.totalRooms,
    {
      message: "availableRooms must be <= totalRooms",
      path: ["availableRooms"],
    }
  );
export const UpdateInventorySchema = z
  .object({
    totalRooms: z
      .number()
      .int()
      .min(0)
      .optional(),

    availableRooms: z
      .number()
      .int()
      .min(0)
      .optional(),

    stopSell: z.boolean().optional(),
  })
  .refine(
    (data) =>
      data.totalRooms === undefined ||
      data.availableRooms === undefined ||
      data.availableRooms <= data.totalRooms,
    {
      message: "availableRooms must be <= totalRooms",
      path: ["availableRooms"],
    }
  );
export type UpdateInventoryFormValues = z.infer<typeof UpdateInventorySchema>;
export type BulkSetInventoryFormValues = z.infer<typeof BulkSetInventorySchema>;