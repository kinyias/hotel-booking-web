import { format } from "date-fns";
import { Star, MapPin, Calendar } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Hotel } from "@/features/hotels/types";

interface BookingHotelCardProps {
  hotel: Hotel;
  checkIn: string;
  checkOut: string;
}

export const BookingHotelCard = ({ hotel, checkIn, checkOut }: BookingHotelCardProps) => {
  const formatDate = (dateStr: string) => format(new Date(dateStr), "EEE, dd MMM yyyy");

  return (
    <Card className="shadow-lg border-0 overflow-hidden p-0">
      <div className="relative h-48 w-full">
        <Image 
          src={hotel.images[0].url} 
          alt={hotel.name} 
          fill 
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-end p-6">
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-1">{hotel.name}</h2>
            <div className="flex items-center gap-4 text-sm opacity-90">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {hotel.address}
              </div>
            </div>
          </div>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="flex-1 space-y-1">
            <p className="text-sm text-gray-500">Check-in</p>
            <p className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              {formatDate(checkIn)}
            </p>
            <p className="text-sm text-gray-500 pl-7">After 14:00</p>
          </div>
          <div className="hidden md:block w-px bg-gray-200"></div>
          <div className="flex-1 space-y-1">
            <p className="text-sm text-gray-500">Check-out</p>
            <p className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              {formatDate(checkOut)}
            </p>
            <p className="text-sm text-gray-500 pl-7">Before 12:00</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
