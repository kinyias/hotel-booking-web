import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RoomTypeFormValues } from "./validator";
import { createRoomType, deleteRoomType, updateRoomType } from "./api";

export const useCreateRoomTypeMutation = (hotelId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: RoomTypeFormValues) => createRoomType(hotelId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['room-types', hotelId] });
        },
    });
}

export const useUpdateRoomTypeMutation = (hotelId: string, id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: RoomTypeFormValues) => updateRoomType(hotelId, id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['room-types', hotelId] });
            queryClient.invalidateQueries({ queryKey: ['room-type', hotelId, id] });
        },
    });
}

export const useDeleteRoomTypeMutation = (hotelId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteRoomType(hotelId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['room-types', hotelId] });
        },
    });
}