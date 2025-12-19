"use client";

import { Info, Check, User } from "lucide-react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RoomType, RoomTypeAvailable } from "@/features/room-types/types";
import { formatCurrency } from "@/utils/currency";

interface BookingTableProps {
  roomTypes: RoomTypeAvailable[];
  quantities: Record<string, number>;
  nights: number;
  onUpdateQuantity: (typeId: string, delta: number, availableRooms: number) => void;
}

export const BookingTable = ({ 
  roomTypes, 
  quantities, 
  nights, 
  onUpdateQuantity 
}: BookingTableProps) => {
  return (
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
          {roomTypes.map((type) => {
            const quantity = quantities[type.id] || 0;
            const totalPriceForType = type.price_per_night * nights;
            
            return (
              <TableRow key={type.id}>
                <TableCell>
                  <div>
                    <p className="font-bold text-gray-900">{type.name}</p>
                    <p className="text-sm text-gray-500 line-clamp-1">{type.description}</p>
                    {type.availableRooms === 0 ? ( <p className="text-sm text-red-600 font-bold">Fully booked</p>): ( <p className="text-sm text-red-600 font-bold">Only {type.availableRooms} rooms left</p>)}
                     
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Info className="w-3 h-3" /> Non-refundable
                      </span>
                      {type.amenities?.map((item) => {
                          const IconComponent = (Icons as any)[item.amenity.key];
                        return (
                          <span key={item.amenityId || Math.random()} className="flex items-center gap-1">
                            {IconComponent && <IconComponent className="w-3 h-3" />}
                            {item.amenity.label}
                          </span>
                        );
                      })}
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
                      onClick={() => onUpdateQuantity(type.id, -1,type.availableRooms)}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center font-medium">{quantity}</span>
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="h-8 w-8"
                      disabled={quantity >= type.availableRooms}
                      onClick={() => onUpdateQuantity(type.id, 1, type.availableRooms)}
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
  );
};