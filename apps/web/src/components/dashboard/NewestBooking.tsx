import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const bookings = [
  { 
    name: "Samantha Humble", 
    date: "October 3th, 2020", 
    room: "Room A-21", 
    guests: "3-5 Person",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Samantha"
  },
  { 
    name: "Louise Marquez", 
    date: "October 3th, 2020", 
    room: "Room A-21", 
    guests: "3-5 Person",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Louise"
  },
  { 
    name: "Richard Smile", 
    date: "October 3th, 2020", 
    room: "Room A-21", 
    guests: "3-5 Person",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Richard"
  },
  { 
    name: "Bella Yen", 
    date: "October 3th, 2020", 
    room: "Room A-21", 
    guests: "3-5 Person",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bella"
  },
];

export function NewestBooking() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Newest Booking</CardTitle>
          <Button variant="link" className="text-primary">More</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings.map((booking, index) => (
            <div key={index} className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={booking.avatar} />
                <AvatarFallback>{booking.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{booking.name}</p>
                <p className="text-xs text-primary">{booking.date}</p>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <p>{booking.room}</p>
                <p>{booking.guests}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
