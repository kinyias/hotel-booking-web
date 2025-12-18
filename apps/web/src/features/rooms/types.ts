export type RoomStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
export type RoomCleanStatus = 'DIRTY' | 'CLEAN' | 'INSPECT';
export interface Room {
    id: string;
    hotelId: string;
    roomTypeId: string;
    code: string;          // ví dụ: "101", "A-1203"
    floor?: string;
    note?: string;
    status: RoomStatus;
    cleanStatus: RoomCleanStatus;
}

export interface CreateRoomFormValues {
    roomTypeId: string;
    code: string;
    floor?: string;
    note?: string;
    status?: RoomStatus;
    cleanStatus?: RoomCleanStatus;
}

export interface UpdateRoomFormValues {
    roomTypeId: string;
    code: string;
    floor?: string;
    note?: string;
    status: RoomStatus;
    cleanStatus: RoomCleanStatus;
}

export interface RoomQueryParams {
   page?: number;
   limit?: number;
   q?: string;
   roomTypeId?: string;
}