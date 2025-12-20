import { useQuery } from "@tanstack/react-query";
import { getRoomTypeById, getRoomTypes, getRoomTypesAvailable, listAllRoomTypes } from "./api";
import { RoomTypeQueryParams } from "./types";

export const useQueryRoomTypes = (hotelId: string, enabled?: boolean) => {
    return useQuery({
        queryKey: ['room-types', hotelId],
        queryFn: () => getRoomTypes(hotelId),
        enabled,
    });
}

export const useListAllRoomTypesQuery = (limit: number = 3) => {
  return useQuery({
    queryKey: ['room-types-all', limit],
    queryFn: () => listAllRoomTypes(limit),
  });
};

export const useQueryRoomTypesAvailable = (hotelId: string, params?: RoomTypeQueryParams, enabled?: boolean) => {
    return useQuery({
        queryKey: ['room-types-available', hotelId, params?.from, params?.to],
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