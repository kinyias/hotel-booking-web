"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { format, differenceInDays, addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { 
  MapPin, 
  User,
  Calendar as CalendarIcon,
  Loader2,
  Search
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import PageTitle from "@/components/sections/PageTitle";
import { BookingTable } from "@/features/bookings/components/BookingTable";
import { cn } from "@/lib/utils";
import { useHotelDetailQuery } from "@/features/hotels/queries";
import { useQueryRoomTypesAvailable } from "@/features/room-types/queries";
import { formatCurrency } from "@/utils/currency";
import { HotelGallery } from "@/features/hotels/components/HotelGallery";
import ReviewList from "@/features/reviews/components/ReviewList";

export type GalleryImage = {
  id: string;
  url: string;
  source: 'hotel' | 'roomtype';
  roomTypeId?: string;
  roomTypeName?: string;
};

export default function HotelDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const hotelId = params.hotel_id as string;
  const router = useRouter();
  
  // Get date params from URL
  const searchFrom = searchParams.get('from');
  const searchTo = searchParams.get('to');

  // Filter States - Initialize from URL or default
  const [date, setDate] = useState<DateRange | undefined>(() => {
    if (searchFrom && searchTo) {
      return {
        from: new Date(searchFrom),
        to: new Date(searchTo)
      };
    }
    return {
      from: new Date(),
      to: addDays(new Date(), 1),
    };
  });

  const [guests, setGuests] = useState({ rooms: 1, adults: 2, children: 0 });
  const [isGuestPopoverOpen, setIsGuestPopoverOpen] = useState(false);

  // Data Fetching
  const { data: hotel, isLoading: isLoadingHotel } = useHotelDetailQuery(hotelId);
  
  // Use URL params for query if available, otherwise fallback to default date logic
  const queryFrom = searchFrom || (date?.from ? format(date.from, "yyyy-MM-dd") : undefined);
  const queryTo = searchTo || (date?.to ? format(date.to, "yyyy-MM-dd") : undefined);

  const { data: roomTypesResponse, isLoading: isLoadingRooms } = useQueryRoomTypesAvailable(
    hotelId,
    queryFrom && queryTo ? {
        from: queryFrom,
        to: queryTo,
    } : undefined
  );

  const roomTypes = roomTypesResponse?.data || [];
  const galleryImages: GalleryImage[] = [
  // Hotel images
  ...(hotel?.images ?? []).map(img => ({
    id: img.image_id,
    url: img.url,
    source: 'hotel' as const,
  })),

  // RoomType images
  ...roomTypes.flatMap(rt =>
    (rt.images ?? []).map(img => ({
      id: img.image_id,
      url: img.url,
      source: 'roomtype' as const,
      roomTypeId: rt.id,
      roomTypeName: rt.name,
    }))
  ),
];
  // Booking State
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // Derived Values
  const checkInDate = queryFrom ? new Date(queryFrom) : new Date();
  const checkOutDate = queryTo ? new Date(queryTo) : addDays(new Date(), 1);
  const nights = Math.max(1, differenceInDays(checkOutDate, checkInDate));

  const totalSelectedRooms = Object.values(quantities).reduce((acc, q) => acc + q, 0);
  const totalPrice = roomTypes.reduce((acc, type) => {
    return acc + (quantities[type.id] || 0) * type.price_per_night * nights;
  }, 0);

  const updateQuantity = (typeId: string, delta: number, availableRooms: number) => {
    setQuantities(prev => {
      const current = prev[typeId] || 0;
      const next = Math.max(0, current + delta);
      if (next > availableRooms) {
        return prev;
      }
      return { ...prev, [typeId]: next };
    });
  };

  const handleSearch = () => {
    if (!date?.from || !date?.to) return;

    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('from', format(date.from, "yyyy-MM-dd"));
    newSearchParams.set('to', format(date.to, "yyyy-MM-dd"));
    
    router.replace(`?${newSearchParams.toString()}`, { scroll: false });
  };

  const handleBookNow = () => {
    if (totalSelectedRooms === 0 || !hotel) return;

    // Construct params
    const roomsParam = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([typeId, qty]) => `${typeId}:${qty}`)
      .join(',');
      
    const bookingSearchParams = new URLSearchParams();
    bookingSearchParams.set('hotel_id', hotel.id);
    // Use the actual query dates for booking
    if(queryFrom) bookingSearchParams.set('check_in', queryFrom);
    if(queryTo) bookingSearchParams.set('check_out', queryTo);
    bookingSearchParams.set('total_price', totalPrice.toString());
    bookingSearchParams.set('rooms', roomsParam);

    router.push(`/booking?${bookingSearchParams.toString()}`);
  };

  const formatDateRange = () => {
    if (!date?.from) return "Select dates";
    if (date.to) return `${format(date.from, "dd/MM/yyyy")} - ${format(date.to, "dd/MM/yyyy")}`;
    return format(date.from, "dd/MM/yyyy");
  };

  if (isLoadingHotel || isLoadingRooms) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
    );
  }

  if (!hotel) {
      return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-xl font-bold">Hotel not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32"> {/* Added padding bottom for fixed booking bar */}
      <PageTitle 
        title={hotel.name}
        description="Detail Hotel Information"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Hotels", href: "/hotels" },
          { label: hotel.name, href: `/hotels/${hotel.id}` },
        ]} 
      />

      <div className="container mx-auto px-4 -mt-10 relative z-20 mb-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Hotel Image Gallery Grid */}
          <HotelGallery images={galleryImages}/>
          
           {/* Description & Amenities */}
           <div className="p-8">
            
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
               <div className="lg:col-span-2">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
                  <div>
                    <h1 className="text-4xl font-bold mb-2">{hotel.name}</h1>
                    <div className="flex items-center gap-2">
                       <MapPin className="w-5 h-5" />
                       <span className="text-lg">{hotel.address}</span>
                    </div>
                  </div>
                </div>
                 <h2 className="text-2xl font-bold mb-4 text-gray-900">About this hotel</h2>
                 {/* Dangerously set inner HTML for description as requested */}
                 <div className="text-gray-600 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: hotel.description || '' }}></div>
               </div>
               
            
               <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 h-fit">
                 <h3 className="font-bold text-lg mb-4">Check Availability</h3>
                 <div className="space-y-4">
                    {/* Date Picker */}
                    <div className="space-y-2">
                      <Label>Check-in - Check-out</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal bg-white">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formatDateRange()}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="range"
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={2}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Guest Selector */}
                    <div className="space-y-2">
                      <Label>Guests</Label>
                      <Popover open={isGuestPopoverOpen} onOpenChange={setIsGuestPopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal bg-white">
                            <User className="mr-2 h-4 w-4" />
                            {guests.rooms} Room, {guests.adults} Adults, {guests.children} Children
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                           <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Room</span>
                                <div className="flex items-center gap-2">
                                  <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setGuests(p => ({...p, rooms: Math.max(1, p.rooms - 1)}))}>-</Button>
                                  <span className="w-8 text-center">{guests.rooms}</span>
                                  <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setGuests(p => ({...p, rooms: p.rooms + 1}))}>+</Button>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Adults</span>
                                <div className="flex items-center gap-2">
                                  <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setGuests(p => ({...p, adults: Math.max(1, p.adults - 1)}))}>-</Button>
                                  <span className="w-8 text-center">{guests.adults}</span>
                                  <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setGuests(p => ({...p, adults: p.adults + 1}))}>+</Button>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Children</span>
                                <div className="flex items-center gap-2">
                                  <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setGuests(p => ({...p, children: Math.max(0, p.children - 1)}))}>-</Button>
                                  <span className="w-8 text-center">{guests.children}</span>
                                  <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setGuests(p => ({...p, children: p.children + 1}))}>+</Button>
                                </div>
                              </div>
                           </div>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <Button className="w-full" onClick={handleSearch}>
                        <Search className="w-4 h-4 mr-2" />
                        Change Search
                    </Button>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center text-sm mb-2">
                         <span className="text-gray-500">Duration</span>
                         <span className="font-semibold">{nights} Nights</span>
                      </div>
                    </div>
                 </div>
               </div>
             </div>

             {/* Booking Table */}
             <div className="mt-8">
               <h2 className="text-2xl font-bold mb-6">Select Rooms</h2>
               <BookingTable 
                 roomTypes={roomTypes} 
                 quantities={quantities} 
                 nights={nights} 
                 onUpdateQuantity={updateQuantity} 
               />
             </div>

             {/* Reviews */}
             <div className="mt-12 pt-8 border-t border-gray-100">
                <ReviewList hotelId={hotel.id} />
             </div>
           </div>
        </div>
      </div>

      {/* Floating Booking Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] z-50">
         <div className="container mx-auto flex items-center justify-between flex-col md:flex-row gap-5">
            <div className="flex flex-col">
               <span className="text-sm text-gray-500">Total Price</span>
               {totalSelectedRooms > 0 ? (
                  <div className="flex items-baseline gap-2">
                     <span className="text-2xl font-bold text-primary">{formatCurrency(totalPrice)}</span>
                     <span className="text-sm text-gray-600">for {totalSelectedRooms} rooms</span>
                  </div>
               ) : (
                  <span className="text-xl font-bold text-gray-400">Please select rooms</span>
               )}
            </div>
            
            <Button 
               size="lg" 
               className={cn(
                 "min-w-[200px] text-lg font-semibold transition-all",
                 totalSelectedRooms > 0 ? "bg-primary hover:bg-primary/90" : "bg-gray-200 text-gray-400 hover:bg-gray-200 cursor-not-allowed"
               )}
               onClick={handleBookNow}
            >
               {totalSelectedRooms > 0 ? (
                  <>Book Now <span className="ml-2 text-sm opacity-80">({totalSelectedRooms} rooms)</span></>
               ) : (
                  "Will book"
               )}
            </Button>
         </div>
      </div>
    </div>
  );
}
