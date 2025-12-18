import api from "@/lib/axios";
import { CreateRoomFormValues, Room, RoomQueryParams, UpdateRoomFormValues } from "./types";
import { PaginatedResponse } from "@/types";
import { API_ENDPOINTS } from "@/constants";

export const getRooms = async (hotelId: string, params?: RoomQueryParams) => {
    const response = await api.get<PaginatedResponse<Room>>(`${API_ENDPOINTS.HOTEL.HOTELS}/${hotelId}/rooms`, { params });
    return response.data;
}

export const getRoomById = async (hotelId: string, roomId: string) => {
    const response = await api.get<Room>(`${API_ENDPOINTS.HOTEL.HOTELS}/${hotelId}/rooms/${roomId}`);
    return response.data;
}

export const createRoom = async (hotelId: string, payload: CreateRoomFormValues) => {
    const response = await api.post<Room>(`${API_ENDPOINTS.HOTEL.HOTELS}/${hotelId}/rooms`, payload);
    return response.data;
}

export const updateRoom = async (hotelId: string, roomId: string, payload: UpdateRoomFormValues) => {
    const response = await api.patch<Room>(`${API_ENDPOINTS.HOTEL.HOTELS}/${hotelId}/rooms/${roomId}`, payload);
    return response.data;
}
export const deleteRoom = async (hotelId: string, roomId: string) => {
    const response = await api.delete<Room>(`${API_ENDPOINTS.HOTEL.HOTELS}/${hotelId}/rooms/${roomId}`);
    return response.data;
}