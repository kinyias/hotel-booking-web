"use client"

import * as React from "react"
import { format, eachDayOfInterval, startOfDay, isSameDay } from "date-fns"
import { Ban } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Inventory } from "@/features/inventory/types"

import { UpdateInventoryDialog } from "./UpdateInventoryDialog"

interface CalendarInventoryProps {
    date: DateRange | undefined;
    inventoryData: Inventory[] | undefined;
    isLoading?: boolean;
}

export const CalendarInventory = ({ date, inventoryData, isLoading }: CalendarInventoryProps) => {
    const [selectedInventory, setSelectedInventory] = React.useState<Inventory | null>(null)

    // Generate days for calendar view
    const days = React.useMemo(() => {
        if (!date?.from || !date?.to) return []
        return eachDayOfInterval({ start: date.from, end: date.to })
    }, [date])

    // Helper to find inventory for a day
    const getInventoryForDate = (day: Date) => {
        if (!inventoryData) return undefined
        // Ensure inventoryData is treated as an array
        const data = Array.isArray(inventoryData) ? inventoryData : (inventoryData as any)?.data || [];
        return (data as Inventory[]).find((inv) => isSameDay(new Date(inv.date), day))
    }

    if (!date?.from || !date?.to) {
         return <div className="p-4 text-center text-muted-foreground">Please select a date range</div>
    }
  
    if (isLoading) {
        return <div className="p-4 text-center text-muted-foreground">Loading inventory...</div>
    }

    return (
        <ScrollArea className="h-[calc(100vh-400px)] rounded-md border p-4">
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
                {days.map((day, index) => {
                    const inventory = getInventoryForDate(day);
                    const isPast = day < startOfDay(new Date());
                    const hasInventory = !!inventory;
                    
                    return (
                        <div 
                            key={index} 
                            onClick={() => hasInventory && setSelectedInventory(inventory)}
                            className={cn(
                                "flex flex-col border rounded-lg p-4 min-h-[120px] transition-colors",
                                isPast ? "bg-muted/50" : "bg-card",
                                inventory?.stopSell ? "border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/50" : "hover:border-primary/50",
                                hasInventory ? "cursor-pointer" : ""
                            )}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className={cn(
                                    "text-lg font-semibold",
                                    isPast && "text-muted-foreground"
                                )}>
                                    {format(day, "MMM d")}
                                </span>
                                <span className="text-xs text-muted-foreground uppercase">
                                    {format(day, "EEE")}
                                </span>
                            </div>

                            <div className="mt-auto flex flex-col gap-1 items-center justify-center text-center">
                               {hasInventory ? (
                                   <>
                                     {inventory.stopSell && (
                                         <div className="flex items-center text-red-600 dark:text-red-400 text-xs font-medium mb-1">
                                             <Ban className="w-3 h-3 mr-1" />
                                             Stopped
                                         </div>
                                     )}
                                     <div className={cn(
                                         "text-2xl font-bold font-mono",
                                         inventory.availableRooms === 0 ? "text-red-500" : "text-primary"
                                     )}>
                                         {inventory.availableRooms}
                                         <span className="text-sm text-muted-foreground font-normal ml-1">
                                             / {inventory.totalRooms}
                                         </span>
                                     </div>
                                     <span className="text-xs text-muted-foreground">Available</span>
                                   </>
                               ) : (
                                   <div className="text-muted-foreground text-sm italic">
                                       No Data
                                   </div>
                               )}
                            </div>
                        </div>
                    )
                })}
             </div>
             {selectedInventory && (
                <UpdateInventoryDialog
                    inventory={selectedInventory}
                    open={!!selectedInventory}
                    onOpenChange={(open) => !open && setSelectedInventory(null)}
                />
             )}
        </ScrollArea>
    )
}