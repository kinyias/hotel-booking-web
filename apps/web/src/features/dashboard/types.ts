export interface DashboardStats {
  totalUsers: number;
  totalBookings: number;
  revenue: number;
  activeHotels: number;
}

export interface RevenueChartParams {
  hotelId?: string;
  groupBy?: 'day' | 'week' | 'month';
  year?: number;
  from?: string;
  to?: string;
}

export interface LatestReview {
  id: string;
  rating: number;
  content: string;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: {
      secureUrl: string;
    } | null;
  };
}

export interface NewestBooking {
  id: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  createdAt: string;
  items: {
    roomType: {
      name: string;
    };
    quantity: number;
  }[];
}
