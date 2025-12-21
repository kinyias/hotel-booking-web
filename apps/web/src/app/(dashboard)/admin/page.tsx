'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import DashboardStats from '@/components/dashboard/DashboardStats';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { NewestBooking } from '@/components/dashboard/NewestBooking';
import { CustomerReviews } from '@/components/dashboard/CustomerReviews';
import { useState } from 'react';
import { useHotelsQuery } from '@/features/hotels';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Eye, Search } from 'lucide-react';
import EllipsisPagination from '@/components/ui/EllipsisPagination';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/providers/AuthProvider';
import { User } from '@/features/user';
function DashboardPage() {
  const {user} = useAuth();
  const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const limit = 10;
  
    const { data: hotelsResponse, isLoading } = useHotelsQuery({
      page,
      limit,
      q: search,
    });
  
    const hotels = hotelsResponse?.data || [];
    const total = hotelsResponse?.meta.total || 0;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const isAdmin = (user: User | null): boolean => {
      return user?.roles.some(role => role.name === 'ADMIN') || false;
    };
  return (
    <div className='m-4 md:m-6'>
      {!isAdmin(user) && 
      <DashboardStats />
      }
      <div className="space-y-6 mb-5">
      <div className="">
        <h1 className="text-3xl font-bold">Hotels</h1>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search hotels..."
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hotel Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-gray-400 italic">
                  Loading hotels...
                </TableCell>
              </TableRow>
            ) : hotels.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-gray-400 italic">
                  No hotels found.
                </TableCell>
              </TableRow>
            ) : (
              hotels.map((hotel) => (
                <TableRow key={hotel.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium">{hotel.name}</TableCell>
                  <TableCell className="text-gray-500">{hotel.address}</TableCell>
                  <TableCell className="text-gray-500">{hotel.owner.email}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/dashboard/${hotel.id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Dashboard
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <EllipsisPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
    </div>
  );
}

export default DashboardPage;
