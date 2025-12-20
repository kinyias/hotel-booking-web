'use client';

import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
  useCommissionPackageQuery,
  useCreateCommissionPackageMutation,
  useUpdateCommissionPackageMutation,
  CommissionPackageFormValues,
} from '@/features/commissions';
import CommissionPackageForm from '@/features/commissions/components/CommissionPackageForm';
import { ApiError } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CommissionPackageEditPage() {
  const router = useRouter();
  const params = useParams();
  const commissionId = params.commission_id as string;
  const isEditing = commissionId !== 'new';

  const { data: commissionPackage, isLoading: isLoadingPackage } =
    useCommissionPackageQuery(commissionId, isEditing);

  const createMutation = useCreateCommissionPackageMutation();
  const updateMutation = useUpdateCommissionPackageMutation();

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (data: CommissionPackageFormValues) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: commissionId,
          data,
        });
        toast.success('Commission package updated successfully');
      } else {
        await createMutation.mutateAsync(data);
        toast.success('Commission package created successfully');
      }
      router.push('/admin/commissions');
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(
        apiError?.response?.data?.message ||
          `Failed to ${isEditing ? 'update' : 'create'} commission package`
      );
    }
  };

  if (isEditing && isLoadingPackage) {
    return (
      <div className="m-4 md:m-6 space-y-6">
        <div className="flex justify-center py-8">
          Loading commission package...
        </div>
      </div>
    );
  }

  return (
    <div className="m-4 md:m-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/commissions">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-foreground">
          {isEditing ? 'Edit Commission Package' : 'Create Commission Package'}
        </h1>
      </div>

      <CommissionPackageForm
        commissionPackage={commissionPackage}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
