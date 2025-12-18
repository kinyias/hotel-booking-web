'use client';

import { useState } from 'react';
import { useGetAmenitiesQuery } from '@/features/amentites/queries';
import { Amenity } from '@/features/amentites/types';
import * as Icons from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import EllipsisPagination from '@/components/ui/EllipsisPagination';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AmenitiesPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Pass pagination and search params to the query
  const { data, isLoading, isError } = useGetAmenitiesQuery({
    limit: pageSize,
    offset: (page - 1) * pageSize,
    q: search || undefined,
  });

  const amenities = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (isError)
    return <div className="p-6 text-red-500">Failed to load amenities.</div>;

  return (
    <div className="container mx-auto py-6 space-y-4" style={{display: 'block'}}>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Amenities</h1>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search by label..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-64"
          />
          <Link href="/admin/amenities/new">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Icons.Plus size={20} className="mr-2" />
                  Add Amenity
                </Button>
                </Link>
        </div>
      </div>
      {isLoading? (<div className="p-6">Loading amenities...</div>): (
        <div>
      <Card className="overflow-hidden">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow className="bg-secondary/50">
              <TableHead className="w-1/6">Icon</TableHead>
              <TableHead className="w-3/6">Label</TableHead>
              <TableHead className="w-2/6">Key</TableHead>
              <TableHead className="w-1/6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {amenities.map((amenity: Amenity) => {
              const IconComponent = (Icons as any)[amenity.key];
              
              return (
                <TableRow key={amenity.id} className="border-b border-border">
                  <TableCell>
                    {IconComponent ? (
                      <IconComponent size={20} />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="w-3/6">{amenity.label}</TableCell>
                  <TableCell className="w-2/6 text-muted-foreground">
                    {amenity.key}
                  </TableCell>
                  <TableCell className="w-1/6">
                    <Link href={`/admin/amenities/${amenity.id}`}>
                   <Button variant="ghost" size="icon" title="Edit">
                      <Icons.Pencil size={20} />
                    </Button>
                      </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
      <EllipsisPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />
        </div>
      )}
    </div>
  );
}
