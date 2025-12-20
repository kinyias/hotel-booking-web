export interface ReviewUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  avatar?: {
    id: string;
    secureUrl: string;
    publicId: string;
  };
}

export interface ReviewImage {
  id: string;
  reviewId: string;
  url: string;
}

export interface Review {
  id: string;
  hotelId: string;
  userId: string;
  bookingId: string;
  rating: number;
  title: string | null;
  content: string | null;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
  user?: ReviewUser;
  images?: ReviewImage[];
}

export interface CreateReviewInput {
  bookingId: string;
  rating: number;
  title?: string;
  content?: string;
  imageIds?: string[];
}

export interface ListReviewsParams {
  page?: number;
  limit?: number;
  q?: string;
}

export interface ListReviewsResponse {
  items: Review[];
  total: number;
  page: number;
  limit: number;
}
