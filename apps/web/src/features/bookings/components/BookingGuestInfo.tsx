import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/features/user/types";

interface BookingGuestInfoProps {
  user: User;
}

export const BookingGuestInfo = ({ user }: BookingGuestInfoProps) => {
  return (
    <Card className="shadow-sm border border-gray-100">
      <CardHeader>
        <CardTitle>Guest Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100">
            <Image 
              src={user.avatar.secureUrl} 
              alt="User Avatar" 
              fill 
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">{user.firstName} {user.lastName}</h3>
            <p className="text-gray-500">{user.email}</p>
            <Badge variant="outline" className="mt-2 text-xs">Primary Guest</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
