import { useQuery } from "@tanstack/react-query";
import { getRoomTypeById, getRoomTypes, getRoomTypesAvailable } from "./api";
import { RoomTypeQueryParams } from "./types";

export const useQueryRoomTypes = (hotelId: string, enabled?: boolean) => {
    return useQuery({
        queryKey: ['room-types', hotelId],
        queryFn: () => getRoomTypes(hotelId),
        enabled,
    });
}

export const useQueryRoomTypesAvailable = (hotelId: string, params?: RoomTypeQueryParams, enabled?: boolean) => {
    return useQuery({
        queryKey: ['room-types-available', hotelId],
        queryFn: () => getRoomTypesAvailable(hotelId, params),
        enabled,
    });
}

export const useQueryRoomTypeById = (hotelId: string, id: string, enabled?: boolean) => {
    return useQuery({
        queryKey: ['room-type', hotelId, id],
        queryFn: () => getRoomTypeById(hotelId, id),
        enabled,
    });
}