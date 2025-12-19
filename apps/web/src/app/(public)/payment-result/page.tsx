import { PaymentResult } from "@/features/bookings/components/PaymentResult";
import { Suspense } from "react";


export default function PaymentResultPage() {
  return (
    <Suspense>
        <PaymentResult/>
    </Suspense>
  )
}