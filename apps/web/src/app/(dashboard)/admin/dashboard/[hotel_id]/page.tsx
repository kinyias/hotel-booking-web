'use client'
import { CustomerReviews } from "@/components/dashboard/CustomerReviews";
import { NewestBooking } from "@/components/dashboard/NewestBooking";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "next/navigation";

export default function HotelDashboardPage() {
     const params = useParams();
     const hotelId = params.hotel_id as string;
    return (
          <div className='m-4 md:m-6'>
      <div className="block pb-5">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Revenue</CardTitle>
                  <CardDescription>Revenue chart</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <RevenueChart hotelId={hotelId} />
                </CardContent>
              </Card>
            </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Reviews */}
          <CustomerReviews hotelId={hotelId} />
          {/* Newest Booking */}
          <NewestBooking hotelId={hotelId} />
        </div>
    </div>
  );
}