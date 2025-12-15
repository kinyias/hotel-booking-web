export interface HotelImage {
  image_id: string;
  hotel_id: string;
  url: string;
}

export type HotelStatus = 'ACTIVE' | 'INACTIVE';

export interface Hotel {
  hotel_id: string;
  owner_id: string;
  name: string;
  address: string;
  description: string;
  star: number;
  phone: string;
  status: HotelStatus;
  images: HotelImage[];
}

export interface HotelsQueryParams {
  limit?: number;
  offset?: number;
  q?: string;
  status?: HotelStatus | 'all';
}

export interface RoomType {
  type_id: string;
  hotel_id: string;
  name: string;
  price_per_night: number;
  max_guests: number;
  description: string;
}

export interface RoomImage {
  image_id: string;
  room_id: string;
  url: string;
}

export type RoomStatus = 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE';

export interface Room {
  room_id: string;
  type_id: string;
  room_number: string;
  floor: number;
  status: RoomStatus;
  images: RoomImage[];
}
