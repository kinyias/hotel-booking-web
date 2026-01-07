'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Search, Plus } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import EllipsisPagination from '@/components/ui/EllipsisPagination';
import { useDebounce } from '@/hooks/useDebounce';
import PromotionTable from '@/features/promotion/components/PromotionTable';
import { usePromotionsQuery } from '@/features/promotion/queries';
import { ROUTES } from '@/constants';

function PromotionsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const page = Number(searchParams.get('page')) || 1;
  const isActive = searchParams.get('isActive');
  const q = searchParams.get('search') || '';
  const limit = 20;

  const [searchTerm, setSearchTerm] = useState(q);
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);

  const { data, isLoading, isError } = usePromotionsQuery({
    page,
    limit,
    search: q,
    isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
  });

  const promotions = data?.data || [];
  const totalItems = data?.meta?.total || 0;
  const totalPages = Math.ceil(totalItems / limit);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === 'all') {
      params.delete('isActive');
    } else {
      params.set('isActive', value);
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    if (debouncedSearch !== q) {
      const params = new URLSearchParams(searchParams);
      if (debouncedSearch) {
        params.set('search', debouncedSearch);
      } else {
        params.delete('search');
      }
      params.set('page', '1');
      router.push(`${pathname}?${params.toString()}`);
    }
  }, [debouncedSearch, q, router, pathname, searchParams]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-48" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-destructive">Unable to load promotions</h2>
        <p className="text-muted-foreground mt-2">Please try again later.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by code or name..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={isActive || 'all'} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Link href={`${ROUTES.ADMIN_PROMOTIONS}/create`}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create
          </Button>
        </Link>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-muted-foreground">
        Showing {promotions.length} of {totalItems} promotions
      </div>

      {/* Table */}
      <PromotionTable promotions={promotions} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <EllipsisPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}

export default function PromotionsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Promotions</h1>
        <p className="text-muted-foreground mt-2">
          Manage discount codes and promotional campaigns
        </p>
      </div>

      <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
        <PromotionsContent />
      </Suspense>
    </div>
  );
}
