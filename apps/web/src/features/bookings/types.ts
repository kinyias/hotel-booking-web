export interface BookingItem{
    id: string;
    bookingId: string;
    roomTypeId: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    roomType?: {
        id: string;
        name: string;
    };
}
export interface Payment{
    id: string;
    bookingId: string;
    amount: number;
    method: string;
    createdAt: string;
    updatedAt: string;
}
export interface CreateBookingItemDto{
    roomTypeId: string;
    quantity: number;
}
export interface CreateBookingDto{
    hotelId: string;
    checkIn: string;
    checkOut: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    totalAmount: number;
    note: string;
    items: CreateBookingItemDto[];
}
export type BoookingStatus= "PENDING" | "CONFIRMED" | "CANCELLED" | "CHECK_IN" | "NO_SHOW" | "COMPLETED";
export interface Booking{
    id: string;
    hotelId: string;
    userId: string;
    status: BoookingStatus;

    checkIn: string;
    checkOut: string;

    guestName: string;
    guestEmail: string;
    guestPhone: string;

    totalAmount: number;
    note: string;

    createdAt: string;
    updatedAt: string;

    items: BookingItem[];
    payments: Payment[];
}

export interface BookingQueryParams {
    status?: BoookingStatus;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
}