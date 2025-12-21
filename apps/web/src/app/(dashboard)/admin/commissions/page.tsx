'use client';

import { Button } from '@/components/ui/button';
import { useCommissionPackagesQuery } from '@/features/commissions';
import CommissionPackageTable from '@/features/commissions/components/CommissionPackageTable';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { CommissionRevenue } from '@/features/commissions/components/CommissionRevenue';

export default function CommissionsPage() {
  const { data: packages, isLoading, isError } = useCommissionPackagesQuery();

  return (
    <div className="m-4 md:m-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          Commission Packages
        </h1>
        <div className="flex items-center gap-4">
          <Link href="/admin/commissions/hotels">
            <Button variant="outline">
              See Hotel Commissions
            </Button>
          </Link>
          <Link href="/admin/commissions/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Package
            </Button>
          </Link>
        </div>
      </div>

      <CommissionRevenue />

      {isLoading ? (
        <div className="flex justify-center py-8">
          Loading commission packages...
        </div>
      ) : isError ? (
        <div className="flex justify-center py-8 text-destructive">
          Error loading commission packages
        </div>
      ) : (
        <CommissionPackageTable packages={packages || []} />
      )}
    </div>
  );
}
