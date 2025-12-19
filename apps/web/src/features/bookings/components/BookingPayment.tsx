"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, differenceInDays } from "date-fns";
import { Loader2 } from "lucide-react";

import PageTitle from "@/components/sections/PageTitle";
import { 
  BookingHotelCard, 
  BookingRoomList, 
  BookingSummary,
} from "@/features/bookings";
import { useHotelDetailQuery } from "@/features/hotels/queries";
import { useQueryRoomTypesAvailable } from "@/features/room-types/queries";
import { useCreateBookingMutation } from "@/features/bookings/mutations";
import { boookingFormSchema, BoookingFormValues } from "@/features/bookings/validator";
import { CreateBookingDto, CreateBookingItemDto } from "@/features/bookings/types";
import { RoomType } from "@/features/room-types/types";

// UI Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

export default function BookingPayment() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // 1. Get Params
  const hotel_id = searchParams.get('hotel_id');
  const check_in_str = searchParams.get('check_in');
  const check_out_str = searchParams.get('check_out');
  const roomsParam = searchParams.get('rooms') || '';
  
  const checkIn = check_in_str ? new Date(check_in_str) : new Date();
  const checkOut = check_out_str ? new Date(check_out_str) : new Date(Date.now() + 86400000);

  // 2. Fetch Data
  const { data: hotel, isLoading: isLoadingHotel } = useHotelDetailQuery(hotel_id || '', !!hotel_id);
  
  const { data: roomTypesResponse, isLoading: isLoadingRooms } = useQueryRoomTypesAvailable(
    hotel_id || '',
    {
      from: format(checkIn, "yyyy-MM-dd"),
      to: format(checkOut, "yyyy-MM-dd"),
    },
    !!hotel_id
  );

  const availableRoomTypes = roomTypesResponse?.data || [];

  // 3. Parse Selected Rooms
  const bookedRooms = useMemo(() => {
    if (!roomsParam || availableRoomTypes.length === 0) return [];
    
    const items: { type: RoomType; quantity: number }[] = [];
    roomsParam.split(',').forEach(item => {
       const [typeId, qty] = item.split(':');
       const roomType = availableRoomTypes.find(rt => rt.id === typeId);
       if (roomType) {
         items.push({ type: roomType, quantity: Number(qty) });
       }
    });
    return items;
  }, [roomsParam, availableRoomTypes]);

  // 4. Booking Mutation
  const { mutate: createBooking, isPending } = useCreateBookingMutation(hotel_id || '');

  // 5. Form Setup
  const form = useForm<BoookingFormValues>({
    resolver: zodResolver(boookingFormSchema),
    defaultValues: {
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      note: ""
    }
  });

  // 6. Calculations
  const nights = Math.max(1, differenceInDays(checkOut, checkIn));
  const calculatedTotal = bookedRooms.reduce((acc, item) => acc + (item.type.price_per_night * item.quantity * nights), 0);
  
  // 7. Submit Handler
  const onSubmit = (values: BoookingFormValues) => {
    if (!hotel_id) return;

    const items: CreateBookingItemDto[] = bookedRooms.map(r => ({
      roomTypeId: r.type.id,
      quantity: r.quantity
    }));

    const payload: CreateBookingDto = {
      hotelId: hotel_id,
      checkIn: format(checkIn, "yyyy-MM-dd"),
      checkOut: format(checkOut, "yyyy-MM-dd"),
      guestName: values.guestName,
      guestEmail: values.guestEmail,
      guestPhone: values.guestPhone,
      note: values.note || "",
      totalAmount: calculatedTotal, // Backend should verify this usually
      items
    };

    createBooking(payload, {
      onSuccess: (data) => {
        // Redirect to success page or history
        // For now, redirect to home or show success
        alert("Booking created successfully!");
        router.push("/");
      },
      onError: (error) => {
        console.error(error);
        alert("Failed to create booking. Please try again.");
      }
    });
  };

  if (isLoadingHotel || isLoadingRooms) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!hotel || bookedRooms.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
        <div className="text-xl font-bold">Invalid Booking Details</div>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <PageTitle 
          title="Confirm Booking" 
          description={`Complete your booking at ${hotel.name}`}
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Hotels", href: "/hotels" },
            { label: "Booking", href: "/booking" },
          ]} 
        />

        <div className="container mx-auto px-4 -mt-10 relative z-20">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LEFT COLUMN: Booking Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Hotel Info */}
                  <BookingHotelCard 
                    hotel={hotel}
                    checkIn={checkIn.toISOString()}
                    checkOut={checkOut.toISOString()}
                  />

                  {/* Room List */}
                  <BookingRoomList rooms={bookedRooms} />

                  {/* Guest Form */}
                  <Card className="shadow-sm border border-gray-100">
                    <CardHeader>
                      <CardTitle>Guest Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <FormField
                            control={form.control}
                            name="guestName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="guestPhone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="+84 ..." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                      </div>

                      <FormField
                        control={form.control}
                        name="guestEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input placeholder="john@example.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="note"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Special Requests (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Late check-in, dietary restrictions, etc." 
                                className="min-h-[100px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                    </CardContent>
                  </Card>

                </div>

                {/* RIGHT COLUMN: Price Summary */}
                <div className="lg:col-span-1">
                  <BookingSummary 
                      bookedRooms={bookedRooms}
                      finalPrice={calculatedTotal}

                      onConfirm={form.handleSubmit(onSubmit)}
                      isPending={isPending}
                  />
                </div>

              </div>
            </form>
          </Form>
        </div>
      </div>
  );
}
