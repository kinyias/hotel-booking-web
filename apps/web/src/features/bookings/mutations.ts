import { useMutation } from "@tanstack/react-query"
import { createBooking } from "./api"
import { CreateBookingDto } from "./types"

export const useCreateBookingMutation = (hotelId: string) => {
    return useMutation({
        mutationFn: (payload: CreateBookingDto)=> createBooking(hotelId, payload),
    })
}