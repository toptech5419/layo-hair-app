"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle,
  Clock3,
  XCircle,
  ArrowLeft,
  CreditCard,
  MapPin,
  Edit,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
type PaymentStatus = "paid" | "partial" | "refunded" | "pending";

interface BookingDetails {
  id: string;
  bookingRef: string;
  status: BookingStatus;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  totalPaid: number;
  balanceDue: number;
  notes: string | null;
  createdAt: string;
  style: {
    name: string;
    slug: string;
    duration: number;
    price: number;
  };
  payments: Array<{
    amount: number;
    paymentType: string;
    status: string;
  }>;
}

const statusConfig: Record<
  BookingStatus,
  { label: string; color: string; bgColor: string; borderColor: string; icon: React.ReactNode }
> = {
  PENDING: {
    label: "Pending Confirmation",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    icon: <Clock3 className="w-6 h-6" />,
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    icon: <CheckCircle className="w-6 h-6" />,
  },
  COMPLETED: {
    label: "Completed",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    icon: <CheckCircle className="w-6 h-6" />,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    icon: <XCircle className="w-6 h-6" />,
  },
  NO_SHOW: {
    label: "No Show",
    color: "text-gray-500",
    bgColor: "bg-gray-500/10",
    borderColor: "border-gray-500/30",
    icon: <XCircle className="w-6 h-6" />,
  },
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(price);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(time24: string) {
  const [hours, minutes] = time24.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins === 0 ? `${hours} hours` : `${hours}h ${mins}m`;
}

export default function TrackBookingPage() {
  const [referenceCode, setReferenceCode] = useState("");
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Auto-fill reference from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      setReferenceCode(ref.toUpperCase());
      // Auto-search after a brief delay
      setTimeout(() => {
        const form = document.querySelector("form");
        if (form) form.requestSubmit();
      }, 100);
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBooking(null);
    setHasSearched(true);

    if (!referenceCode.trim()) {
      setError("Please enter a booking reference");
      return;
    }

    setIsSearching(true);

    try {
      const response = await fetch(`/api/bookings?ref=${referenceCode.trim().toUpperCase()}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "No booking found with this reference. Please check and try again.");
      } else {
        setBooking(data);
      }
    } catch (err) {
      setError("Failed to search. Please try again.");
    }

    setIsSearching(false);
  };

  const status = booking ? statusConfig[booking.status] : null;
  const paymentStatus: PaymentStatus = booking
    ? booking.totalPaid >= booking.totalPrice
      ? "paid"
      : booking.totalPaid > 0
        ? "partial"
        : "pending"
    : "pending";

  const paymentStatusConfig: Record<PaymentStatus, { label: string; color: string }> = {
    paid: { label: "Paid in Full", color: "text-green-500" },
    partial: { label: "Deposit Paid", color: "text-yellow-500" },
    refunded: { label: "Refunded", color: "text-blue-500" },
    pending: { label: "Payment Pending", color: "text-orange-500" },
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-[#FFD700] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Track Your <span className="text-[#FFD700]">Booking</span>
            </h1>
            <p className="text-white/60">
              Enter your booking reference to check the status of your appointment
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  type="text"
                  placeholder="Enter reference (e.g., LAYO-ABC123)"
                  value={referenceCode}
                  onChange={(e) => setReferenceCode(e.target.value.toUpperCase())}
                  className="pl-12 h-14 bg-zinc-900 border-[#FFD700]/20 text-white placeholder:text-white/40 focus:border-[#FFD700] text-lg font-mono tracking-wider"
                />
              </div>
              <Button
                type="submit"
                disabled={isSearching}
                className="h-14 px-8 bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-semibold"
              >
                {isSearching ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Track"
                )}
              </Button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-500 font-medium">{error}</p>
                <p className="text-red-400/70 text-sm mt-1">
                  Your reference should look like: LAYO-XXXXXX
                </p>
              </div>
            </div>
          )}

          {/* Booking Details */}
          {booking && status && (
            <div className="bg-zinc-900 border border-[#FFD700]/20 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Status Header */}
              <div className={`p-6 ${status.bgColor} border-b ${status.borderColor}`}>
                <div className="flex items-center gap-4">
                  <div className={status.color}>{status.icon}</div>
                  <div>
                    <p className={`font-semibold text-lg ${status.color}`}>
                      {status.label}
                    </p>
                    <p className="text-white/60 text-sm font-mono">
                      Ref: {booking.bookingRef}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking Info */}
              <div className="p-6 space-y-6">
                {/* Style */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/50 text-sm">Booked Style</p>
                    <h2 className="text-2xl font-bold text-white mt-1">
                      {booking.style.name}
                    </h2>
                  </div>
                  <Link
                    href={`/styles/${booking.style.slug}`}
                    className="text-[#FFD700] text-sm hover:underline"
                  >
                    View Style
                  </Link>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-[#FFD700] mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Date</span>
                    </div>
                    <p className="text-white font-medium">{formatDate(booking.date)}</p>
                  </div>
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-[#FFD700] mb-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Time & Duration</span>
                    </div>
                    <p className="text-white font-medium">{formatTime(booking.startTime)}</p>
                    <p className="text-white/60 text-sm">{formatDuration(booking.style.duration)}</p>
                  </div>
                </div>

                {/* Location */}
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-[#FFD700] mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Location</span>
                  </div>
                  <p className="text-white font-medium">LAYO HAIR Studio</p>
                  <p className="text-white/60 text-sm">123 High Street, London, UK</p>
                </div>

                {/* Payment Info */}
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-[#FFD700] mb-3">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-sm">Payment Details</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/60">Total Price</span>
                      <span className="text-white font-medium">
                        {formatPrice(booking.totalPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Amount Paid</span>
                      <span className="text-green-500 font-medium">
                        {formatPrice(booking.totalPaid)}
                      </span>
                    </div>
                    {booking.balanceDue > 0 && booking.status !== "CANCELLED" && (
                      <div className="flex justify-between pt-2 border-t border-white/10">
                        <span className="text-white/60">Balance Due</span>
                        <span className="text-[#FFD700] font-bold">
                          {formatPrice(booking.balanceDue)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2">
                      <span className="text-white/60">Status</span>
                      <span className={`font-medium ${paymentStatusConfig[paymentStatus].color}`}>
                        {paymentStatusConfig[paymentStatus].label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <p className="text-white/50 text-sm mb-3">Your Details</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-white">
                      <User className="w-4 h-4 text-[#FFD700]" />
                      <span>{booking.guestName}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/70">
                      <Mail className="w-4 h-4 text-[#FFD700]" />
                      <span>{booking.guestEmail}</span>
                    </div>
                    {booking.guestPhone && (
                      <div className="flex items-center gap-3 text-white/70">
                        <Phone className="w-4 h-4 text-[#FFD700]" />
                        <span>{booking.guestPhone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {booking.notes && (
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <p className="text-white/50 text-sm mb-2">Notes</p>
                    <p className="text-white/70">{booking.notes}</p>
                  </div>
                )}

                {/* Booked Date */}
                <p className="text-white/40 text-sm text-center">
                  Booked on {formatDate(booking.createdAt)}
                </p>

                {/* Actions for confirmed bookings */}
                {booking.status === "CONFIRMED" && (
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <Button
                      variant="outline"
                      className="border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/10 h-12"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Reschedule
                    </Button>
                    <Button
                      variant="outline"
                      className="border-red-500/30 text-red-500 hover:bg-red-500/10 h-12"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}

                {/* Action for completed bookings */}
                {booking.status === "COMPLETED" && (
                  <div className="pt-4">
                    <Button
                      asChild
                      className="w-full bg-[#FFD700] text-black hover:bg-[#FFD700]/90 h-12"
                    >
                      <Link href={`/review?style=${booking.style.slug}&ref=${booking.bookingRef}`}>
                        Leave a Review
                      </Link>
                    </Button>
                  </div>
                )}

                {/* Book Again */}
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10 h-12"
                >
                  <Link href="/book">Book Another Appointment</Link>
                </Button>
              </div>
            </div>
          )}

          {/* Help Section - Before Search */}
          {!booking && !error && !hasSearched && (
            <div className="space-y-6">
              {/* Help Text */}
              <div className="text-center text-white/50 bg-zinc-900/50 border border-[#FFD700]/10 rounded-xl p-6">
                <Search className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p>Your booking reference was sent to your email after payment.</p>
                <p className="mt-2">
                  It looks like: <span className="text-[#FFD700] font-mono">LAYO-XXXXXX</span>
                </p>
                <p className="mt-4">
                  Can&apos;t find it?{" "}
                  <Link href="/contact" className="text-[#FFD700] hover:underline">
                    Contact us
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* Need Help Section */}
          {booking && (
            <div className="mt-6 bg-zinc-900/50 rounded-xl border border-white/10 p-4">
              <h3 className="text-white font-semibold mb-2">Need Help?</h3>
              <p className="text-white/60 text-sm mb-3">
                If you have any questions about your booking, please contact us:
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <a
                  href="tel:+447700900000"
                  className="text-[#FFD700] hover:underline flex items-center gap-1"
                >
                  <Phone className="w-4 h-4" />
                  +44 7700 900000
                </a>
                <a
                  href="mailto:hello@layohair.com"
                  className="text-[#FFD700] hover:underline flex items-center gap-1"
                >
                  <Mail className="w-4 h-4" />
                  hello@layohair.com
                </a>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
