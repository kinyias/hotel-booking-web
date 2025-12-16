import BookingPayment from "@/features/bookings/components/BookingPayment";
import { Suspense } from "react";

export default function BookingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingPayment />
    </Suspense>
  );
}