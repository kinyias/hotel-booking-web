import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoomType } from "@/features/room-types/types";

interface BookingRoomListProps {
  rooms: { type: RoomType; quantity: number }[];
}

export const BookingRoomList = ({ rooms }: BookingRoomListProps) => {
  const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  return (
    <Card className="shadow-sm border border-gray-100">
      <CardHeader>
        <CardTitle>Room Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {rooms.map((item, index) => (
          <div key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4 border-b last:border-0 border-gray-100">
            <div>
              <h4 className="font-bold text-gray-900 text-lg">{item.type.name}</h4>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {item.type.max_guests} Guests</span>
                <span>Quantity: {item.quantity}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Price per night</p>
              <p className="font-semibold text-gray-900">{formatCurrency(item.type.price_per_night)}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
