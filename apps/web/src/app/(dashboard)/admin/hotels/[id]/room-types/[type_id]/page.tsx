'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { RoomTypeForm } from '@/features/room-types/components/RoomTypeForm';
import { RoomTable } from '@/features/rooms/components/RoomTable';
import { 
  RoomTypeFormValues, 
  useCreateRoomTypeMutation, 
  useUpdateRoomTypeMutation, 
  useQueryRoomTypeById 
} from '@/features/room-types';
import { useQueryRooms } from '@/features/rooms/queries';
import toast from 'react-hot-toast';
import { formatNumber } from '@/utils/currency';

export default function RoomTypePage() {
  const params = useParams();
  const router = useRouter();
  
  const hotelId = params.id as string;
  const roomTypeId = params.type_id as string;
  
  const isEditing = !!roomTypeId && roomTypeId !== 'new';

  // Use enabled: isEditing to avoid fetching when creating
  const { data: roomType, isLoading: isFetching } = useQueryRoomTypeById(hotelId, roomTypeId, isEditing);
  
  // Fetch rooms for this room type
  const { data: roomsData } = useQueryRooms(hotelId, { 
    roomTypeId: isEditing ? roomTypeId : undefined 
  }, isEditing);
  
  const createMutation = useCreateRoomTypeMutation(hotelId);
  const updateMutation = useUpdateRoomTypeMutation(hotelId, roomTypeId);
  
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const initialData: RoomTypeFormValues | undefined = roomType ? {
    name: roomType.name,
    price_per_night: roomType.price_per_night.toString(),
    max_guests: roomType.max_guests,
    description: roomType.description,
    amenityIds: roomType.amenities.map((a) => a.amenity.id),
    images: roomType.images.map(img => ({ id: img.image_id, url: img.url }))
  } : undefined;
  
  // Get rooms from the fetched data
  const rooms = roomsData?.data || []; 

  const handleFormSubmit = async (data: RoomTypeFormValues) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync(data);
        toast.success("Room Type updated successfully");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Room Type created successfully");
      }
      router.push(`/admin/hotels/${hotelId}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save room type. Please try again.");
    }
  };

  if (isEditing && isFetching) {
    return (
        <div className="flex h-[50vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
    );
  }

  if (isEditing && !roomType && !isFetching) { 
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
              <h1 className="text-3xl font-bold tracking-tight">
                  {isEditing ? `Edit ${roomType?.name}` : 'Create New Room Type'}
              </h1>
          </div>
       </div>

       {/* Room Type Form */}
       <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Room Type Details</h2>
          <RoomTypeForm 
            initialData={initialData} 
            onSubmit={handleFormSubmit}
            isLoading={isSaving}
          />
       </div>

       {/* Rooms List (Only when editing) */}
       {isEditing && (
           <div className="space-y-4">
               <div className="flex items-center justify-between">
                   <h2 className="text-lg font-semibold">Rooms ({rooms.length})</h2>
                   <Link href={`/admin/hotels/${hotelId}/room-types/${roomTypeId}/room/new`}>
                       <Button>
                           <Plus className="mr-2 h-4 w-4" />
                           Add Room
                       </Button>
                   </Link>
               </div>
               <RoomTable rooms={rooms} hotelId={hotelId} roomTypeId={roomTypeId} />
           </div>
       )}
    </div>
  );
}
