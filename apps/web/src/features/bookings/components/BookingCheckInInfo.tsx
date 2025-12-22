
import { format } from "date-fns";
import { User, Flag, Phone, Mail, FileText, Calendar, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingGuest, CheckInRecord } from "../types";
import { Badge } from "@/components/ui/badge";

interface BookingCheckInInfoProps {
    checkIn: CheckInRecord | null;
    guests: BookingGuest[];
}

export function BookingCheckInInfo({ checkIn, guests }: BookingCheckInInfoProps) {
    if (!checkIn && guests.length === 0) return null;

    return (
        <Card className="border-blue-200 bg-blue-50/30">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Info className="w-5 h-5" />
                    Check-In Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                
                {checkIn && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Checked In At</p>
                            <p className="font-medium flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-blue-500" />
                                {format(new Date(checkIn.checkedInAt), "dd MMM yyyy, HH:mm")}
                            </p>
                        </div>
                        {checkIn.note && (
                            <div className="md:col-span-2 mt-2">
                                <p className="text-sm text-gray-500 mb-1">Check-in Note</p>
                                <p className="text-sm italic text-gray-700">{checkIn.note}</p>
                            </div>
                        )}
                    </div>
                )}

                <div className="space-y-4">
                    <h4 className="font-medium text-blue-800 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Guest List ({guests.length})
                    </h4>
                    
                    <div className="grid gap-4">
                        {guests.map((guest, index) => (
                            <div key={guest.id || index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:border-blue-300 transition-colors">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                     <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                                            {guest.fullName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{guest.fullName}</p>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                                {guest.gender && <Badge variant="outline" className="text-[10px] h-5 px-1.5">{guest.gender}</Badge>}
                                                {guest.nationality && <span className="flex items-center gap-1"><Flag className="w-3 h-3" /> {guest.nationality}</span>}
                                            </div>
                                        </div>
                                     </div>
                                     
                                     <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                                         {guest.idNumber && (
                                             <div className="flex items-center gap-1.5">
                                                 <FileText className="w-4 h-4 text-gray-400" />
                                                 <span>ID: {guest.idNumber}</span>
                                             </div>
                                         )}
                                          {guest.phone && (
                                             <div className="flex items-center gap-1.5">
                                                 <Phone className="w-4 h-4 text-gray-400" />
                                                 <span>{guest.phone}</span>
                                             </div>
                                         )}
                                          {guest.email && (
                                             <div className="flex items-center gap-1.5">
                                                 <Mail className="w-4 h-4 text-gray-400" />
                                                 <span className="truncate max-w-[150px]" title={guest.email}>{guest.email}</span>
                                             </div>
                                         )}
                                     </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
