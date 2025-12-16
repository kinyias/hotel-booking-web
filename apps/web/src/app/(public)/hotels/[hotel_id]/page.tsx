"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { format, differenceInDays, addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { 
  Star, 
  MapPin, 
  Wifi, 
  Car, 
  Utensils, 
  Check, 
  User,
  Calendar as CalendarIcon,
  Info
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PageTitle from "@/components/sections/PageTitle";
import { Hotel, RoomType } from "@/features/hotels/types";
import { cn } from "@/lib/utils";

// --- Mock Data ---

const MOCK_HOTEL: Hotel = {
  hotel_id: 'h1',
  owner_id: 'o1',
  name: 'Grand Luxury Hotel',
  address: '123 Main St, New York, NY',
  description: 'Experience world-class service and luxury at Grand Luxury Hotel. Located in the heart of the city, we offer breath-taking views, exquisite dining, and a spa that rejuvenates your soul. Perfect for business and leisure travelers alike.',
  star: 5,
  phone: '+1 234 567 890',
  status: 'ACTIVE',
  images: [
    { image_id: 'i1', hotel_id: 'h1', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80' },
    { image_id: 'i2', hotel_id: 'h1', url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80' },
  ]
};

const MOCK_ROOM_TYPES: RoomType[] = [
  { type_id: 'rt1', hotel_id: 'h1', name: 'Standard Room', price_per_night: 3000000, max_guests: 2, description: 'Cozy and comfortable room with all basic amenities.' },
  { type_id: 'rt2', hotel_id: 'h1', name: 'Deluxe Room', price_per_night: 4500000, max_guests: 2, description: 'Spacious room with a beautiful city view and premium bedding.' },
  { type_id: 'rt3', hotel_id: 'h1', name: 'Executive Suite', price_per_night: 7500000, max_guests: 3, description: 'Luxury suite with a separate living area and executive lounge access.' },
  { type_id: 'rt4', hotel_id: 'h1', name: 'Family Suite', price_per_night: 9000000, max_guests: 4, description: 'Perfect for families, featuring two bedrooms and a kitchenette.' },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

export default function HotelDetailPage() {
  const params = useParams();
  
  // Filter States
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 1),
  });
  const [guests, setGuests] = useState({ rooms: 1, adults: 2, children: 0 });
  const [isGuestPopoverOpen, setIsGuestPopoverOpen] = useState(false);

  // Booking State
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // Derived Values
  const nights = date?.from && date?.to ? Math.max(1, (differenceInDays(date.to, date.from)+1)) : 1;
  const totalSelectedRooms = Object.values(quantities).reduce((acc, q) => acc + q, 0);
  const totalPrice = MOCK_ROOM_TYPES.reduce((acc, type) => {
    return acc + (quantities[type.type_id] || 0) * type.price_per_night * nights;
  }, 0);

  const updateQuantity = (typeId: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[typeId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [typeId]: next };
    });
  };

  const formatDateRange = () => {
    if (!date?.from) return "Select dates";
    if (date.to) return `${format(date.from, "dd/MM/yyyy")} - ${format(date.to, "dd/MM/yyyy")}`;
    return format(date.from, "dd/MM/yyyy");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32"> {/* Added padding bottom for fixed booking bar */}
      <PageTitle 
        title={MOCK_HOTEL.name}
        description="Detail Hotel Information"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Hotels", href: "/hotels" },
          { label: MOCK_HOTEL.name, href: `/hotels/${params.hotel_id}` },
        ]} 
      />

      <div className="container mx-auto px-4 -mt-10 relative z-20 mb-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Main Hotel Image */}
          <div className="relative h-[400px] w-full">
            <Image 
              src={MOCK_HOTEL.images[0].url} 
              alt={MOCK_HOTEL.name} 
              fill 
              className="object-cover"
              priority
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                       <div className="flex">
                          {Array.from({ length: MOCK_HOTEL.star }).map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                          ))}
                       </div>
                       <span className="text-white/80 text-sm bg-white/20 px-2 py-0.5 rounded backdrop-blur-sm">Hotel</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">{MOCK_HOTEL.name}</h1>
                    <div className="flex items-center gap-2 text-white/90">
                       <MapPin className="w-5 h-5" />
                       <span className="text-lg">{MOCK_HOTEL.address}</span>
                    </div>
                  </div>
                </div>
            </div>
          </div>
          
           {/* Description & Amenities */}
           <div className="p-8">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
               <div className="lg:col-span-2">
                 <h2 className="text-2xl font-bold mb-4 text-gray-900">About this hotel</h2>
                 <p className="text-gray-600 leading-relaxed mb-6">{MOCK_HOTEL.description}</p>
                 <h3 className="font-semibold text-lg mb-3">Popular Amenities</h3>
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                   <div className="flex items-center gap-2 text-gray-600"><Wifi className="w-5 h-5 text-primary" /><span>Free Wifi</span></div>
                   <div className="flex items-center gap-2 text-gray-600"><Car className="w-5 h-5 text-primary" /><span>Free Parking</span></div>
                   <div className="flex items-center gap-2 text-gray-600"><Utensils className="w-5 h-5 text-primary" /><span>Restaurant</span></div>
                   <div className="flex items-center gap-2 text-gray-600"><Check className="w-5 h-5 text-primary" /><span>24h Service</span></div>
                 </div>
               </div>
               
               {/* Filters Section (Top Right / Sidebar feel on Desktop) */}
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
               <div className="bg-white rounded-lg border overflow-hidden">
                 <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="w-[40%]">Room Type</TableHead>
                        <TableHead className="text-center">Max Guests</TableHead>
                        <TableHead className="text-right">Price per Night</TableHead>
                        <TableHead className="text-right">Total ({nights} nights)</TableHead>
                        <TableHead className="text-center w-[150px]">Quantity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_ROOM_TYPES.map((type) => {
                        const quantity = quantities[type.type_id] || 0;
                        const totalPriceForType = type.price_per_night * nights;
                        
                        return (
                          <TableRow key={type.type_id}>
                            <TableCell>
                               <div>
                                  <p className="font-bold text-gray-900">{type.name}</p>
                                  <p className="text-sm text-gray-500 line-clamp-1">{type.description}</p>
                                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                    <span className="flex items-center gap-1"><Info className="w-3 h-3" /> Non-refundable</span>
                                    <span className="flex items-center gap-1 text-green-600"><Check className="w-3 h-3" /> Breakfast included</span>
                                  </div>
                               </div>
                            </TableCell>
                            <TableCell className="text-center">
                               <div className="flex items-center justify-center gap-1">
                                  <User className="w-4 h-4 text-gray-400" />
                                  <span>x {type.max_guests}</span>
                               </div>
                            </TableCell>
                            <TableCell className="text-right font-medium text-gray-600">
                               {formatCurrency(type.price_per_night)}
                            </TableCell>
                            <TableCell className="text-right">
                               <span className="font-bold text-primary">
                                  {formatCurrency(totalPriceForType)}
                               </span>
                            </TableCell>
                            <TableCell>
                               <div className="flex items-center justify-center gap-2">
                                  <Button 
                                    size="icon" 
                                    variant="outline" 
                                    className="h-8 w-8" 
                                    disabled={quantity === 0}
                                    onClick={() => updateQuantity(type.type_id, -1)}
                                  >
                                    -
                                  </Button>
                                  <span className="w-8 text-center font-medium">{quantity}</span>
                                  <Button 
                                    size="icon" 
                                    variant="outline" 
                                    className="h-8 w-8"
                                    onClick={() => updateQuantity(type.type_id, 1)}
                                  >
                                    +
                                  </Button>
                               </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                 </Table>
               </div>
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
