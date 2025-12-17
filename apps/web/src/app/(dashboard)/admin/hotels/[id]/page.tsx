'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { HotelForm } from '@/features/hotels/components/HotelForm';
import { RoomTypeTable } from '@/features/hotels/components/RoomTypeTable';
import { HotelFormValues } from '@/features/hotels/validator';
import { useHotelDetailQuery } from '@/features/hotels/queries';
import Link from 'next/link';

export default function HotelEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isEditing = id && id !== 'new';

  const { data: hotel, isLoading, isError } = useHotelDetailQuery(id);

  if (isLoading && isEditing) {
     return <div className="p-6">Loading...</div>;
  }

  if (isEditing && isError) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-500">Error loading hotel</h1>
        <Button onClick={() => router.push('/admin/hotels')} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }
  
  // Note: Room types are not yet fetched from API.
  const roomTypes: any[] = [];

  const initialData: HotelFormValues | undefined = hotel
    ? {
        name: hotel.name,
        address: hotel.address,
        description: hotel.description,
        city: hotel.city,
        country: hotel.country,
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
          {isEditing ? 'Edit Hotel' : 'Create Hotel'}
        </h1>
      </div>

      {/* Hotel Form */}
      <div className="bg-card rounded-lg border p-6 shadow-sm w-full">
        <h2 className="text-lg font-semibold mb-4">Hotel Details</h2>
        <HotelForm 
            initialData={initialData} 
            onSubmit={handleSubmit} 
            isLoading={false} // Add proper loading state for Mutation later
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
