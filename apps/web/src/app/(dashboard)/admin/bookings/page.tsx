"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Loader2, 
  Search,
  Building,
  Eye,
  MapPin
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
import  EllipsisPagination  from "@/components/ui/EllipsisPagination";

import { useHotelsQuery } from "@/features/hotels/queries";

export default function BookingsHotelListPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  
  const { data: hotelsResponse, isLoading } = useHotelsQuery({ 
      page, 
      limit: 10,
      q: search 
  });
  
  const hotels = hotelsResponse?.data || [];
  const meta = hotelsResponse?.meta;
  return (
    <div className="container mx-auto">

      {/* Filter & Search */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100 mt-5">
         <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
               placeholder="Search hotels..." 
               className="pl-9"
               value={search}
               onChange={(e) => {
                   setSearch(e.target.value);
                   setPage(1);
               }}
            />
         </div>
      </div>

      {/* Hotels Table */}
      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm mt-5">
         <Table>
            <TableHeader className="bg-gray-50/50">
               <TableRow>
                  <TableHead className="w-[300px]">Hotel Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {isLoading ? (
                  <TableRow>
                     <TableCell colSpan={3} className="h-40 text-center">
                        <div className="flex justify-center items-center">
                           <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                     </TableCell>
                  </TableRow>
               ) : hotels.length > 0 ? (
                  hotels.map((hotel) => (
                     <TableRow key={hotel.id} className="hover:bg-gray-50/50 cursor-pointer" onClick={() => router.push(`/admin/bookings/${hotel.id}`)}>
                        <TableCell>
                           <div className="flex flex-col">
                              <span className="font-bold text-gray-900">{hotel.name}</span>
                              <span className="text-xs text-gray-500">{hotel.city}, {hotel.country}</span>
                           </div>
                        </TableCell>
                        <TableCell>
                           <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-sm truncate max-w-[300px]">{hotel.address}</span>
                           </div>
                        </TableCell>
                        <TableCell className="text-right">
                           <Button 
                              size="sm" 
                              variant="outline" 
                              className="gap-2"
                              onClick={(e) => {
                                 e.stopPropagation();
                                 router.push(`/admin/bookings/${hotel.id}`);
                              }}
                           >
                              <Eye className="w-4 h-4" />
                              View Bookings
                           </Button>
                        </TableCell>
                     </TableRow>
                  ))
               ) : (
                  <TableRow>
                     <TableCell colSpan={3} className="h-40 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                           <Building className="w-8 h-8 text-gray-300" />
                           <p>No hotels found matching your search.</p>
                        </div>
                     </TableCell>
                  </TableRow>
               )}
            </TableBody>
         </Table>
      </div>

      {/* Pagination */}
      {meta && (
        <div className="flex justify-center mt-4">
          <EllipsisPagination 
            currentPage={page}
            totalPages={meta.total}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
