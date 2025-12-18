import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRoom, deleteRoom, updateRoom } from "./api";
import { CreateRoomFormValues, UpdateRoomFormValues } from "./types";

export const useMutationCreateRoom = (hotelId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateRoomFormValues) => createRoom(hotelId, payload),
         onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms', hotelId] });
        },
    });
}

export const useMutationUpdateRoom = (hotelId: string, roomId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: UpdateRoomFormValues) => updateRoom(hotelId, roomId, payload),
         onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms', hotelId] });
            queryClient.invalidateQueries({ queryKey: ['room', hotelId, roomId] });
        },
    });
}

export const useMutationDeleteRoom = (hotelId: string) =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (roomId: string) => deleteRoom(hotelId, roomId),
         onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms', hotelId] });
        },
    });
}