import { Amenity } from "../amentites";

export interface RoomImage {
  image_id: string;
  roomtype_id: string;
  url: string;
}
export interface RoomType {
  id: string;
  hotelId: string;
  name: string;
  price_per_night: number;
  max_guests: number;
  description: string;
  amenities: {
    amenity: Amenity;
    amenityId: string;
    typeId: string;
  }[];
  images: RoomImage[];
}
export interface RoomTypeAvailable {
  id: string;
  hotelId: string;
  name: string;
  price_per_night: number;
  max_guests: number;
  description: string;
  amenities: {
    amenity: Amenity;
    amenityId: string;
    typeId: string;
  }[];
  images: RoomImage[];
  availableRooms: number;
}

export interface RoomTypeQueryParams {
  page?: number;
  limit?: number;
  from: string;
  to: string;
}
