'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RoomForm } from '@/features/rooms/components/RoomForm';
import { RoomFormValues } from '@/features/rooms/validator';
import { useQueryRoomById } from '@/features/rooms/queries';
import { useMutationCreateRoom, useMutationDeleteRoom, useMutationUpdateRoom } from '@/features/rooms/mutations';
import toast from 'react-hot-toast';

export default function RoomPage() {
    const params = useParams();
    const router = useRouter();

    const hotelId = params.hotel_id as string;
    const roomTypeId = params.type_id as string;
    const roomId = params.room_id as string;

    const isEditing = !!(roomId && roomId !== 'new');

    // Fetch room data when editing
    const { data: room, isLoading: isFetching } = useQueryRoomById(hotelId, roomId, isEditing);
    
    // Mutations
    const createMutation = useMutationCreateRoom(hotelId);
    const updateMutation = useMutationUpdateRoom(hotelId, roomId);
    
    const isSaving = createMutation.isPending || updateMutation.isPending;

    const initialData: RoomFormValues | undefined = room ? {
        code: room.code,
        floor: room.floor,
        note: room.note,
        status: room.status,
        cleanStatus: room.cleanStatus,
    } : undefined;
    
    const deleteMutation = useMutationDeleteRoom(hotelId);
    const handleSubmit = async (data: RoomFormValues) => {
        try {
            if (isEditing) {
                await updateMutation.mutateAsync({ 
                    roomTypeId, 
                    code: data.code,
                    floor: data.floor,
                    note: data.note,
                    status: data.status || 'ACTIVE',
                    cleanStatus: data.cleanStatus || 'CLEAN',
                });
                toast.success('Room updated successfully');
            } else {
                await createMutation.mutateAsync({ 
                    roomTypeId, 
                    ...data 
                });
                toast.success('Room created successfully');
            }
            router.push(`/admin/room-types/${hotelId}/manage/${roomTypeId}`);
        } catch (error) {
            console.error(error);
            toast.error('Failed to save room. Please try again.');
        }
    };

    if (isEditing && isFetching) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

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
                    isLoading={isSaving}
                />
            </div>
        </div>
    );
}
