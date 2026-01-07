'use client';

import { Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import PromotionForm from '@/features/promotion/components/PromotionForm';
import { usePromotionQuery } from '@/features/promotion/queries';
import { useCreatePromotionMutation, useUpdatePromotionMutation } from '@/features/promotion/mutations';
import { CreatePromotionFormValues, UpdatePromotionFormValues } from '@/features/promotion/validator';
import { ROUTES } from '@/constants';
import Link from 'next/link';

function PromotionDetailContent() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isEditing = id !== 'create';

  const { data: promotion, isLoading, isError } = usePromotionQuery(id);
  const createMutation = useCreatePromotionMutation();
  const updateMutation = useUpdatePromotionMutation(id);

  // Determine if we are loading (only if editing and no data yet)
  const isPageLoading = isEditing && isLoading;

  const onSubmit = async (data: CreatePromotionFormValues | UpdatePromotionFormValues) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync(data as UpdatePromotionFormValues);
      } else {
        await createMutation.mutateAsync(data as CreatePromotionFormValues);
      }
      router.push(ROUTES.ADMIN_PROMOTIONS);
    } catch (error) {
      // Error is handled by mutation onError
    }
  };

  if (isPageLoading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (isEditing && (isError || !promotion)) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-destructive">Promotion not found</h2>
        <p className="text-muted-foreground mt-2">The promotion you are looking for does not exist.</p>
        <Link href={ROUTES.ADMIN_PROMOTIONS}>
          <Button variant="outline" className="mt-4">
            Go Back
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center gap-4">
        <Link href={ROUTES.ADMIN_PROMOTIONS}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? 'Edit Promotion' : 'Create Promotion'}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isEditing ? 'Update promotion details' : 'Add a new promotion code'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? `Details: ${promotion?.code}` : 'Promotion Details'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PromotionForm 
            initialData={isEditing ? promotion : undefined} 
            onSubmit={onSubmit} 
            isLoading={isEditing ? updateMutation.isPending : createMutation.isPending} 
          />
        </CardContent>
      </Card>
    </>
  );
}

export default function PromotionDetailPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
         <PromotionDetailContent />
      </Suspense>
    </div>
  );
}
