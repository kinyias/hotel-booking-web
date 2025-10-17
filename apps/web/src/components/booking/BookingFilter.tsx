"use client";
import { useState } from "react";
import { Calendar as CalendarIcon, User, ArrowRight, MapPin } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { DateRange } from "react-day-picker";
import { vi } from "date-fns/locale";

const BookingFilter = () => {
  const [location, setLocation] = useState("");
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [isGuestPopoverOpen, setIsGuestPopoverOpen] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const handleApplyGuests = () => {
    setIsGuestPopoverOpen(false);
  };
  // Format date range for display
  const formatDateRange = () => {
    if (!date?.from) {
      return "Chọn ngày";
    }
    if (date.from && date.to) {
      return `${format(date.from, "dd/MM/yyyy")} - ${format(date.to, "dd/MM/yyyy")}`;
    }
    return format(date.from, "dd/MM/yyyy");
  };

  // Container animation variants
  const containerVariants = {
    hidden: { 
      opacity: 0, 
      y: 50 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <motion.section 
      className="relative -mt-20 z-20 px-4 md:px-6 container mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="bg-primary rounded-lg shadow-2xl p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 items-center">
          {/* Location */}
          <div className="flex items-center gap-4">
            <MapPin className="w-10 h-10 text-primary-foreground opacity-90 flex-shrink-0" />
            <div className="flex-1">
              <label htmlFor="location" className="text-primary-foreground text-sm font-medium mb-1 block">
                Địa điểm
              </label>
              <Input
                id="location"
                type="text"
                placeholder="Bạn muốn đi đâu?"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent border-0 border-b border-primary-foreground/30 rounded-none px-0 text-primary-foreground text-lg font-semibold placeholder:text-primary-foreground/50 focus-visible:ring-0 focus-visible:border-primary-foreground h-auto py-1"
              />
            </div>
          </div>

          {/* Check In - Check Out */}
           <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-4 text-left group cursor-pointer w-full">
                <CalendarIcon className="w-10 h-10 text-primary-foreground opacity-90 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-primary-foreground text-sm font-medium mb-1">Check In - Check Out</p>
                  <p className="text-primary-foreground text-lg font-semibold truncate">
                    {formatDateRange()}
                  </p>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                initialFocus
                locale={vi}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>

          {/* Guests */}
          <Popover open={isGuestPopoverOpen} onOpenChange={setIsGuestPopoverOpen}>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-4 text-left group cursor-pointer">
                <User className="w-10 h-10 text-primary-foreground opacity-90" />
                <div>
                  <p className="text-primary-foreground text-sm font-medium mb-1">Khách</p>
                  <p className="text-primary-foreground text-lg font-semibold">
                    {rooms} Phòng {adults} Người lớn {children} Trẻ em
                  </p>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 pointer-events-auto" align="start">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Phòng</span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setRooms(Math.max(1, rooms - 1))}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{rooms}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setRooms(rooms + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Người lớn</span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{adults}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setAdults(adults + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Trẻ em</span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{children}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setChildren(children + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleApplyGuests}
                  className="w-full bg-gold hover:bg-gold-light text-primary"
                >
                  Hoàn thành
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Check Now Button */}
          <Button
            size="lg"
            className="bg-background hover:bg-background/90 text-primary border-0 h-auto py-4 md:py-6 text-base font-semibold group"
          >
            Tìm phòng
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </motion.section>
  );
};

export default BookingFilter;