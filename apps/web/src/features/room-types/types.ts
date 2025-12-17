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
  amenities: string[];
  images: RoomImage[];
}
