import { CommissionPackage } from '../commissions/types';

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

export interface HotelMember {
  id: string;
  hotelId: string;
  userId: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

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
  commissionPackageId?: string;
  commissionPackage?: CommissionPackage;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
export interface HotelPublic extends Hotel {
  minPrice: number;
}
export interface HotelsQueryParams {
  limit?: number;
  offset?: number;
  q?: string;
  status?: HotelStatus | 'all';
  page?: number;
  minPrice?: number;
  maxPrice?: number;
  checkIn?: string; // ISO date string
  checkOut?: string; // ISO date string
  city?: string;
  sortBy?: 'recommended' | 'price_asc' | 'price_desc';
}

