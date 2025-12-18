export interface Inventory{
    id: string;
    hotelId: string;
    roomTypeId: string;
    date: string;
    totalRooms: number;
    availableRooms: number;
    stopSell: boolean;
}

export interface InventoryQueryParams{
    from: string;
    to: string;
    roomTypeId?: string;
    includeStopped?: boolean;
}