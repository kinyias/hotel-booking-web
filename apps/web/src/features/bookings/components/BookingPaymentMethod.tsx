import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BookingPaymentMethodProps {
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
}

export const BookingPaymentMethod = ({ paymentMethod, setPaymentMethod }: BookingPaymentMethodProps) => {
  return (
    <Card className="shadow-sm border border-gray-100">
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <RadioGroupItem value="momo" id="momo" className="peer sr-only" />
            <Label
              htmlFor="momo"
              className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <div className="mb-3 h-12 w-12 relative">
                <div className="w-full h-full bg-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">MoMo</div>
              </div>
              <div className="text-center font-semibold">MoMo Wallet</div>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem value="vnpay" id="vnpay" className="peer sr-only" />
            <Label
              htmlFor="vnpay"
              className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <div className="mb-3 h-12 w-12 relative">
                <div className="w-full h-full bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">VNPay</div>
              </div>
              <div className="text-center font-semibold">VNPay QR</div>
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
