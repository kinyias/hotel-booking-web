import { useState, useEffect } from "react";
import { 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  LogIn, 
  LogOut, 
  AlertTriangle 
} from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useUpdateBookingStatusMutation } from "../mutations";
import { BookingStatus } from "../types";
import { Badge } from "@/components/ui/badge";
import { CheckInGuestsDialog } from "./CheckInGuestsDialog";

interface UpdateStatusBookingDialogProps {
  hotelId: string;
  bookingId: string;
  currentStatus: BookingStatus;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Optional: pass guest info if available from parent, 
  // though currently simpler to just rely on user input or fetch inside if needed.
  // For now we won't change the props signature too much unless necessary.
}

// Define available transitions
const TRANSITIONS: Record<string, BookingStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["CHECKED_IN", "CANCELLED"], // User: CONFIRMED -> CHECKED_IN or CANCELLED
  CHECKED_IN: ["COMPLETED"], // User: CHECKED_IN -> CHECKED_OUT (mapped to COMPLETED)
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW: [],
};

// Config for each status action
const STATUS_CONFIG: Record<
  BookingStatus,
  {
    label: string;
    description: string;
    icon: React.ElementType;
    variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    requiresConfirmation?: boolean;
    confirmationMessage?: string;
  }
> = {
  PENDING: {
    label: "Pending",
    description: "Booking requires confirmation",
    icon: Loader2,
    variant: "secondary",
  },
  CONFIRMED: {
    label: "Confirm Booking",
    description: "Mark this booking as confirmed",
    icon: CheckCircle2,
    variant: "default",
  },
  CANCELLED: {
    label: "Cancel Booking",
    description: "Cancel this booking (Destructive)",
    icon: XCircle,
    variant: "destructive",
    requiresConfirmation: true,
    confirmationMessage: "Are you sure you want to cancel this booking? This action cannot be undone.",
  },
  CHECKED_IN: {
    label: "Check In Guest",
    description: "Guest has arrived",
    icon: LogIn,
    variant: "default",
  },
  COMPLETED: {
    label: "Check Out Guest",
    description: "Guest is leaving and payment settled",
    icon: LogOut,
    variant: "default", // Used to be secondary in some design systems for completion, but 'default' (primary) is good for the main action
    requiresConfirmation: true,
    confirmationMessage: "Are you sure you want to check out this guest? Ensure all payments are settled.",
  },
  NO_SHOW: {
      label: "Mark as No Show",
      description: "Guest did not arrive",
      icon: XCircle,
      variant: "destructive",
      requiresConfirmation: true,
      confirmationMessage: "Are you sure to mark this as No Show?"
  }
};

export function UpdateStatusBookingDialog({
  hotelId,
  bookingId,
  currentStatus,
  open,
  onOpenChange,
}: UpdateStatusBookingDialogProps) {
  const [targetStatus, setTargetStatus] = useState<BookingStatus | null>(null);
  const [showCheckInDialog, setShowCheckInDialog] = useState(false);
  
  // Reset state when dialog closes/opens
  useEffect(() => {
    if (open) {
      setTargetStatus(null);
      setShowCheckInDialog(false);
    }
  }, [open]);

  const { mutate: updateStatus, isPending } = useUpdateBookingStatusMutation(
    hotelId,
    bookingId
  );

  const availableTransitions = TRANSITIONS[currentStatus] || [];

  const handleActionClick = (status: BookingStatus) => {
    if (status === "CHECKED_IN") {
         setShowCheckInDialog(true);
         // Don't close the main dialog yet, or maybe cancel the main dialog?
         // User might want to go back.
         // But usually opening a sub-dialog implies focusing on that.
         return; 
    }

    const config = STATUS_CONFIG[status];
    if (config.requiresConfirmation) {
      setTargetStatus(status);
    } else {
      executeStatusUpdate(status);
    }
  };

  const executeStatusUpdate = (status: BookingStatus) => {
    updateStatus(status, {
      onSuccess: () => {
        toast.success(`Booking status updated to ${STATUS_CONFIG[status].label}`);
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error("Failed to update booking status");
        console.error(error);
      },
    });
  };

  const currentConfig = STATUS_CONFIG[currentStatus];

  if(showCheckInDialog) {
       return (
           <CheckInGuestsDialog 
                hotelId={hotelId}
                bookingId={bookingId}
                open={showCheckInDialog}
                onOpenChange={setShowCheckInDialog}
                onSuccess={() => onOpenChange(false)}
           />
       )
  }

  // Render Confirmation View
  if (targetStatus) {
      const targetConfig = STATUS_CONFIG[targetStatus];
      return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="w-5 h-5"/>
                        Confirm Action
                    </DialogTitle>
                    <DialogDescription>
                        {targetConfig.confirmationMessage}
                    </DialogDescription>
                </DialogHeader>
                
                <DialogFooter className="gap-2 sm:gap-0">
                     <Button 
                        variant="ghost" 
                        onClick={() => setTargetStatus(null)}
                        disabled={isPending}
                     >
                        Back
                     </Button>
                     <Button 
                        variant={targetConfig.variant}
                        onClick={() => executeStatusUpdate(targetStatus)}
                        disabled={isPending}
                     >
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Confirm {targetConfig.label}
                     </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      )
  }

  // Render Selection View
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Booking Status</DialogTitle>
          <DialogDescription>
            Current Status: <Badge variant="outline" className="ml-1">{currentConfig?.label || currentStatus}</Badge>
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
            {availableTransitions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    <p>No further actions available for this booking.</p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {availableTransitions.map((status) => {
                        const config = STATUS_CONFIG[status];
                        const Icon = config.icon;
                        
                        return (
                            <Button
                                key={status}
                                variant="outline"
                                className={`h-auto py-4 px-4 justify-start text-left items-start hover:bg-slate-50 border-2 ${
                                    config.variant === 'destructive' 
                                        ? 'hover:border-destructive/30 hover:text-destructive' 
                                        : 'hover:border-primary/30'
                                }`}
                                onClick={() => handleActionClick(status)}
                                disabled={isPending}
                            >
                                <div className={`p-2 rounded-full mr-4 ${
                                    config.variant === 'destructive' 
                                        ? 'bg-red-100 text-red-600' 
                                        : 'bg-primary/10 text-primary'
                                }`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-semibold">{config.label}</div>
                                    <div className="text-sm text-muted-foreground font-normal">
                                        {config.description}
                                    </div>
                                </div>
                            </Button>
                        )
                    })}
                </div>
            )}
        </div>

        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

