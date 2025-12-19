"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { 
  ArrowLeft, 
  Loader2, 
  CalendarDays, 
  User, 
  CreditCard,
  Building,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  MapPin
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/common/CofirmDialog";

import { useMyBookingByIdQuery } from "@/features/bookings/queries";
import { useCancelBookingMutation } from "@/features/bookings/mutations";
import { formatCurrency } from "@/utils/currency";

export default function MyBookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.booking_id as string;

  const { data: booking, isLoading, isError } = useMyBookingByIdQuery(bookingId);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'CONFIRMED': return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="w-3 h-3 mr-1" /> Confirmed</Badge>;
      case 'PENDING': return <Badge variant="secondary" className="bg-yellow-500 text-white hover:bg-yellow-600"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      case 'CANCELLED': return <Badge variant="destructive">Cancelled</Badge>;
      case 'CHECKED_IN': return <Badge className="bg-blue-500 hover:bg-blue-600">Checked In</Badge>;
      case 'NO_SHOW': return <Badge variant="destructive" className="bg-red-700">No Show</Badge>;
      case 'COMPLETED': return <Badge variant="outline" className="border-green-500 text-green-600">Completed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
      switch(status) {
          case 'SUCCEEDED': return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">Succeeded</Badge>;
          case 'PENDING': return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200">Pending</Badge>;
          case 'FAILED': return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200">Failed</Badge>;
          default: return <Badge variant="outline">{status}</Badge>;
      }
  }

  const [confirmOpen, setConfirmOpen] = useState(false);
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBookingMutation((booking as any)?.hotel?.id, bookingId);
  const queryClient = useQueryClient();

  const handleCancelClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirmCancel = () => {
    cancelBooking(undefined, {
      onSuccess: () => {
        toast.success("Booking cancelled successfully");
        setConfirmOpen(false);
        queryClient.invalidateQueries({ queryKey: ["my-booking", bookingId] });
        queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      },
      onError: (error) => {
        toast.error("Failed to cancel booking");
        console.error(error);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-semibold text-gray-900">Booking not found</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 container mx-auto pb-10 pt-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center gap-3">
                Booking #{booking.id} 
                {getStatusBadge(booking.status)}
            </h1>
            <p className="text-gray-500">
                Created on {format(new Date(booking.createdAt), "dd MMM yyyy, HH:mm")}
            </p>
        </div>
        {/* Actions - e.g. Cancel Booking, Check In */}
        <div className="flex gap-2">
             {booking.status === 'PENDING' && (
                 <Button variant="destructive" onClick={handleCancelClick}>Cancel Booking</Button>
             )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
              
              {/* Hotel Info */}
              <Card>
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                          <Building className="w-5 h-5 text-gray-500" />
                          Hotel Information
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div className="flex flex-col gap-1">
                          <h3 className="text-lg font-bold">{(booking as any).hotel?.name}</h3>
                          <div className="flex items-center gap-2 text-gray-500">
                              <MapPin className="w-4 h-4" />
                              <p>{(booking as any).hotel?.address}, {(booking as any).hotel?.city}, {(booking as any).hotel?.country}</p>
                          </div>
                      </div>
                  </CardContent>
              </Card>

              {/* Room Items */}
              <Card>
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                          <Building className="w-5 h-5 text-gray-500" />
                          Booked Rooms
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                      <Table>
                          <TableHeader>
                              <TableRow>
                                  <TableHead>Room Type</TableHead>
                                  <TableHead className="text-center">Quantity</TableHead>
                                  <TableHead className="text-right">Price</TableHead>
                                  <TableHead className="text-right">Total</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {booking.items.map((item) => (
                                  <TableRow key={item.id}>
                                      <TableCell>
                                          <div className="font-medium">{item.roomType?.name || item.roomTypeId}</div>
                                      </TableCell>
                                      <TableCell className="text-center">{item.quantity}</TableCell>
                                      <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                                      <TableCell className="text-right font-medium">{formatCurrency(item.lineTotal)}</TableCell>
                                  </TableRow>
                              ))}
                          </TableBody>
                      </Table>
                  </CardContent>
              </Card>

              {/* Payment Info */}
              <Card>
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-gray-500" />
                          Payment Information
                      </CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className="flex justify-between items-center mb-6 bg-gray-50 p-4 rounded-lg">
                          <span className="font-medium text-gray-600">Total Amount</span>
                          <span className="text-2xl font-bold text-primary">{formatCurrency(booking.totalAmount)}</span>
                      </div>
                      
                      {booking.payments && booking.payments.length > 0 ? (
                           <div className="space-y-4">
                               <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wider">Transaction History</h4>
                               {booking.payments.map(payment => (
                                   <div key={payment.id} className="flex justify-between items-center border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                       <div>
                                           <div className="font-medium">{payment.method}</div>
                                           <div className="text-xs text-gray-500">{format(new Date(payment.createdAt), "dd MMM yyyy, HH:mm")}</div>
                                       </div>
                                       <div className="text-right">
                                           <div className="font-medium">{formatCurrency(payment.amount)}</div>
                                           {/* <div className="mt-1">{getPaymentStatusBadge(payment.status || 'PENDING')}</div> */}
                                       </div>
                                   </div>
                               ))}
                           </div>
                      ) : (
                          <div className="text-center py-4 text-gray-500">No payment records found</div>
                      )}
                  </CardContent>
              </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
              
              {/* Stay Info */}
              <Card>
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                          <CalendarDays className="w-5 h-5 text-gray-500" />
                          Stay Details
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <p className="text-sm text-gray-500 mb-1">Check-in</p>
                              <p className="font-medium">{format(new Date(booking.checkIn), "dd MMM yyyy")}</p>
                              <p className="text-xs text-gray-400">After 14:00</p>
                          </div>
                          <div>
                              <p className="text-sm text-gray-500 mb-1">Check-out</p>
                              <p className="font-medium">{format(new Date(booking.checkOut), "dd MMM yyyy")}</p>
                              <p className="text-xs text-gray-400">Before 12:00</p>
                          </div>
                      </div>
                       <Separator />
                       <div className="text-center">
                           <p className="text-sm text-gray-500 mb-1">Duration</p>
                           <p className="font-medium">
                               {Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24))} nights
                           </p>
                       </div>
                      
                      {booking.note && (
                          <>
                            <Separator />
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Special Request</p>
                                <p className="text-sm italic text-gray-700 bg-gray-50 p-3 rounded-md">"{booking.note}"</p>
                            </div>
                          </>
                      )}
                  </CardContent>
              </Card>

               {/* Guest Info */}
              <Card>
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                          <User className="w-5 h-5 text-gray-500" />
                          Guest Details
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div className="flex items-start gap-3">
                          <User className="w-4 h-4 text-gray-400 mt-1" />
                          <div>
                              <p className="text-sm text-gray-500">Name</p>
                              <p className="font-medium">{booking.guestName}</p>
                          </div>
                      </div>
                      <div className="flex items-start gap-3">
                          <Mail className="w-4 h-4 text-gray-400 mt-1" />
                          <div>
                              <p className="text-sm text-gray-500">Email</p>
                              <p className="font-medium break-all">{booking.guestEmail}</p>
                          </div>
                      </div>
                      <div className="flex items-start gap-3">
                          <Phone className="w-4 h-4 text-gray-400 mt-1" />
                          <div>
                              <p className="text-sm text-gray-500">Phone</p>
                              <p className="font-medium">{booking.guestPhone}</p>
                          </div>
                      </div>
                  </CardContent>
              </Card>

          </div>
      </div>
      
      <ConfirmDialog 
        open={confirmOpen}
        title="Cancel Booking"
        description="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Yes, Cancel Booking"
        cancelText="No, Keep Booking"
        isLoading={isCancelling}
        onConfirm={handleConfirmCancel}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
