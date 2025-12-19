"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PageTitle from "@/components/sections/PageTitle";
import BookingFilter from "@/components/booking/BookingFilter";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { MapPin, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePublicHotelsQuery } from "@/features/hotels/queries";
import EllipsisPagination from "@/components/ui/EllipsisPagination";
import { formatCurrency } from "@/utils/currency";

const MAX_PRICE = 50000000;
const STEP_PRICE = 10000;
const PAGE_LIMIT = 12;

export function HotelSearch() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Extract URL parameters
  const urlMinPrice = searchParams.get('minPrice');
  const urlMaxPrice = searchParams.get('maxPrice');
  const urlCheckIn = searchParams.get('check_in');
  const urlCheckOut = searchParams.get('check_out');
  const urlCity = searchParams.get('city');
  
  const [priceRange, setPriceRange] = useState<[number, number]>([
    urlMinPrice ? Number(urlMinPrice) : 0,
    urlMaxPrice ? Number(urlMaxPrice) : MAX_PRICE
  ]);
  const [page, setPage] = useState(1);
  
  // Fetch public hotels with URL params
  const { data: hotelsData, isLoading } = usePublicHotelsQuery({
    page,
    limit: PAGE_LIMIT,
    minPrice: urlMinPrice ? Number(urlMinPrice) : undefined,
    maxPrice: urlMaxPrice ? Number(urlMaxPrice) : undefined,
    checkIn: urlCheckIn || undefined,
    checkOut: urlCheckOut || undefined,
    city: urlCity || undefined,
  });
  
  const hotels = hotelsData?.data || [];
  const meta = hotelsData?.meta;
  const totalPages = meta ? Math.ceil(meta.total / meta.limit) : 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Update price params
    if (priceRange[0] > 0) {
      params.set('minPrice', priceRange[0].toString());
    } else {
      params.delete('minPrice');
    }
    
    if (priceRange[1] < MAX_PRICE) {
      params.set('maxPrice', priceRange[1].toString());
    } else {
      params.delete('maxPrice');
    }
    
    router.push(`/hotels?${params.toString()}`);
  };

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
                <h4 className="font-semibold mb-4 text-gray-700">Price Per Night (Min)</h4>
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
                <Button 
                  onClick={handleApplyFilters}
                  className="w-full mt-4 bg-primary hover:bg-primary/90"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Hotel List */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {isLoading ? 'Loading hotels...' : `${meta?.total || 0} Hotels Found`}
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Sort by:</span>
                <select className="bg-white border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary">
                  <option>Recommended</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : hotels.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No hotels found</h3>
                <p className="text-gray-500">Try adjusting your filters to find what you're looking for.</p>
                <Button 
                  variant="link" 
                  onClick={() => {
                    setPriceRange([0, MAX_PRICE]);
                  }}
                  className="mt-4 text-primary font-bold"
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              hotels.map((hotel) => {
                return (
                  <div key={hotel.id} className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col md:flex-row h-auto md:h-64">
                    {/* Image Section */}
                    <div className="relative w-full md:w-1/3 min-h-[200px] md:min-h-full">
                    <Link href={`/hotels/${hotel.id}`}>
                      <Image 
                        src={hotel.images[0]?.url || '/placeholder.jpg'} 
                        alt={hotel.name} 
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        {/* Header: Name */}
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <Link href={`/hotels/${hotel.id}`}>
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                              {hotel.name}
                            </h3>
                            </Link>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
                          <MapPin className="w-4 h-4" />
                          <span>{hotel.address}</span>
                        </div>

                      
                        
                       <div className="text-gray-600 text-sm line-clamp-2">
                          <div dangerouslySetInnerHTML={{ __html: hotel.description! }} />
                       </div>
                      </div>

                      {/* Footer: Price & Action */}
                      <div className="flex items-end justify-between mt-4 pt-4 border-t border-gray-50">
                         <div className="flex flex-col">
                            <span className="text-xs text-gray-500">From</span>
                            <div className="flex items-baseline gap-1">
                               <span className="text-2xl font-bold text-primary">{formatCurrency(hotel.minPrice ?? 0)}</span>
                               <span className="text-sm text-gray-500">/night</span>
                            </div>
                         </div>
                         <Link href={`/hotels/${hotel.id}`}>
                         <Button className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[120px]">
                           View Details
                         </Button>
                         </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <EllipsisPagination 
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
