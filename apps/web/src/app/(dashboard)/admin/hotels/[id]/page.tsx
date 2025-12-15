'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { HotelForm } from '@/features/hotels/components/HotelForm';
import { RoomTypeTable } from '@/features/hotels/components/RoomTypeTable';
import { HotelFormValues } from '@/features/hotels/validator';
import { Hotel, RoomType } from '@/features/hotels/types';
import Link from 'next/link';

// Mock Hotels (Duplicated from list page for standalone demo)
const MOCK_HOTELS: Hotel[] = [
  {
    hotel_id: '1',
    owner_id: 'owner1',
    name: 'Grand Plaza Hotel',
    address: '123 Market St, San Francisco, CA',
    description: 'Luxury accommodation in the heart of the city.',
    star: 5,
    phone: '+1 415-555-0100',
    status: 'ACTIVE',
    images: [],
  },
  {
    hotel_id: '2',
    owner_id: 'owner2',
    name: 'Sunset Resort',
    address: '456 Beach Blvd, Miami, FL',
    description: 'Beautiful ocean views and relaxing atmosphere.',
    star: 4,
    phone: '+1 305-555-0102',
    status: 'ACTIVE',
    images: [],
  },
];

const MOCK_ROOM_TYPES: RoomType[] = [
    {
        type_id: 'rt1',
        hotel_id: '1',
        name: 'Deluxe King',
        price_per_night: 250,
        max_guests: 2,
        description: 'Spacious room with king bed and city view'
    },
    {
        type_id: 'rt2',
        hotel_id: '1',
        name: 'Double Queen',
        price_per_night: 300,
        max_guests: 4,
        description: 'Two queen beds, perfect for families'
    },
    {
        type_id: 'rt3',
        hotel_id: '2',
        name: 'Ocean View Suite',
        price_per_night: 500,
        max_guests: 3,
        description: 'Suite with balcony overlooking the ocean'
    }
];

export default function HotelEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isEditing = id && id !== 'new';

  const hotel = isEditing ? MOCK_HOTELS.find((h) => h.hotel_id === id) : undefined;
  // Filter room types for this hotel
  const roomTypes = isEditing ? MOCK_ROOM_TYPES.filter(rt => rt.hotel_id === id) : [];

  if (isEditing && !hotel) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-500">Hotel not found</h1>
        <Button onClick={() => router.push('/admin/hotels')} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const initialData: HotelFormValues | undefined = hotel
    ? {
        name: hotel.name,
        address: hotel.address,
        description: hotel.description,
        star: hotel.star,
        phone: hotel.phone,
        status: hotel.status,
      }
    : undefined;

  const handleSubmit = async (data: HotelFormValues) => {
    // Simulate API call
    console.log('Submitting hotel data:', data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Redirect back to list
    router.push('/admin/hotels');
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          {isEditing ? 'Edit Hotel' : 'Create Hotel'}
        </h1>
      </div>

      {/* Hotel Form */}
      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Hotel Details</h2>
        <HotelForm 
            initialData={initialData} 
            onSubmit={handleSubmit} 
        />
      </div>

      {/* Room Types Section - Only Show when Editing */}
      {isEditing && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Room Types</h2>
                <Link href={`/admin/hotels/${id}/room-types/new`}>
                <Button size="sm" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Room Type
                </Button>
                </Link>
            </div>
            <RoomTypeTable roomTypes={roomTypes} />
          </div>
      )}
    </div>
  );
}
