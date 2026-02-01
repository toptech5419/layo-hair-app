"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  UserX,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface BookingActionsProps {
  bookingId: string;
  bookingRef: string;
  currentStatus: string;
}

const statusOptions = [
  { value: "PENDING", label: "Pending", icon: Clock, color: "text-yellow-500" },
  { value: "CONFIRMED", label: "Confirmed", icon: CheckCircle, color: "text-blue-500" },
  { value: "COMPLETED", label: "Completed", icon: CheckCircle, color: "text-green-500" },
  { value: "CANCELLED", label: "Cancelled", icon: XCircle, color: "text-red-500" },
  { value: "NO_SHOW", label: "No Show", icon: UserX, color: "text-orange-500" },
];

export function BookingActions({
  bookingId,
  bookingRef,
  currentStatus,
}: BookingActionsProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === "CANCELLED") {
      setShowCancelDialog(true);
      return;
    }

    await updateStatus(newStatus);
  };

  const updateStatus = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update booking");
      }

      toast.success(`Booking ${bookingRef} updated to ${newStatus.toLowerCase()}`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
      setShowCancelDialog(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <MoreHorizontal className="w-4 h-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
          <div className="px-2 py-1.5 text-xs text-white/50">Change Status</div>
          {statusOptions.map((option) => {
            const Icon = option.icon;
            const isCurrentStatus = currentStatus === option.value;
            return (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleStatusChange(option.value)}
                disabled={isCurrentStatus}
                className={`cursor-pointer ${
                  isCurrentStatus
                    ? "bg-zinc-800 text-white/50"
                    : "text-white hover:bg-zinc-800"
                }`}
              >
                <Icon className={`w-4 h-4 mr-2 ${option.color}`} />
                {option.label}
                {isCurrentStatus && (
                  <span className="ml-auto text-xs text-white/40">Current</span>
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription className="text-white/60">
              Are you sure you want to cancel booking {bookingRef}? This action may require issuing a refund to the customer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
              className="border-zinc-700 text-white hover:bg-zinc-800"
            >
              Keep Booking
            </Button>
            <Button
              onClick={() => updateStatus("CANCELLED")}
              disabled={isUpdating}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Cancel Booking"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
