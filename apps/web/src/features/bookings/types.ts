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
    status: string;
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
export type BookingStatus= "PENDING" | "CONFIRMED" | "CANCELLED" | "CHECKED_IN" | "NO_SHOW" | "COMPLETED";
export interface Booking{
    id: string;
    hotelId: string;
    userId: string;
    status: BookingStatus;

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
    status?: BookingStatus;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
    q?: string;
}

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface CheckInGuestDto {
    userId?: string;
    fullName: string;
    email?: string;
    phone?: string;
    idNumber?: string;
    nationality?: string;
    gender?: Gender;
    dateOfBirth?: string;
}

export interface CheckInDto {
    note?: string;
    primary: CheckInGuestDto;
    companions?: CheckInGuestDto[];
}

export interface BookingGuest {
    id: string;
    bookingId: string;
    userId?: string;
    fullName: string;
    email?: string;
    phone?: string;
    idNumber?: string;
    nationality?: string;
    gender?: Gender;
    dateOfBirth?: string;
}

export interface CheckInRecord {
    id: string;
    bookingId: string;
    checkedInBy: string;
    note?: string;
    checkedInAt: string;
}

export interface CheckInResponse {
    data: {
        checkIn: CheckInRecord | null;
        guests: BookingGuest[];
    }
}

