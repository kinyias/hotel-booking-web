import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HotelFormValues } from "./validator";
import { addMembersToHotel, createHotel, deleteHotel, removeMemberFromHotel, updateHotel } from "./api";

export const useCreateHotelMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: HotelFormValues) => createHotel(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hotels'] });
        },
    });
};

export const useUpdateHotelMutation = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: HotelFormValues) => updateHotel(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hotels'] });
            queryClient.invalidateQueries({ queryKey: ['hotel', id] });
        },
    });
};

export const useDeleteHotelMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id:string) => deleteHotel(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hotels'] });
        },
    });
};

export const useAddMembersToHotelMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { hotelId: string; userIds: string[] }) => addMembersToHotel(data.hotelId, data.userIds),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['hotels'] });
            queryClient.invalidateQueries({ queryKey: ['hotel-members', variables.hotelId] });
            queryClient.invalidateQueries({ queryKey: ['hotel', variables.hotelId] });
        },
    });
};

export const useRemoveMemberFromHotelMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { hotelId: string; userId: string }) => removeMemberFromHotel(data.hotelId, data.userId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['hotel-members', variables.hotelId] });
            queryClient.invalidateQueries({ queryKey: ['hotel', variables.hotelId] });
        },
    });
};
