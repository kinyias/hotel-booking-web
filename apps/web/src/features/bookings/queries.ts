import { useQuery } from "@tanstack/react-query";
import { getBookingById, getBookings } from "./api";
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