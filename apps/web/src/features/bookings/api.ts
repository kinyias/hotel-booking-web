import { API_ENDPOINTS } from "@/constants";
import api from "@/lib/axios";
import { PaginatedResponse } from "@/types";
import { Booking, CreateBookingDto } from "./types";

export const createBooking = async (hotelId:string, payload: CreateBookingDto) => {
    const response = await api.post<Booking>(`${API_ENDPOINTS.HOTEL.HOTELS}/${hotelId}/bookings`, payload);
  return response.data;
}

export const getBookings = async (hotelId: string, params?: any) => {
  const response = await api.get<PaginatedResponse<Booking>>(`${API_ENDPOINTS.HOTEL.HOTELS}/${hotelId}/bookings`, { params });
  return response.data;
}

export const getBookingById = async (hotelId: string, bookingId: string) => {
    const response = await api.get<Booking>(`${API_ENDPOINTS.HOTEL.HOTELS}/${hotelId}/bookings/${bookingId}`);
    return response.data;
}