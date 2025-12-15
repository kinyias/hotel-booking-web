'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { PromotionTypeForm } from '@/features/promotion/components/PromotionTypeForm';
import { PromotionTypeFormValues } from '@/features/promotion/validator';
import { PromotionType } from '@/features/promotion/types';

// Mock Data - Duplicate from list page for now
const MOCK_PROMOTION_TYPES: PromotionType[] = [
  { id: 't1', name: 'Seasonal', description: 'Seasonal promotions', status: 'ACTIVE' },
  { id: 't2', name: 'Flash Deal', description: 'Limited time offers', status: 'ACTIVE' },
  { id: 't3', name: 'New Year', description: 'New Year specials', status: 'INACTIVE' },
  { id: 't4', name: 'Early Bird', description: 'Advance booking discounts', status: 'ACTIVE' },
];

export default function PromotionTypeEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isEditing = id && id !== 'new';

  const promotionType = isEditing ? MOCK_PROMOTION_TYPES.find((p) => p.id === id) : undefined;

  if (isEditing && !promotionType) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-500">Promotion Type not found</h1>
        <Button onClick={() => router.push('/admin/promotions/types')} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const initialData: PromotionTypeFormValues | undefined = promotionType
    ? {
        name: promotionType.name,
        description: promotionType.description || '',
        status: promotionType.status || 'ACTIVE',
      }
    : undefined;

  const handleSubmit = async (data: PromotionTypeFormValues) => {
    // Simulate API call
    console.log('Submitting promotion type data:', data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Redirect back to list
    router.push('/admin/promotions/types');
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          {isEditing ? 'Edit Promotion Type' : 'Create Promotion Type'}
        </h1>
      </div>

      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <PromotionTypeForm
            initialData={initialData} 
            onSubmit={handleSubmit} 
        />
      </div>
    </div>
  );
}
