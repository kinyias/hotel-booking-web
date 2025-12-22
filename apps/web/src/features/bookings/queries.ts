import { useQuery } from "@tanstack/react-query";
import { getBookingById, getBookings, getMyBookings, getMyBookingById } from "./api";
import { BookingQueryParams } from "./types";

export const useBookingsQuery = (hotelId: string, params?: BookingQueryParams, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['bookings', hotelId, params],
        queryFn: () => getBookings(hotelId, params),
        enabled: !!hotelId && enabled,
    });
}

export const useBookingByIdQuery = (hotelId: string, bookingId: string) => {
    return useQuery({
        queryKey: ['booking', hotelId, bookingId],
        queryFn: () => getBookingById(hotelId, bookingId),
    });
}

export const useMyBookingsQuery = (params?: BookingQueryParams) => {
    return useQuery({
        queryKey: ['my-bookings', params],
        queryFn: () => getMyBookings(params),
    });
}

export const useMyBookingByIdQuery = (bookingId: string) => {
    return useQuery({
        queryKey: ['my-booking', bookingId],
        queryFn: () => getMyBookingById(bookingId),
        enabled: !!bookingId,
    });
}

export const useCheckInQuery = (bookingId: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['booking-check-in', bookingId],
        queryFn: () => import("./api").then(mod => mod.getCheckIn(bookingId)),
        enabled: !!bookingId && enabled,
    });
}

