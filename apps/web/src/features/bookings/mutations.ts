import { useMutation, useQueryClient } from "@tanstack/react-query"
import { cancleBooking, createBooking, createPayment, updateBookingStatus } from "./api"
import { BookingStatus, CreateBookingDto } from "./types"

export const useCreateBookingMutation = (hotelId: string) => {
    return useMutation({
        mutationFn: (payload: CreateBookingDto)=> createBooking(hotelId, payload),
    })
}

export const useUpdateBookingStatusMutation = (hotelId: string, bookingId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: BookingStatus)=> updateBookingStatus(hotelId, bookingId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['bookings', hotelId],
            });
            queryClient.invalidateQueries({
                queryKey: ['booking', hotelId, bookingId],
            });
        },
    })
}

export const useCancelBookingMutation = (hotelId: string, bookingId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ()=> cancleBooking(hotelId, bookingId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['bookings', hotelId],
            });
        },
    })
}

export const useCreatePaymentMutation = (bookingId: string) => {
    return useMutation({
        mutationFn: ()=> createPayment(bookingId),
    })
}