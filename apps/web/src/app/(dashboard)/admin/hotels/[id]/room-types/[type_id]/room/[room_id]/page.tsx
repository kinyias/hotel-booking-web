'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RoomForm } from '@/features/hotels/components/RoomForm';
import { RoomFormValues } from '@/features/hotels/validator';
import { Room } from '@/features/hotels/types';

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

export default function RoomPage() {
    const params = useParams();
    const router = useRouter();

    const hotelId = params.id as string;
    const roomTypeId = params.type_id as string;
    const roomId = params.room_id as string;

    const isEditing = roomId && roomId !== 'new';

    const room = isEditing ? MOCK_ROOMS.find(r => r.room_id === roomId) : undefined;

    const initialData: RoomFormValues | undefined = room ? {
        room_number: room.room_number,
        floor: room.floor,
        status: room.status,
        images: room.images.map(img => ({ url: img.url })),
    } : undefined;
    
    const handleSubmit = async (data: RoomFormValues) => {
        console.log('Submitting room data:', data);
        await new Promise(resolve => setTimeout(resolve, 1000));
        router.push(`/admin/hotels/${hotelId}/room-types/${roomTypeId}`);
    };

    if (isEditing && !room) {
        return (
             <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                   <Button variant="ghost" onClick={() => router.back()}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                   </Button>
                   <h1 className="text-2xl font-bold text-destructive">Room Not Found</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-4">
                 <div className="flex items-center gap-4">
                     <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/hotels/${hotelId}/room-types/${roomTypeId}`)}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Room Type
                     </Button>
                 </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
                <RoomForm 
                    initialData={initialData}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
}
