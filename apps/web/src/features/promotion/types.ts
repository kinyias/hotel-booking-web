export type DiscountType = 'PERCENT' | 'FIXED';

export interface Promotion {
  id: string;
  code: string;
  name: string;
  description: string | null;
  discountType: DiscountType;
  discountValue: number;
  maxDiscountAmount: string | null;
  minBookingAmount: string | null;
  totalUsageLimit: number | null;
  usedCount: number;
  perUserLimit: number | null;
  startAt: string;
  endAt: string;
  isActive: boolean;
  hotelId: string | null;
  hotel?: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface PromotionsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  hotelId?: string;
  isActive?: boolean;
}

export interface CreatePromotionPayload {
  code: string;
  name: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscountAmount?: number;
  minBookingAmount?: number;
  totalUsageLimit?: number;
  perUserLimit?: number;
  startAt: string;
  endAt: string;
  isActive?: boolean;
  hotelId?: string;
}

export interface UpdatePromotionPayload {
  code?: string;
  name?: string;
  description?: string;
  discountType?: DiscountType;
  discountValue?: number;
  maxDiscountAmount?: number;
  minBookingAmount?: number;
  totalUsageLimit?: number;
  perUserLimit?: number;
  startAt?: string;
  endAt?: string;
  isActive?: boolean;
  hotelId?: string;
}
