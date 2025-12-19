"use client";

import { useState } from "react";
import { format } from "date-fns";
import { 
  Loader2, 
  CalendarDays, 
  MapPin,
  Clock,
  CheckCircle2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EllipsisPagination from "@/components/ui/EllipsisPagination";

import { useMyBookingsQuery } from "@/features/bookings/queries";
import { formatCurrency } from "@/utils/currency";
import Link from "next/link";

export default function MyBookingsPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  // Fetch My Bookings
  const { data: bookingsResponse, isLoading } = useMyBookingsQuery({ 
      page, 
      limit 
  });
console.log(bookingsResponse)
  const bookings = bookingsResponse?.data || [];
  const meta = bookingsResponse?.meta;
  const total = meta?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'CONFIRMED': return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="w-3 h-3 mr-1" /> Confirmed</Badge>;
      case 'PENDING': return <Badge variant="secondary" className="bg-yellow-500 text-white hover:bg-yellow-600"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      case 'CANCELLED': return <Badge variant="destructive">Cancelled</Badge>;
      case 'CHECK_IN': return <Badge className="bg-blue-500 hover:bg-blue-600">Checked In</Badge>;
      case 'NO_SHOW': return <Badge variant="destructive" className="bg-red-700">No Show</Badge>;
      case 'COMPLETED': return <Badge variant="outline" className="border-green-500 text-green-600">Completed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
        <p className="text-gray-500">Manage your upcoming and past stays.</p>
      </div>

      <Card className="shadow-md border-gray-100">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-4">
             <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Bookings History</CardTitle>
                <Badge variant="outline" className="bg-white">
                    {total} Total Bookings
                </Badge>
             </div>
          </CardHeader>
          <CardContent className="p-0">
             {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
             ) : bookings && bookings.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50">
                            <TableHead className="w-[100px]">Booking ID</TableHead>
                            <TableHead>Hotel</TableHead>
                            <TableHead>Dates</TableHead>
                            <TableHead>Rooms</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
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
                                        <span className="font-medium text-gray-900 line-clamp-1">
                                            {(booking as any).hotel?.name || 'Unknown Hotel'}
                                        </span>
                                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                            <MapPin className="w-3 h-3" />
                                            <span className="truncate max-w-[200px]">
                                                {(booking as any).hotel?.address || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col text-sm">
                                        <span className="font-medium">
                                            {format(new Date(booking.checkIn), "dd MMM")} - {format(new Date(booking.checkOut), "dd MMM yyyy")}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24))} nights
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col text-sm">
                                        {booking.items.slice(0, 2).map((item) => (
                                            <span key={item.id} className="text-gray-600">
                                                {item.quantity}x {item.roomType?.name || item.roomTypeId}
                                            </span>
                                        ))}
                                        {booking.items.length > 2 && (
                                            <span className="text-xs text-gray-400">+{booking.items.length - 2} more...</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="font-bold text-primary">
                                    {formatCurrency(booking.totalAmount)}
                                </TableCell>
                                <TableCell>
                                    {getStatusBadge(booking.status)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Link href={`/me/my-bookings/${booking.id}`}>
                                    <Button variant="outline" size="sm">Details</Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
             ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                    <CalendarDays className="w-16 h-16 mb-4 text-gray-200" />
                    <h3 className="text-lg font-medium text-gray-900">No bookings yet</h3>
                    <p className="text-sm">You haven't made any bookings.</p>
                    <Button className="mt-4" variant="default" onClick={() => window.location.href = '/'}>
                        Browse Hotels
                    </Button>
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
    </div>
  );
}
