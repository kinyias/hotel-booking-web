import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RoomType } from "@/features/room-types/types";
import { formatCurrency } from "@/utils/currency";

interface BookingSummaryProps {
  bookedRooms: { type: RoomType; quantity: number }[];
  finalPrice: number;
  discountAmount?: number;
  onConfirm?: () => void;
  isPending?: boolean;
}

export const BookingSummary = ({ bookedRooms, finalPrice, discountAmount = 0, onConfirm, isPending }: BookingSummaryProps) => {
  const subTotal = finalPrice + discountAmount;

  return (
    <div className="sticky top-8 space-y-6">
      <Card className="shadow-lg border-primary/10">
        <CardHeader className="bg-gray-50/50 pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Booking Summary</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 py-0 space-y-4">
          <div className="space-y-2 text-sm">
            {bookedRooms.map((item, idx) => (
              <div key={idx} className="flex justify-between text-gray-600">
                <span>{item.type.name} x {item.quantity}</span>
                <span>{formatCurrency(item.type.price_per_night * item.quantity)}</span>
              </div>
            ))}
          </div>
          
          <Separator />
          
          <div className="space-y-2 pt-2">
             <div className="flex justify-between items-center text-gray-600 font-medium">
               <span>Subtotal</span>
               <span>{formatCurrency(subTotal)}</span>
             </div>
             {discountAmount > 0 && (
               <div className="flex justify-between items-center text-green-600 font-medium">
                 <span>Discount</span>
                 <span>- {formatCurrency(discountAmount)}</span>
               </div>
             )}
          </div>
          
          <Separator />
          
          <div className="flex justify-between items-center pt-2">
            <span className="font-bold text-lg text-gray-900">Total Price</span>
            <span className="font-bold text-2xl text-primary">{formatCurrency(finalPrice)}</span>
          </div>
        </CardContent>
        <div className="p-6 pt-0">
          <Button 
            className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "Processing..." : 'Confirm Booking'}
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
