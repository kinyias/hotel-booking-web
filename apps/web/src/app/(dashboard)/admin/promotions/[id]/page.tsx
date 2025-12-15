'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { PromotionForm } from '@/features/promotion/components/PromotionForm';
import { PromotionFormValues } from '@/features/promotion/validator';
import { Promotion } from '@/features/promotion/types';

// Mock Data - In a real app, this would come from an API/Server Action
const MOCK_PROMOTIONS: Promotion[] = [
  {
    id: '1',
    hotel_id: "1",
    type: { id: 't1', name: 'Seasonal', description: 'Seasonal promotions', status: 'ACTIVE' },
    title: 'Summer Sale',
    description: 'Get 20% off on all summer bookings',
    discount_type: 'PERCENTAGE',
    discount_value: 20,
    start_date: '2025-06-01',
    end_date: '2025-08-31',
    status: 'ACTIVE',
  },
  {
    id: '2',
    hotel_id: "1",
    type: { id: 't2', name: 'Flash Deal', description: 'Limited time offers', status: 'ACTIVE' },
    title: 'Weekend Getaway',
    description: 'Special price for weekend stays',
    discount_type: 'FIXED_AMOUNT',
    discount_value: 50,
    start_date: '2025-05-10',
    end_date: '2025-05-12',
    status: 'EXPIRED',
  },
  {
    id: '3',
    hotel_id: "1",
    type: { id: 't3', name: 'New Year', description: 'New Year specials', status: 'INACTIVE' },
    title: 'Welcome 2026',
    description: 'Celebrate New Year with us',
    discount_type: 'PERCENTAGE',
    discount_value: 15,
    start_date: '2025-12-25',
    end_date: '2026-01-05',
    status: 'DRAFT',
  },
  {
    id: '4',
    hotel_id: "1",
    type: { id: 't1', name: 'Seasonal', description: 'Seasonal promotions', status: 'ACTIVE' },
    title: 'Winter Warmup',
    description: 'Cozy stays for winter',
    discount_type: 'PERCENTAGE',
    discount_value: 10,
    start_date: '2025-11-01',
    end_date: '2026-02-28',
    status: 'INACTIVE',
  },
  {
    id: '5',
    hotel_id: "1",
    type: { id: 't4', name: 'Early Bird', description: 'Advance booking discounts', status: 'ACTIVE' },
    title: 'Book Early Save More',
    description: 'Book 3 months in advance and save',
    discount_type: 'PERCENTAGE',
    discount_value: 25,
    start_date: '2025-01-01',
    end_date: '2025-12-31',
    status: 'ACTIVE',
  }
];

export default function PromotionEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isEditing = id && id !== 'new';

  const promotion = isEditing ? MOCK_PROMOTIONS.find((p) => p.id === id) : undefined;

  if (isEditing && !promotion) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-500">Promotion not found</h1>
        <Button onClick={() => router.push('/admin/promotions')} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const initialData: PromotionFormValues | undefined = promotion
    ? {
        ...promotion,
        type_id: promotion.type.id,
        start_date: new Date(promotion.start_date),
        end_date: new Date(promotion.end_date),
        discount_value: Number(promotion.discount_value),
      }
    : undefined;

  const handleSubmit = async (data: PromotionFormValues) => {
    // Simulate API call
    console.log('Submitting promotion data:', data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Redirect back to list
    router.push('/admin/promotions');
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
          {isEditing ? 'Edit Promotion' : 'Create Promotion'}
        </h1>
      </div>

      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <PromotionForm 
            initialData={initialData} 
            onSubmit={handleSubmit} 
        />
      </div>
    </div>
  );
}
