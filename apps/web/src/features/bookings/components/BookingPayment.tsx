"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import PageTitle from "@/components/sections/PageTitle";
import { User } from "@/features/user/types";
import { Hotel, RoomType } from "@/features/hotels/types";
import { 
  BookingHotelCard, 
  BookingRoomList, 
  BookingGuestInfo, 
  BookingPaymentMethod, 
  BookingSummary 
} from "@/features/bookings";

// --- Mock Data Helpers ---

const MOCK_USER: User = {
  id: "u1",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  roles: [{ id: "r1", name: "USER" }],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  avatar: {
    id: "a1",
    secureUrl: "https://github.com/shadcn.png",
    publicId: "pid1"
  }
};

const MOCK_HOTEL_DATA: Hotel = {
  hotel_id: 'h1',
  owner_id: 'o1',
  name: 'Grand Luxury Hotel',
  address: '123 Main St, New York, NY',
  description: 'Experience world-class service...',
  star: 5,
  phone: '+1 234 567 890',
  status: 'ACTIVE',
  images: [
    { image_id: 'i1', hotel_id: 'h1', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80' }
  ]
};

const MOCK_ROOM_TYPES: Record<string, RoomType> = {
  'rt1': { type_id: 'rt1', hotel_id: 'h1', name: 'Standard Room', price_per_night: 3000000, max_guests: 2, description: '' },
  'rt2': { type_id: 'rt2', hotel_id: 'h1', name: 'Deluxe Room', price_per_night: 4500000, max_guests: 2, description: '' },
  'rt3': { type_id: 'rt3', hotel_id: 'h1', name: 'Executive Suite', price_per_night: 7500000, max_guests: 3, description: '' },
  'rt4': { type_id: 'rt4', hotel_id: 'h1', name: 'Family Suite', price_per_night: 9000000, max_guests: 4, description: '' },
};

// --- Component ---

export default function BookingPayment() {
  const searchParams = useSearchParams();
  const [paymentMethod, setPaymentMethod] = useState("momo");
  
  // 1. Get Params
  const booking_id = searchParams.get('booking_id') || 'BK-2024-001';
  // const user_id = searchParams.get('user_id') || MOCK_USER.id; // In real app, we'd fetch user by this ID
  // const hotel_id = searchParams.get('hotel_id') || MOCK_HOTEL_DATA.hotel_id;
  const check_in_str = searchParams.get('check_in') || new Date().toISOString();
  const check_out_str = searchParams.get('check_out') || new Date(Date.now() + 86400000).toISOString();
  const total_price = Number(searchParams.get('total_price')) || 0;
  const booking_status = searchParams.get('booking_status') || 'PENDING';
  
  // Parse Rooms (Assuming format: rooms=rt1:1,rt2:2)
  const roomsParam = searchParams.get('rooms') || '';
  const bookedRooms: { type: RoomType; quantity: number }[] = [];
  
  if (roomsParam) {
    roomsParam.split(',').forEach(item => {
       const [typeId, qty] = item.split(':');
       if (MOCK_ROOM_TYPES[typeId]) {
         bookedRooms.push({ type: MOCK_ROOM_TYPES[typeId], quantity: Number(qty) });
       }
    });
  } else {
    // Default mock rooms if no params provided
    bookedRooms.push({ type: MOCK_ROOM_TYPES['rt1'], quantity: 1 });
    bookedRooms.push({ type: MOCK_ROOM_TYPES['rt3'], quantity: 1 });
  }

  // Ensure total price is calculated if not provided or 0 (for mock display)
  const calculatedTotal = bookedRooms.reduce((acc, item) => acc + (item.type.price_per_night * item.quantity), 0);
  const finalPrice = total_price > 0 ? total_price : calculatedTotal;

  return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <PageTitle 
          title="Confirm Booking" 
          description={`Confirm your booking`}
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Booking", href: "/booking" },
          ]} 
        />

        <div className="container mx-auto px-4 -mt-10 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: Booking Details */}
            <div className="lg:col-span-2 space-y-6">
              <BookingHotelCard 
                hotel={MOCK_HOTEL_DATA}
                checkIn={check_in_str}
                checkOut={check_out_str}
              />

              <BookingRoomList rooms={bookedRooms} />

              <BookingGuestInfo user={MOCK_USER} />

              <BookingPaymentMethod 
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
              />
            </div>

            {/* RIGHT COLUMN: Price Summary */}
            <div className="lg:col-span-1">
               <BookingSummary 
                  bookedRooms={bookedRooms}
                  finalPrice={finalPrice}
                  bookingStatus={booking_status}
                  paymentMethod={paymentMethod}
               />
            </div>

          </div>
        </div>
      </div>
  );
}
