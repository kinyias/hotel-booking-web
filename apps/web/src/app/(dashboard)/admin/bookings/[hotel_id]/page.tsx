"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { 
  Loader2, 
  CalendarDays, 
  Search,
  ArrowLeft,
  MoreHorizontal
} from "lucide-react";

import PageTitle from "@/components/sections/PageTitle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EllipsisPagination from "@/components/ui/EllipsisPagination";

import { useHotelDetailQuery } from "@/features/hotels/queries";
import { useBookingsQuery } from "@/features/bookings/queries";
import { formatCurrency } from "@/utils/currency";
import Link from "next/link";
import { UpdateStatusBookingDialog } from "@/features/bookings/components/UpdateStatusBookingDialog";
import { Booking } from "@/features/bookings/types";
import { useDebounce } from "@/hooks/useDebounce";

export default function HotelBookingsPage() {
  const params = useParams();
  const router = useRouter();
  const hotelId = params.hotel_id as string;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
  const limit= 10
  // Fetch Hotel Details
  const { data: hotel, isLoading: isLoadingHotel } = useHotelDetailQuery(hotelId);

  // Fetch Bookings
  const { data: bookingsResponse, isLoading: isLoadingBookings } = useBookingsQuery(
    hotelId, 
    { 
        page, 
        limit,
        q: debouncedSearch
    }, 
    !!hotelId
  );
  
  const bookings = bookingsResponse?.data || [];
  const meta = bookingsResponse?.meta;
  const total = meta?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'CONFIRMED': return <Badge className="bg-green-500 hover:bg-green-600">Confirmed</Badge>;
      case 'PENDING': return <Badge variant="secondary" className="bg-yellow-500 text-white hover:bg-yellow-600">Pending</Badge>;
      case 'CANCELLED': return <Badge variant="destructive">Cancelled</Badge>;
      case 'CHECKED_IN': return <Badge className="bg-blue-500 hover:bg-blue-600">Checked In</Badge>;
      case 'NO_SHOW': return <Badge variant="destructive" className="bg-red-700">No Show</Badge>;
      case 'COMPLETED': return <Badge variant="outline" className="border-green-500 text-green-600">Completed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoadingHotel) {
      return (
          <div className="h-screen flex items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
      )
  }

  if (!hotel) {
      return <div>Hotel not found</div>
  }

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/admin/bookings')}>
            <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* Filter & Search */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100 mt-5">
         <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
               placeholder="Search bookings by guest name or email" 
               className="pl-9"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         {/* Add Date Range Filter here later */}
      </div>

      <Card className="shadow-md border-gray-100">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-4">
             <div className="flex justify-between items-center">
                <CardTitle className="text-lg">All Bookings</CardTitle>
                <div className="text-sm text-gray-500">
                    Total: {meta?.total || bookings.length}
                </div>
             </div>
          </CardHeader>
          <CardContent className="p-0">
             {isLoadingBookings ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
             ) : bookings && bookings.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50">
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Guest Info</TableHead>
                            <TableHead>Dates</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-right w-[80px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bookings.map((booking) => (
                            <TableRow key={booking.id} className="hover:bg-blue-50/50 transition-colors">
                                <TableCell className="font-mono text-xs text-gray-500">
                                    {booking.id.slice(0, 8)}...
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-900">{booking.guestName}</span>
                                        <span className="text-xs text-gray-500">{booking.guestPhone}</span>
                                        <span className="text-xs text-gray-400">{booking.guestEmail}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="w-14 text-xs text-gray-500">In:</span> 
                                            <span className="font-medium">{format(new Date(booking.checkIn), "dd MMM")}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-14 text-xs text-gray-500">Out:</span> 
                                            <span className="font-medium">{format(new Date(booking.checkOut), "dd MMM yyyy")}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {getStatusBadge(booking.status)}
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    {formatCurrency(booking.totalAmount)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                          <span className="sr-only">Open menu</span>
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem
                                          onClick={() => navigator.clipboard.writeText(booking.id)}
                                        >
                                          Copy ID
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem><Link href={`/admin/bookings/${hotelId}/booking/${booking.id}`}>View Details</Link></DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => {
                                            setSelectedBooking(booking);
                                            setIsUpdateStatusOpen(true);
                                        }}>
                                            Update Status
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
             ) : (
                <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                    <CalendarDays className="w-12 h-12 mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No bookings found</p>
                    <p className="text-sm">Try adjusting your search filters.</p>
                </div>
             )}
          </CardContent>
          
          {/* Pagination */}
          {meta && (
            <div className="p-4 border-t border-gray-100 flex justify-center">
              <EllipsisPagination 
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
      </Card>
      {selectedBooking && (
        <UpdateStatusBookingDialog
            hotelId={hotelId}
            bookingId={selectedBooking.id}
            currentStatus={selectedBooking.status}
            open={isUpdateStatusOpen}
            onOpenChange={(open) => {
                setIsUpdateStatusOpen(open);
                if (!open) setSelectedBooking(null);
            }}
        />
      )}
    </div>
  );
}
