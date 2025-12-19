"use client";

import { useState } from "react";
import { format } from "date-fns";
import { 
  Loader2, 
  CalendarDays, 
  CreditCard, 
  User, 
  Building 
} from "lucide-react";

import PageTitle from "@/components/sections/PageTitle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

import { useHotelsQuery } from "@/features/hotels/queries";
import { useBookingsQuery } from "@/features/bookings/queries";
import { formatCurrency } from "@/utils/currency";

export default function BookingsPage() {
  const [selectedHotelId, setSelectedHotelId] = useState<string>("");

  // Fetch Hotels
  const { data: hotelsResponse, isLoading: isLoadingHotels } = useHotelsQuery({ limit: 100 });
  const hotels = hotelsResponse?.data || [];

  // Fetch Bookings
  const { data: bookingsResponse, isLoading: isLoadingBookings } = useBookingsQuery(
    selectedHotelId, 
    {}, 
    !!selectedHotelId
  );
  
  const bookings = bookingsResponse?.data || [];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'CONFIRMED': return <Badge className="bg-green-500">Confirmed</Badge>;
      case 'PENDING': return <Badge variant="secondary" className="bg-yellow-500 text-white">Pending</Badge>;
      case 'CANCELLED': return <Badge variant="destructive">Cancelled</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2 text-gray-500">
             <Building className="w-5 h-5" />
             <span className="font-medium whitespace-nowrap">Select Hotel:</span>
          </div>
          <div className="w-[300px]">
            <Select 
                value={selectedHotelId} 
                onValueChange={setSelectedHotelId}
                disabled={isLoadingHotels}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoadingHotels ? "Loading hotels..." : "Select a hotel..."} />
              </SelectTrigger>
              <SelectContent>
                {hotels.map((hotel) => (
                  <SelectItem key={hotel.id} value={hotel.id}>
                    {hotel.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {selectedHotelId ? (
        <Card className="shadow-md border-gray-100">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100">
             <div className="flex justify-between items-center">
                <CardTitle>Bookings List</CardTitle>
                <Badge variant="outline" className="bg-white">
                    {bookings?.length || 0} Records
                </Badge>
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
                            <TableHead>Booking ID</TableHead>
                            <TableHead>Guest</TableHead>
                            <TableHead>Dates</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Total Amount</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bookings.map((booking) => (
                            <TableRow key={booking.id} className="hover:bg-blue-50/50 transition-colors">
                                <TableCell className="font-mono text-xs">{booking.id}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{booking.guestName}</span>
                                        <span className="text-xs text-gray-500">{booking.guestPhone}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col text-sm">
                                        <span className="flex items-center gap-2 text-gray-600">
                                            <span className="w-16 text-xs text-gray-400">Check-in:</span>
                                            {format(new Date(booking.checkIn), "dd MMM yyyy")}
                                        </span>
                                        <span className="flex items-center gap-2 text-gray-600">
                                            <span className="w-16 text-xs text-gray-400">Check-out:</span>
                                            {format(new Date(booking.checkOut), "dd MMM yyyy")}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {getStatusBadge(booking.status)}
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    {formatCurrency(booking.totalAmount)}
                                </TableCell>
                                <TableCell className="text-right">
                                    {/* Add actions here later, e.g. View Details */}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
             ) : (
                <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                    <CalendarDays className="w-12 h-12 mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No bookings found</p>
                    <p className="text-sm">This hotel hasn't received any bookings yet.</p>
                </div>
             )}
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
            <Building className="w-16 h-16 text-gray-200 mb-4" />
            <h3 className="text-xl font-medium text-gray-900">Select a Hotel</h3>
            <p className="text-gray-500 mt-1">Please select a hotel from the dropdown to view its bookings.</p>
        </div>
      )}
    </div>
  );
}
