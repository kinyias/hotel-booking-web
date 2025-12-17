export interface HotelImage {
  image_id: string;
  hotel_id: string;
  url: string;
}
export interface HotelOwner {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}
export type HotelStatus = 'DRAFT' | 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED';

export interface Hotel {
  id: string;
  owner_id: string;
  name: string;
  address: string;
  description: string;
  city: string;
  country: string;
  status: HotelStatus;
  images: HotelImage[];
  owner: HotelOwner;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface HotelsQueryParams {
  limit?: number;
  offset?: number;
  q?: string;
  status?: HotelStatus | 'all';
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
