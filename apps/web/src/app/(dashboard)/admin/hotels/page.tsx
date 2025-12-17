'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import EllipsisPagination from '@/components/ui/EllipsisPagination';
import HotelTable from '@/features/hotels/components/HotelTable';
import { HotelStatus } from '@/features/hotels/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useHotelsQuery } from '@/features/hotels/queries';
import { useDebounce } from '@/hooks/useDebounce';

export default function AdminHotelsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<HotelStatus | 'all'>('all');
  const limit = 10;
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data, isLoading } = useHotelsQuery({
    q: debouncedSearch,
    status: statusFilter,
    limit,
    offset: (page - 1) * limit,
  });

  const hotels = data?.data || [];
  const total = data?.meta.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const onPageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on search
  };

  const handleStatusChange = (val: HotelStatus | 'all') => {
    setStatusFilter(val);
    setPage(1); // Reset to first page on filter change
  };

  return (
    <div className="m-4 md:m-6 space-y-6">
       <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">Hotels Management</h1>
                <Link href="/admin/hotels/new">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus size={20} className="mr-2" />
                  Add Hotel
                </Button>
                </Link>
              </div>

      <Card className="p-4 bg-card border-border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Input
                placeholder="Search by name or phone..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pr-4 py-2 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={(val) => handleStatusChange(val as HotelStatus | 'all')}>
              <SelectTrigger className="w-[160px] border border-border text-foreground">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                <SelectItem value="DRAFT">DRAFT</SelectItem>
                <SelectItem value="SUSPENDED">SUSPENDED</SelectItem>
                <SelectItem value="ARCHIVED">ARCHIVED</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="flex justify-center p-8">Loading...</div>
      ) : (
        <>
          <HotelTable hotels={hotels} />
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
                Showing {hotels.length} of {total} hotels
            </div>
            <EllipsisPagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
          </div>
        </>
      )}
    </div>
  );
}
