import { HotelSearch } from "@/features/hotels/components/HotelSearch";
import { Suspense } from "react";

export default function HotelsPage() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <HotelSearch />
      </Suspense>
    )
}
