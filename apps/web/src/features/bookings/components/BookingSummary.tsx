import { CreditCard, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RoomType } from "@/features/hotels/types";

interface BookingSummaryProps {
  bookedRooms: { type: RoomType; quantity: number }[];
  finalPrice: number;
  bookingStatus: string;
  paymentMethod: string;
}

export const BookingSummary = ({ bookedRooms, finalPrice, bookingStatus, paymentMethod }: BookingSummaryProps) => {
  const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  const getStatusBadge = (status: string) => {
    switch(status.toUpperCase()) {
      case 'CONFIRMED': return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="w-3 h-3 mr-1" /> Confirmed</Badge>;
      case 'PENDING': return <Badge variant="secondary" className="bg-yellow-500 text-white hover:bg-yellow-600"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      case 'CANCELLED': return <Badge variant="destructive">Cancelled</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="sticky top-8 space-y-6">
      <Card className="shadow-lg border-primary/10">
        <CardHeader className="bg-gray-50/50 pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Payment Summary</CardTitle>
            {getStatusBadge(bookingStatus)}
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2 text-sm">
            {bookedRooms.map((item, idx) => (
              <div key={idx} className="flex justify-between text-gray-600">
                <span>{item.type.name} x {item.quantity}</span>
                <span>{formatCurrency(item.type.price_per_night * item.quantity)}</span>
              </div>
            ))}
            <div className="flex justify-between text-gray-600">
              <span>Taxes & Fees (10%)</span>
              <span>{formatCurrency(finalPrice * 0.1)}</span>
            </div>
          </div>
          <Separator />
          <div className="flex justify-between items-center pt-2">
            <span className="font-bold text-lg text-gray-900">Total Price</span>
            <span className="font-bold text-2xl text-primary">{formatCurrency(finalPrice * 1.1)}</span>
          </div>
        </CardContent>
        <div className="p-6 pt-0">
          <Button className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20">
            Pay with {paymentMethod === 'momo' ? 'MoMo' : 'VNPay'}
          </Button>
          <p className="text-xs text-center text-gray-500 mt-3">
            By proceeding, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </Card>
      
      <div className="bg-blue-50 p-4 rounded-lg flex gap-3 text-blue-700 text-sm">
        <CreditCard className="w-5 h-5 flex-shrink-0" />
        <p>Your payment information is encrypted and secure.</p>
      </div>
    </div>
  );
};
