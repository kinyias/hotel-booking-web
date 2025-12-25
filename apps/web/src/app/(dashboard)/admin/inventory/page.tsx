"use client"

import * as React from "react"
import { format, addDays } from "date-fns"
import { Calendar as CalendarIcon, Plus } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { useHotelsQuery } from "@/features/hotels/queries"
import { useQueryRoomTypes } from "@/features/room-types/queries"
import { useQueryInventory } from "@/features/inventory/queries"
import { CalendarInventory } from "@/features/inventory/components/CalendarInventory"
import { Inventory } from "@/features/inventory/types"
import { CreateInventoryDialog } from "@/features/inventory/components/CreateInventoryDialog"

export default function InventoryPage() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 30),
  })
  const [selectedHotelId, setSelectedHotelId] = React.useState<string>("")
  const [selectedRoomTypeId, setSelectedRoomTypeId] = React.useState<string>("")
  const [includeStopped, setIncludeStopped] = React.useState<boolean>(false)

  // Fetch Hotels
  const { data: hotelsData, isLoading: isLoadingHotels } = useHotelsQuery()
  const hotels = hotelsData?.data

  // Fetch Room Types (dependent on hotel)
  const { data: roomTypesData, isLoading: isLoadingRoomTypes } = useQueryRoomTypes(
    selectedHotelId,
    !!selectedHotelId
  )
  const roomTypes = roomTypesData?.data

  const fromDateStr = date?.from ? format(date.from, "yyyy-MM-dd") : ""
  const toDateStr = date?.to ? format(date.to, "yyyy-MM-dd") : ""

  const { data: inventoryData, isLoading: isLoadingInventory } = useQueryInventory(
    selectedHotelId,
    {
      from: fromDateStr,
      to: toDateStr,
      roomTypeId: selectedRoomTypeId,
      includeStopped,
    }
  )

  // Effect to auto-select first hotel if none selected
  // React.useEffect(() => {
  //   if (hotels && hotels.length > 0 && !selectedHotelId) {
  //     setSelectedHotelId(hotels[0].id)
  //   }
  // }, [hotels, selectedHotelId])

  // Effect to auto-select first room type if none selected
  React.useEffect(() => {
    if (roomTypes && roomTypes.length > 0) {
       if (!selectedRoomTypeId || !roomTypes.find(rt => rt.id === selectedRoomTypeId)) {
          setSelectedRoomTypeId(roomTypes[0].id)
       }
    } else {
        if (roomTypes && roomTypes.length === 0) {
            setSelectedRoomTypeId("")
        }
    }
  }, [roomTypes, selectedRoomTypeId])

  return (
    <div className="flex flex-col h-full space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
         <CreateInventoryDialog 
             hotelId={selectedHotelId} 
             trigger={
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={!selectedHotelId}>
                  <Plus size={20} className="mr-2" />
                  Create Inventory
                </Button>
             }
         />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-6">
            {/* Date Range Picker */}
            <div className="flex flex-col space-y-2">
              <Label>Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-[300px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Hotel Select */}
            <div className="flex flex-col space-y-2 min-w-[200px]">
              <Label>Hotel</Label>
              <Select value={selectedHotelId} onValueChange={setSelectedHotelId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Hotel" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingHotels ? (
                    <div className="p-2 text-sm text-muted-foreground">Loading hotels...</div>
                  ) : hotels?.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">No hotels found</div>
                  ) : (
                    hotels?.map((hotel) => (
                      <SelectItem key={hotel.id} value={hotel.id}>
                        {hotel.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Room Type Select */}
            <div className="flex flex-col space-y-2 min-w-[200px]">
              <Label>Room Type</Label>
              <Select 
                value={selectedRoomTypeId} 
                onValueChange={setSelectedRoomTypeId} 
                disabled={!selectedHotelId || isLoadingRoomTypes}
              >
                <SelectTrigger>
                  <SelectValue placeholder={!selectedHotelId ? "Select Hotel First" : "Select Room Type"} />
                </SelectTrigger>
                <SelectContent>
                 {isLoadingRoomTypes ? (
                    <div className="p-2 text-sm text-muted-foreground">Loading room types...</div>
                 ) : roomTypes?.length === 0 ? (
                     <div className="p-2 text-sm text-muted-foreground">No room types found</div>
                 ) : (
                    roomTypes?.map((rt) => (
                      <SelectItem key={rt.id} value={rt.id}>
                        {rt.name}
                      </SelectItem>
                    ))
                 )}
                </SelectContent>
              </Select>
            </div>

            {/* Include Stopped Switch */}
            <div className="flex items-center space-x-2 pb-2">
              <Switch
                id="include-stopped"
                checked={includeStopped}
                onCheckedChange={setIncludeStopped}
              />
              <Label htmlFor="include-stopped">Include Stopped</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Area */}
      <div className="flex-1">
        {!selectedHotelId ? (
             <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed text-muted-foreground">
                Please select a hotel to view inventory.
             </div>
        ) : !selectedRoomTypeId ? (
             <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed text-muted-foreground">
                Please select a room type to view inventory.
             </div>
        ) : (
            <Card className="h-full border-none shadow-none bg-transparent">
                <CardHeader className="px-0 pt-0">
                    <CardTitle>Calendar Inventory</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                   <CalendarInventory 
                      date={date} 
                      inventoryData={inventoryData as Inventory[]} 
                      isLoading={isLoadingInventory} 
                   />
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  )
}
