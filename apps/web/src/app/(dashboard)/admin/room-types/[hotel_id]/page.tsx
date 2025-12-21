'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { RoomTypeTable } from '@/features/room-types/components/RoomTypeTable';
import { useQueryRoomTypes } from '@/features/room-types/queries';
import Link from 'next/link';

export default function RoomTypePage() {
  const params = useParams();
  const router = useRouter();
  const hotelId = params.hotel_id as string;
  const { data: roomTypesData, isLoading, isError } = useQueryRoomTypes(hotelId);
  const roomTypes = roomTypesData?.data ?? [];

  if (isLoading) {
     return <div className="p-6">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-500">Error loading room types</h1>
        <Button onClick={() => router.push('/admin/hotels')} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-8 flex-col">
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
            Room Types management
        </h1>
      </div>

      {/* Room Types Section - Only Show when Editing */}
          <div className="space-y-4 w-full">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Room Types</h2>
                <Link href={`/admin/room-types/${hotelId}/manage/new`}>
                <Button size="sm" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Room Type
                </Button>
                </Link>
            </div>
            <RoomTypeTable roomTypes={roomTypes} hotelId={hotelId} />
          </div>
    </div>
  );
}
