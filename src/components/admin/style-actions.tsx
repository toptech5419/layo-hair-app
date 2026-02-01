"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Edit,
  Trash2,
  MoreHorizontal,
  Eye,
  EyeOff,
  Star,
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

interface StyleActionsProps {
  styleId: string;
  styleName: string;
  isActive: boolean;
  isFeatured: boolean;
  bookingCount: number;
}

export function StyleActions({
  styleId,
  styleName,
  isActive,
  isFeatured,
  bookingCount,
}: StyleActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleToggleActive = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/styles/${styleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update style");
      }

      toast.success(isActive ? "Style hidden" : "Style activated");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleFeatured = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/styles/${styleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !isFeatured }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update style");
      }

      toast.success(isFeatured ? "Removed from featured" : "Added to featured");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/styles/${styleId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete style");
      }

      toast.success("Style deleted");
      setShowDeleteDialog(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white -mt-1 -mr-2"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <MoreHorizontal className="w-5 h-5" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
          <DropdownMenuItem
            onClick={handleToggleFeatured}
            className="text-white hover:bg-zinc-800 cursor-pointer"
          >
            <Star className={`w-4 h-4 mr-2 ${isFeatured ? "fill-[#FFD700] text-[#FFD700]" : ""}`} />
            {isFeatured ? "Remove from Featured" : "Add to Featured"}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleToggleActive}
            className="text-white hover:bg-zinc-800 cursor-pointer"
          >
            {isActive ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Hide Style
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Show Style
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-zinc-800" />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-400 hover:bg-zinc-800 hover:text-red-400 cursor-pointer"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Style
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Delete Style</DialogTitle>
            <DialogDescription className="text-white/60">
              Are you sure you want to delete &quot;{styleName}&quot;?
              {bookingCount > 0 && (
                <span className="block mt-2 text-yellow-500">
                  Warning: This style has {bookingCount} booking(s). You cannot delete it until all bookings are removed.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="border-zinc-700 text-white hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting || bookingCount > 0}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
