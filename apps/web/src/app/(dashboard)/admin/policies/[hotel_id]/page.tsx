'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { usePoliciesQuery, useDeletePolicyMutation, PolicyType } from '@/features/policies';
import { ConfirmDialog } from '@/components/common/CofirmDialog';
import { useState } from 'react';

const POLICY_TYPE_LABELS: Record<PolicyType, string> = {
  CHECKIN: 'Check-in',
  CANCELLATION: 'Cancellation',
  PAYMENT: 'Payment',
  CHILDREN: 'Children',
  PET: 'Pet',
  SMOKING: 'Smoking',
  GENERAL: 'General',
};

const POLICY_TYPE_COLORS: Record<PolicyType, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  CHECKIN: 'default',
  CANCELLATION: 'destructive',
  PAYMENT: 'secondary',
  CHILDREN: 'outline',
  PET: 'outline',
  SMOKING: 'outline',
  GENERAL: 'default',
};

export default function HotelPoliciesPage() {
  const params = useParams();
  const router = useRouter();
  const hotelId = params.hotel_id as string;
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: policies, isLoading } = usePoliciesQuery(hotelId);
  const deleteMutation = useDeletePolicyMutation(hotelId);

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push('/admin/policies')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Hotels
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Hotel Policies</h1>
            <p className="text-muted-foreground mt-1">
              Manage policies for this hotel
            </p>
          </div>
          <Button onClick={() => router.push(`/admin/policies/${hotelId}/policy/new`)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Policy
          </Button>
        </div>
      </div>

      {/* Policies List */}
      <div className="space-y-4">
        {!policies || policies.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No policies found for this hotel.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.push(`/admin/policies/${hotelId}/policy/new`)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Policy
              </Button>
            </CardContent>
          </Card>
        ) : (
          policies.map((policy) => (
            <Card key={policy.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle>{policy.title}</CardTitle>
                      <Badge variant={POLICY_TYPE_COLORS[policy.type]}>
                        {POLICY_TYPE_LABELS[policy.type]}
                      </Badge>
                      {!policy.enabled && (
                        <Badge variant="outline" className="text-muted-foreground">
                          Disabled
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="whitespace-pre-wrap">
                      {policy.content}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        router.push(`/admin/policies/${hotelId}/policy/${policy.id}`)
                      }
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(policy.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteId}
        title="Delete Policy"
        description="This action cannot be undone. This will permanently delete the policy."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
