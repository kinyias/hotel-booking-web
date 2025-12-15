'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { RoomTypeForm } from '@/features/hotels/components/RoomTypeForm';
import { RoomTable } from '@/features/hotels/components/RoomTable';
import { RoomTypeFormValues } from '@/features/hotels/validator';
import { Room, RoomType } from '@/features/hotels/types';

// Mock Data
const MOCK_ROOM_TYPES: RoomType[] = [
  {
    type_id: 'rt1',
    hotel_id: '1',
    name: 'Standard Room',
    price_per_night: 100,
    max_guests: 2,
    description: 'A cozy standard room with all basic amenities.',
  },
  {
    type_id: 'rt2',
    hotel_id: '1',
    name: 'Deluxe Suite',
    price_per_night: 250,
    max_guests: 4,
    description: 'Spacious suite with a view and extra amenities.',
  },
];

const MOCK_ROOMS: Room[] = [
  {
    room_id: 'r1',
    type_id: 'rt1',
    room_number: '101',
    floor: 1,
    status: 'AVAILABLE',
    images: [],
  },
  {
    room_id: 'r2',
    type_id: 'rt1',
    room_number: '102',
    floor: 1,
    status: 'BOOKED',
    images: [],
  },
  {
    room_id: 'r3',
    type_id: 'rt2',
    room_number: '201',
    floor: 2,
    status: 'AVAILABLE',
    images: [],
  },
  {
    room_id: 'r4',
    type_id: 'rt1',
    room_number: '103',
    floor: 1,
    status: 'MAINTENANCE',
    images: [],
  },
];

export default function RoomTypePage() {
  const params = useParams();
  const router = useRouter();
  
  const hotelId = params.id;
  const roomTypeId = params.type_id;
  
  const isEditing = roomTypeId && roomTypeId !== 'new';

  // Find data
  const roomType = isEditing ? MOCK_ROOM_TYPES.find(rt => rt.type_id === roomTypeId) : undefined;
  const rooms = isEditing ? MOCK_ROOMS.filter(r => r.type_id === roomTypeId) : [];

  const handleFormSubmit = async (data: RoomTypeFormValues) => {
    console.log('Submitting room type data:', data);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // In a real app, we would redirect or toast success
    router.push(`/admin/hotels/${hotelId}`); // Go back to hotel details
  };

  if (isEditing && !roomType) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
           <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
           </Button>
           <h1 className="text-2xl font-bold text-destructive">Room Type Not Found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
       {/* Header */}
       <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/hotels/${hotelId}`)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Hotel
             </Button>
          </div>
          <div className="flex items-center justify-between">
          
          </div>
       </div>

       {/* Room Type Form */}
       <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Room Type Details</h2>
          <RoomTypeForm 
            initialData={roomType} 
            onSubmit={handleFormSubmit}
          />
       </div>

       {/* Rooms List (Only when editing) */}
       {isEditing && (
           <div className="space-y-4">
               <div className="flex items-center justify-between">
                   <h2 className="text-lg font-semibold">Rooms ({rooms.length})</h2>
                   <Button>
                       <Plus className="mr-2 h-4 w-4" />
                       Add Room
                   </Button>
               </div>
               <RoomTable rooms={rooms} />
           </div>
       )}
    </div>
  );
}