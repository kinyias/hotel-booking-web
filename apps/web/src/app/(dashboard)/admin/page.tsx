import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import DashboardStats from '@/components/dashboard/DashboardStats';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { NewestBooking } from '@/components/dashboard/NewestBooking';
import { CustomerReviews } from '@/components/dashboard/CustomerReviews';
function DashboardPage() {
  return (
    <div className='m-4 md:m-6'>
      <DashboardStats />
      <div className="block pb-5">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Revenue</CardTitle>
                  <CardDescription>Revenue chart</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <RevenueChart />
                </CardContent>
              </Card>
            </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Reviews */}
          <CustomerReviews />
          {/* Newest Booking */}
          <NewestBooking />
        </div>
    </div>
  );
}

export default DashboardPage;
