import api from "@/lib/axios";
import { PaginatedResponse } from "@/types";
import { RoomType, RoomTypeAvailable, RoomTypeQueryParams } from "./types";
import { RoomTypeFormValues } from "./validator";


export const getRoomTypes = async (hotelId: string) => {
    const response = await api.get<PaginatedResponse<RoomType>>(`/hotels/${hotelId}/room-types`);
    return response.data;
}

export const listAllRoomTypes = async (limit: number) => {
    const response = await api.get<PaginatedResponse<RoomType>>(`/room-types`, { params: { limit } });
    return response.data;
}

export const getRoomTypesAvailable = async (hotelId: string, params?: RoomTypeQueryParams) => {
    const response = await api.get<PaginatedResponse<RoomTypeAvailable>>(`/hotels/${hotelId}/room-types/available`, { params });
    return response.data;
}

export const getRoomTypeById = async (hotelId: string, id: string) => {
    const response = await api.get<RoomType>(`/hotels/${hotelId}/room-types/${id}`);
    return response.data;
}

export const createRoomType = async (hotelId: string, payload: RoomTypeFormValues) => {
    const response = await api.post<RoomType>(`/hotels/${hotelId}/room-types`, payload);
    return response.data;
}

export const updateRoomType = async (hotelId: string, id: string, payload: RoomTypeFormValues) => {
    const response = await api.patch<RoomType>(`/hotels/${hotelId}/room-types/${id}`, payload);
    return response.data;
}

export const deleteRoomType = async (hotelId: string, id: string) => {
    const response = await api.delete<void>(`/hotels/${hotelId}/room-types/${id}`);
    return response.data;
}