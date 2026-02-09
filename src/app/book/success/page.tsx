"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Check,
  Calendar,
  Clock,
  Mail,
  Copy,
  Download,
  Search,
  CreditCard,
  MapPin,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

interface BookingData {
  bookingRef: string;
  status: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string | null;
  date: string;
  startTime: string;
  totalPrice: number;
  totalPaid: number;
  balanceDue: number;
  style: {
    name: string;
    slug: string;
    duration: number;
  };
  payments: Array<{
    amount: number;
    paymentType: string;
    status: string;
  }>;
}

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function verifyAndFetchBooking() {
      setLoading(true);
      setError(null);

      const sessionId = searchParams.get("session_id");
      const bookingRef = searchParams.get("ref");
      const isMock = searchParams.get("mock") === "true";

      try {
        // Call verify-payment API
        const response = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: isMock ? null : sessionId,
            bookingRef,
          }),
        });

        const data = await response.json();

        if (response.ok && data.booking) {
          setBooking(data.booking);
        } else if (isMock && bookingRef) {
          // Fallback for mock mode - try to fetch booking directly
          const bookingResponse = await fetch(`/api/bookings?ref=${bookingRef}`);
          const bookingData = await bookingResponse.json();

          if (bookingResponse.ok) {
            setBooking(bookingData);
          } else {
            // Ultimate fallback - use URL params
            setBooking({
              bookingRef: bookingRef || "LAYO-XXXXXX",
              status: "CONFIRMED",
              guestName: searchParams.get("name") || "Customer",
              guestEmail: searchParams.get("email") || "customer@example.com",
              guestPhone: null,
              date: searchParams.get("date") || new Date().toISOString(),
              startTime: searchParams.get("time") || "10:00",
              totalPrice: parseFloat(searchParams.get("amount") || "0") / (searchParams.get("paymentType") === "deposit" ? 0.3 : 1),
              totalPaid: parseFloat(searchParams.get("amount") || "0"),
              balanceDue: searchParams.get("paymentType") === "deposit"
                ? parseFloat(searchParams.get("amount") || "0") * (1/0.3 - 1)
                : 0,
              style: {
                name: searchParams.get("style")?.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) || "Hair Style",
                slug: searchParams.get("style") || "style",
                duration: 240,
              },
              payments: [{
                amount: parseFloat(searchParams.get("amount") || "0"),
                paymentType: searchParams.get("paymentType") === "deposit" ? "DEPOSIT" : "FULL",
                status: "COMPLETED",
              }],
            });
          }
        } else {
          setError("Could not verify your booking. Please check your email for confirmation.");
        }
      } catch (err) {
        console.error("Error verifying booking:", err);
        setError("Something went wrong. Please check your email for booking details.");
      }

      setLoading(false);
    }

    verifyAndFetchBooking();
  }, [searchParams]);

  const copyReference = () => {
    if (booking?.bookingRef) {
      navigator.clipboard.writeText(booking.bookingRef);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (time: string) => {
    if (!time) return "TBD";
    // Handle both "10:00" and "10:00 AM" formats
    if (time.includes("AM") || time.includes("PM")) return time;
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins === 0 ? `${hours} hours` : `${hours}h ${mins}m`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#FFD700] animate-spin mx-auto" />
          <p className="text-white/60 mt-4">Confirming your booking...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !booking) {
    return (
      <div className="min-h-screen flex flex-col bg-black">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 max-w-lg text-center">
            <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-yellow-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">
              Booking Confirmation Pending
            </h1>
            <p className="text-white/60 mb-6">{error}</p>
            <div className="space-y-3">
              <Button asChild className="w-full bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
                <Link href="/track">Track Your Booking</Link>
              </Button>
              <Button variant="outline" className="w-full border-white/20 text-white" onClick={() => router.back()}>
                Back
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!booking) return null;

  const paymentType = booking.payments[0]?.paymentType || "FULL";
  const isDeposit = paymentType === "DEPOSIT";

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-lg">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-500">
              <Check className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Payment Successful!
            </h1>
            <p className="text-white/60">
              Your booking has been confirmed
            </p>
          </div>

          {/* Booking Reference - Prominent */}
          <div className="bg-[#FFD700]/10 border-2 border-[#FFD700]/30 rounded-xl p-6 mb-6 text-center">
            <p className="text-white/60 text-sm mb-2">Your Booking Reference</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-[#FFD700] font-mono text-3xl font-bold tracking-wider">
                {booking.bookingRef}
              </span>
              <button
                onClick={copyReference}
                className="p-2 hover:bg-[#FFD700]/20 rounded-lg transition-colors"
                title="Copy reference"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5 text-[#FFD700]" />
                )}
              </button>
            </div>
            <p className="text-white/40 text-xs mt-2">
              Save this reference to track your booking
            </p>
          </div>

          {/* Booking Details Card */}
          <div className="bg-zinc-900 rounded-xl border border-[#FFD700]/10 overflow-hidden mb-6">
            {/* Payment Badge */}
            <div className="bg-green-500/10 px-6 py-3 flex items-center gap-3 border-b border-green-500/20">
              <CreditCard className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-green-500 font-semibold text-sm">
                  {isDeposit ? "Deposit Paid" : "Full Payment"}
                </p>
                <p className="text-green-400/70 text-xs">
                  {formatCurrency(booking.totalPaid)}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="p-6 space-y-4">
              {/* Style */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#FFD700]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-[#FFD700] text-lg">✨</span>
                </div>
                <div>
                  <p className="text-white/50 text-sm">Style</p>
                  <p className="text-white font-semibold">{booking.style.name}</p>
                  <p className="text-white/50 text-xs">{formatDuration(booking.style.duration)}</p>
                </div>
              </div>

              {/* Date & Time */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#FFD700]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-[#FFD700]" />
                </div>
                <div>
                  <p className="text-white/50 text-sm">Appointment</p>
                  <p className="text-white font-semibold">{formatDate(booking.date)}</p>
                  <p className="text-white/70 text-sm flex items-center gap-1 mt-1">
                    <Clock className="w-4 h-4" />
                    {formatTime(booking.startTime)}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#FFD700]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[#FFD700]" />
                </div>
                <div>
                  <p className="text-white/50 text-sm">Location</p>
                  <p className="text-white font-semibold">LAYO HAIR Studio</p>
                  <p className="text-white/60 text-xs">123 High Street, London, UK</p>
                </div>
              </div>

              {/* Contact */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#FFD700]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-[#FFD700]" />
                </div>
                <div>
                  <p className="text-white/50 text-sm">Confirmation sent to</p>
                  <p className="text-white font-semibold">{booking.guestEmail}</p>
                </div>
              </div>

              {/* Balance Due (if deposit) */}
              {isDeposit && booking.balanceDue > 0 && (
                <div className="bg-zinc-800/50 rounded-lg p-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Balance due at appointment</span>
                    <span className="text-[#FFD700] font-bold">
                      {formatCurrency(booking.balanceDue)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Important Info */}
          <div className="bg-zinc-900/50 rounded-xl border border-white/10 p-4 mb-6">
            <h3 className="text-white font-semibold mb-2">Important Information</h3>
            <ul className="text-white/60 text-sm space-y-2">
              <li>• Please arrive 10 minutes before your appointment</li>
              <li>• Bring your booking reference: <span className="text-[#FFD700] font-mono">{booking.bookingRef}</span></li>
              <li>• Cancellations require 24-hour notice</li>
              <li>• Contact us if you need to reschedule</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              asChild
              className="w-full bg-[#FFD700] text-black hover:bg-[#FFD700]/90 h-12"
            >
              <Link href={`/track?ref=${booking.bookingRef}`}>
                <Search className="w-4 h-4 mr-2" />
                Track Your Booking
              </Link>
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Save Receipt
              </Button>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => router.back()}
              >
                Back
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-[#FFD700] animate-spin mx-auto" />
            <p className="text-white/60 mt-4">Loading...</p>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
