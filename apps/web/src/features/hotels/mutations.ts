import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HotelFormValues } from "./validator";
import { createHotel, updateHotel } from "./api";

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