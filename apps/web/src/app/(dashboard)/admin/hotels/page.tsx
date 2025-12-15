'use client';

import { useEffect, useMemo, useState } from 'react';
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
import { Hotel, HotelsQueryParams } from '@/features/hotels/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const MOCK_HOTELS: Hotel[] = [
  {
    hotel_id: '1',
    owner_id: 'owner1',
    name: 'Grand Plaza Hotel',
    address: '123 Market St, San Francisco, CA',
    description: 'Luxury accommodation in the heart of the city.',
    star: 5,
    phone: '+1 415-555-0100',
    status: 'ACTIVE',
    images: [],
  },
  {
    hotel_id: '2',
    owner_id: 'owner2',
    name: 'Sunset Resort',
    address: '456 Beach Blvd, Miami, FL',
    description: 'Beautiful ocean views and relaxing atmosphere.',
    star: 4,
    phone: '+1 305-555-0102',
    status: 'ACTIVE',
    images: [],
  },
  {
    hotel_id: '3',
    owner_id: 'owner3',
    name: 'Mountain View Lodge',
    address: '789 Alpine Way, Denver, CO',
    description: 'Cozy retreat for ski enthusiasts.',
    star: 3,
    phone: '+1 303-555-0103',
    status: 'INACTIVE',
    images: [],
  },
  {
    hotel_id: '4',
    owner_id: 'owner4',
    name: 'City Center Inn',
    address: '321 Downtown Ave, Chicago, IL',
    description: 'Convenient location for business travelers.',
    star: 3,
    phone: '+1 312-555-0104',
    status: 'ACTIVE',
    images: [],
  },
  {
    hotel_id: '5',
    owner_id: 'owner1',
    name: 'Lakeside Hotel',
    address: '654 Lake Dr, Seattle, WA',
    description: 'Peaceful stay by the water.',
    star: 4,
    phone: '+1 206-555-0105',
    status: 'ACTIVE',
    images: [],
  },
  {
    hotel_id: '6',
    owner_id: 'owner5',
    name: 'Historic Boutique Hotel',
    address: '987 Old Town Rd, Charleston, SC',
    description: 'Charming historic building with modern amenities.',
    star: 5,
    phone: '+1 843-555-0106',
    status: 'ACTIVE',
    images: [],
  },
  {
    hotel_id: '7',
    owner_id: 'owner2',
    name: 'Airport Suites',
    address: '100 Airport Blvd, Los Angeles, CA',
    description: 'Perfect for layovers and early flights.',
    star: 3,
    phone: '+1 310-555-0107',
    status: 'INACTIVE',
    images: [],
  },
   {
    hotel_id: '8',
    owner_id: 'owner6',
    name: 'Desert Oasis',
    address: '222 Sand Dune Ln, Phoenix, AZ',
    description: 'Relax in the warm desert sun.',
    star: 4,
    phone: '+1 602-555-0108',
    status: 'ACTIVE',
    images: [],
  },
  {
    hotel_id: '9',
    owner_id: 'owner3',
    name: 'Forest Cabin Rentals',
    address: '333 Pine Tree Rd, Portland, OR',
    description: 'Get away from it all in nature.',
    star: 4,
    phone: '+1 503-555-0109',
    status: 'ACTIVE',
    images: [],
  },
  {
    hotel_id: '10',
    owner_id: 'owner7',
    name: 'Seaside Bed & Breakfast',
    address: '444 Coastal Hwy, Monterey, CA',
    description: 'Quaint and comfortable B&B.',
    star: 3,
    phone: '+1 831-555-0110',
    status: 'ACTIVE',
    images: [],
  },
  {
    hotel_id: '11',
    owner_id: 'owner8',
    name: 'Urban Loft Hotel',
    address: '555 Arts District, New York, NY',
    description: 'Trendy loft-style rooms.',
    star: 4,
    phone: '+1 212-555-0111',
    status: 'ACTIVE',
    images: [],
  },
  {
    hotel_id: '12',
    owner_id: 'owner1',
    name: 'Grand Luxury Hotel 2',
    address: '124 Main St, New York, NY',
    description: 'Another luxurious stay.',
    star: 5,
    phone: '+1-555-0112',
    status: 'ACTIVE',
    images: [],
  },
];

export default function AdminHotelsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ACTIVE' | 'INACTIVE'>('all');
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  // Filter and paginated mock data
  const { hotels, total } = useMemo(() => {
    let filtered = MOCK_HOTELS;

    if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        filtered = filtered.filter(hotel => 
            hotel.name.toLowerCase().includes(lowerSearch) ||
            hotel.phone.includes(searchTerm)
        );
    }

    if (statusFilter !== 'all') {
        filtered = filtered.filter(hotel => hotel.status === statusFilter);
    }

    const total = filtered.length;
    const start = (page - 1) * limit;
    const sliced = filtered.slice(start, start + limit);

    return { hotels: sliced, total };
  }, [searchTerm, statusFilter, page, limit]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  useEffect(() => {
    setPage(1);
  }, [searchTerm, statusFilter, limit]);

  const onPageChange = (nextPage: number) => {
    setPage(nextPage);
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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-4 py-2 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as any)}>
              <SelectTrigger className="w-[160px] border border-border text-foreground">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                <SelectItem value="INACTIVE">INACTIVE</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

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
    </div>
  );
}
