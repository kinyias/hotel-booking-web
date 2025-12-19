import { useQuery } from "@tanstack/react-query";
import { getBookings } from "./api";

export const useBookingsQuery = (hotelId: string, params?: any, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['bookings', hotelId, params],
        queryFn: () => getBookings(hotelId, params),
        enabled: !!hotelId && enabled,
    });
}
