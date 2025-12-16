"use client";

import { useState } from "react";
import PageTitle from "@/components/sections/PageTitle";
import BookingFilter from "@/components/booking/BookingFilter";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Star, MapPin, Wifi, Car, Utensils } from "lucide-react";
import Image from "next/image";
import { Hotel, RoomType } from "@/features/hotels/types";

// Mock Data with VND prices
const MOCK_ROOM_TYPES: RoomType[] = [
  { type_id: 'rt1', hotel_id: 'h1', name: 'Standard Room', price_per_night: 3000000, max_guests: 2, description: 'Cozy room for two' },
  { type_id: 'rt2', hotel_id: 'h1', name: 'Deluxe Room', price_per_night: 4500000, max_guests: 2, description: 'Spacious room with city view' },
  { type_id: 'rt3', hotel_id: 'h2', name: 'Suite', price_per_night: 7500000, max_guests: 4, description: 'Luxury suite' },
  { type_id: 'rt4', hotel_id: 'h3', name: 'Family Room', price_per_night: 6250000, max_guests: 4, description: 'Perfect for families' },
  { type_id: 'rt5', hotel_id: 'h4', name: 'Penthouse', price_per_night: 20000000, max_guests: 6, description: 'Top floor luxury' },
];

const MOCK_HOTELS: (Hotel & { room_types: RoomType[] })[] = [
  {
    hotel_id: 'h1',
    owner_id: 'o1',
    name: 'Grand Luxury Hotel',
    address: '123 Main St, New York, NY',
    description: 'Experience world-class service and luxury at Grand Luxury Hotel. Located in the heart of the city.',
    star: 5,
    phone: '+1 234 567 890',
    status: 'ACTIVE',
    images: [{ image_id: 'i1', hotel_id: 'h1', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' }],
    room_types: [MOCK_ROOM_TYPES[0], MOCK_ROOM_TYPES[1]]
  },
  {
    hotel_id: 'h2',
    owner_id: 'o2',
    name: 'Seaside Resort & Spa',
    address: '456 Beach Rd, Miami, FL',
    description: 'Relax by the ocean with our premium spa services and private beach access.',
    star: 4,
    phone: '+1 987 654 321',
    status: 'ACTIVE',
    images: [{ image_id: 'i2', hotel_id: 'h2', url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' }],
    room_types: [MOCK_ROOM_TYPES[2]]
  },
  {
    hotel_id: 'h3',
    owner_id: 'o3',
    name: 'Mountain View Lodge',
    address: '789 Alpine Way, Denver, CO',
    description: 'Cozy lodge with breathtaking mountain views and easy access to ski slopes.',
    star: 3,
    phone: '+1 555 123 456',
    status: 'ACTIVE',
    images: [{ image_id: 'i3', hotel_id: 'h3', url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' }],
    room_types: [MOCK_ROOM_TYPES[3]]
  },
  {
    hotel_id: 'h4',
    owner_id: 'o4',
    name: 'Urban City Stay',
    address: '101 City Center, Chicago, IL',
    description: 'Modern hotel in the middle of the business district, perfect for business travelers.',
    star: 4,
    phone: '+1 444 888 999',
    status: 'ACTIVE',
    images: [{ image_id: 'i4', hotel_id: 'h4', url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' }],
    room_types: [MOCK_ROOM_TYPES[0]]
  },
  {
    hotel_id: 'h5',
    owner_id: 'o5',
    name: 'Royal Palace Hotel',
    address: '222 King St, London, UK',
    description: 'Live like royalty in this historic palace converted into a luxury hotel.',
    star: 5,
    phone: '+44 20 1234 5678',
    status: 'ACTIVE',
    images: [{ image_id: 'i5', hotel_id: 'h5', url: 'https://images.unsplash.com/photo-1571896349842-6e53ce41e887?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' }],
    room_types: [MOCK_ROOM_TYPES[4], MOCK_ROOM_TYPES[2]]
  }
];

const ROOM_TYPE_FILTERS = ["Standard Room", "Deluxe Room", "Suite", "Family Room", "Penthouse"];
const MAX_PRICE = 50000000;
const STEP_PRICE = 10000;

export default function HotelsPage() {
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);

  const toggleStar = (star: number) => {
    setSelectedStars(prev => 
      prev.includes(star) ? prev.filter(s => s !== star) : [...prev, star]
    );
  };

  const toggleRoomType = (type: string) => {
    setSelectedRoomTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const filteredHotels = MOCK_HOTELS.filter(hotel => {
    // Filter by Stars
    if (selectedStars.length > 0 && !selectedStars.includes(hotel.star)) {
      return false;
    }

    // Filter by Price (Cheapest room price)
    const minPrice = Math.min(...hotel.room_types.map(r => r.price_per_night));
    if (minPrice < priceRange[0] || minPrice > priceRange[1]) {
      return false;
    }

    // Filter by Room Types
    if (selectedRoomTypes.length > 0) {
      const hasRoomType = hotel.room_types.some(r => selectedRoomTypes.includes(r.name));
      if (!hasRoomType) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageTitle 
        title="Our Hotels" 
        description="Discover the perfect stay for your next adventure"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Hotels", href: "/hotels" },
        ]} 
      />
      
      <BookingFilter />

      <div className="container mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-8 h-fit lg:sticky lg:top-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Filters</h3>
              
              {/* Price Range */}
              <div className="mb-8">
                <h4 className="font-semibold mb-4 text-gray-700">Price Per Night</h4>
                <Slider
                  min={0}
                  max={MAX_PRICE}
                  step={STEP_PRICE}
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  className="mb-4"
                />
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="bg-gray-50 px-3 py-1 rounded border border-gray-200">
                    {formatCurrency(priceRange[0])}
                  </div>
                  <span>-</span>
                  <div className="bg-gray-50 px-3 py-1 rounded border border-gray-200">
                     {formatCurrency(priceRange[1])}
                  </div>
                </div>
              </div>

              {/* Star Rating */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-gray-700">Star Rating</h4>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`star-${star}`} 
                        checked={selectedStars.includes(star)}
                        onCheckedChange={() => toggleStar(star)}
                      />
                      <Label htmlFor={`star-${star}`} className="flex items-center gap-1 cursor-pointer">
                        <div className="flex text-yellow-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < star ? "fill-current" : "text-gray-300 fill-none"}`} />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">({star} Stars)</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Room Types */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-700">Room Type</h4>
                <div className="space-y-2">
                  {ROOM_TYPE_FILTERS.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`type-${type}`}
                        checked={selectedRoomTypes.includes(type)}
                        onCheckedChange={() => toggleRoomType(type)}
                      />
                      <Label htmlFor={`type-${type}`} className="text-sm text-gray-600 cursor-pointer">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Hotel List */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredHotels.length} Hotels Found
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Sort by:</span>
                <select className="bg-white border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary">
                  <option>Recommended</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating: High to Low</option>
                </select>
              </div>
            </div>

            {filteredHotels.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No hotels found</h3>
                <p className="text-gray-500">Try adjusting your filters to find what you're looking for.</p>
                <Button 
                  variant="link" 
                  onClick={() => {
                    setSelectedStars([]);
                    setSelectedRoomTypes([]);
                    setPriceRange([0, MAX_PRICE]);
                  }}
                  className="mt-4 text-primary font-bold"
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              filteredHotels.map((hotel) => {
                const minPrice = Math.min(...hotel.room_types.map(r => r.price_per_night));
                
                return (
                  <div key={hotel.hotel_id} className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col md:flex-row h-auto md:h-64">
                    {/* Image Section */}
                    <div className="relative w-full md:w-1/3 min-h-[200px] md:min-h-full">
                      <Image 
                        src={hotel.images[0]?.url || '/placeholder.jpg'} 
                        alt={hotel.name} 
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        {/* Header: Name & Rating */}
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center gap-1 mb-1">
                              {Array.from({ length: hotel.star }).map((_, i) => (
                                <Star key={i} className="w-3 h-3 text-yellow-500 fill-current" />
                              ))}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                              {hotel.name}
                            </h3>
                          </div>
                          {/* Favorite/Share can go here */}
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
                          <MapPin className="w-4 h-4" />
                          <span>{hotel.address}</span>
                        </div>

                         {/* Mini Features/Tags */}
                        <div className="flex flex-wrap gap-3 mb-4">
                          <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                            <Wifi className="w-3 h-3" /> Wifi
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                             <Car className="w-3 h-3" /> Parking
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                             <Utensils className="w-3 h-3" /> Breakfast
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm line-clamp-2">
                           {hotel.description}
                        </p>
                      </div>

                      {/* Footer: Price & Action */}
                      <div className="flex items-end justify-between mt-4 pt-4 border-t border-gray-50">
                         <div className="flex flex-col">
                            <span className="text-xs text-gray-500">From</span>
                            <div className="flex items-baseline gap-1">
                               <span className="text-2xl font-bold text-primary">{formatCurrency(minPrice)}</span>
                               <span className="text-sm text-gray-500">/night</span>
                            </div>
                         </div>
                         <Button className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[120px]">
                           View Details
                         </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            
            {/* Pagination Placeholder */}
            {filteredHotels.length > 0 && (
              <div className="flex justify-center mt-10">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                  <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">1</Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">3</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
