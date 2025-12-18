import { useQuery } from "@tanstack/react-query";
import { getRoomById, getRooms } from "./api";
import { RoomQueryParams } from "./types";

export const useQueryRooms = (hotelId: string, params?: RoomQueryParams, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['rooms', hotelId, params],
        queryFn: () => getRooms(hotelId, params),
        enabled,
    });
}

export const useQueryRoomById = (hotelId: string, roomId: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['room', roomId],
        queryFn: () => getRoomById(hotelId, roomId),
        enabled,
    });
}