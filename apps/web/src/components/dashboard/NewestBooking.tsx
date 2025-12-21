'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNewestBookingsQuery } from "@/features/dashboard/queries";
import { format } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";
import Link from 'next/link';
import { ROUTES } from "@/constants";

interface NewestBookingProps {
    hotelId?: string;
}

export function NewestBooking({ hotelId }: NewestBookingProps) {
  const { data: bookings, isLoading } = useNewestBookingsQuery(hotelId);

  if (isLoading) {
      return (
        <Card>
            <CardHeader><Skeleton className="h-6 w-32"/></CardHeader>
            <CardContent className="space-y-4">
                {[1,2,3].map(i => (
                    <div key={i} className="flex gap-4 items-center">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                             <Skeleton className="h-4 w-1/3" />
                             <Skeleton className="h-3 w-1/4" />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
      )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Newest Booking</CardTitle>
          {/* <Button variant="link" className="text-primary">More</Button> */}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings?.map((booking) => (
            <div key={booking.id} className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{booking.guestName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
              <Link href={ROUTES.ADMIN_BOOKINGS + '/' + hotelId + '/booking/' + booking.id}>
                <p className="font-semibold text-sm hover:text-primary">{booking.guestName}</p>
                <p className="text-xs text-primary">{format(new Date(booking.createdAt), 'MMM dd, yyyy')}</p>
              </Link>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <p>{booking.items?.[0]?.roomType?.name || 'Room'}</p>
                <p>{booking.items?.[0]?.quantity} Room(s)</p>
              </div>
            </div>
          ))}
          {bookings?.length === 0 && (
             <p className="text-center text-muted-foreground py-4">No recent bookings.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
