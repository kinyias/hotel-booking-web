import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BulkSetInventoryFormValues, UpdateInventoryFormValues } from "./validator";
import { createInventory, updateInventory } from "./api";

export const useCreateInventoryMutation = (hotelId: string) => {
     const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: BulkSetInventoryFormValues) => createInventory(hotelId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventory', hotelId] });
        },
    });
}

export const useUpdateInventoryMutation = (hotelId: string)=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateInventoryFormValues }) => updateInventory(hotelId, id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventory', hotelId] });
        },
    });
}