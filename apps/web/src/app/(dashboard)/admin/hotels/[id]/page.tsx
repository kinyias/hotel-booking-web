'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { HotelForm } from '@/features/hotels/components/HotelForm';
import { HotelFormValues } from '@/features/hotels/validator';
import { useHotelDetailQuery } from '@/features/hotels/queries';
import { useCreateHotelMutation, useUpdateHotelMutation } from '@/features/hotels/mutations';
export default function HotelEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isEditing = !!id && id !== 'new';
  const { data: hotel, isLoading, isError } = useHotelDetailQuery(id, isEditing);
  
  const createMutation = useCreateHotelMutation();
  const updateMutation = useUpdateHotelMutation(id);
  const isSaving = createMutation.isPending || updateMutation.isPending;

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
  

  const initialData: HotelFormValues | undefined = hotel
    ? {
        name: hotel.name,
        address: hotel.address,
        description: hotel.description,
        city: hotel.city,
        country: hotel.country,
        status: hotel.status,
        images: (hotel.images ?? []).map((img: any) => ({
          id: img.id ?? img.image_id ?? undefined,
          url: img.url,
        })),
      }
    : undefined;

  const handleSubmit = async (data: HotelFormValues) => {
    const payload = {
      ...data,
      images: (data.images ?? []).map((x) => ({ id: x.id, url: x.url })),
    };
    if (isEditing) {
      await updateMutation.mutateAsync(payload);
    } else {
      await createMutation.mutateAsync(payload);
    }
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
            isLoading={isSaving}
        />
      </div>
    </div>
  );
}
