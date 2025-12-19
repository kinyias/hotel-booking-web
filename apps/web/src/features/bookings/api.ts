import { API_ENDPOINTS } from "@/constants";
import api from "@/lib/axios";
import { PaginatedResponse } from "@/types";
import { Booking, BookingQueryParams, BookingStatus, CreateBookingDto, Payment } from "./types";

export const createBooking = async (hotelId:string, payload: CreateBookingDto) => {
    const response = await api.post<Booking>(`${API_ENDPOINTS.HOTEL.HOTELS}/${hotelId}/bookings`, payload);
  return response.data;
}

export const getBookings = async (hotelId: string, params?: BookingQueryParams) => {
  const response = await api.get<PaginatedResponse<Booking>>(`${API_ENDPOINTS.HOTEL.HOTELS}/${hotelId}/bookings`, { params });
  return response.data;
}

export const getBookingById = async (hotelId: string, bookingId: string) => {
    const response = await api.get<Booking>(`${API_ENDPOINTS.HOTEL.HOTELS}/${hotelId}/bookings/${bookingId}`);
    return response.data;
}

export const getMyBookings = async (params?: BookingQueryParams) => {
    const response = await api.get<PaginatedResponse<Booking>>(`${API_ENDPOINTS.BOOKING.BOOKINGS}/me`, { params });
    return response.data;
}

export const getMyBookingById = async (bookingId: string) => {
    const response = await api.get<Booking>(`${API_ENDPOINTS.BOOKING.BOOKINGS}/me/${bookingId}`);
    return response.data;
}

export const updateBookingStatus= async (hotelId: string, bookingId: string, payload: BookingStatus) => {
    const response = await api.patch<Booking>(`${API_ENDPOINTS.HOTEL.HOTELS}/${hotelId}/bookings/${bookingId}/status`, {status: payload});
    return response.data;
}

export const cancleBooking= async (hotelId: string, bookingId: string) => {
    const response = await api.patch<Booking>(`${API_ENDPOINTS.HOTEL.HOTELS}/${hotelId}/bookings/${bookingId}/cancel`);
    return response.data;
}

export const createPayment = async(bookingId: string)=>{
    const response = await api.post<Payment>(`${API_ENDPOINTS.BOOKING.BOOKINGS}/${bookingId}/payments/vnpay`, {locale: 'vn', bankCode: 'NCB'});
    return response.data;
}