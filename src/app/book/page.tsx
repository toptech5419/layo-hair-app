"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Calendar,
  User,
  Phone,
  Mail,
  MessageSquare,
  CreditCard,
  Shield,
  Loader2,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Style {
  id: string;
  slug: string;
  name: string;
  price: number;
  priceMax?: number | null;
  duration: number;
  durationMax?: number | null;
  images: string[];
}

const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

function formatPrice(price: number, priceMax?: number | null) {
  const fmt = (val: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);
  if (priceMax && priceMax > price) return `${fmt(price)} - ${fmt(priceMax)}`;
  return fmt(price);
}

function formatDuration(minutes: number, maxMinutes?: number | null) {
  const fmt = (m: number) => {
    const hours = Math.floor(m / 60);
    const mins = m % 60;
    return mins === 0 ? `${hours} hours` : `${hours}h ${mins}m`;
  };
  if (maxMinutes && maxMinutes > minutes) return `${fmt(minutes)} - ${fmt(maxMinutes)}`;
  return fmt(minutes);
}

function getNext7Days() {
  const days = [];
  for (let i = 1; i <= 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    days.push({
      date: date.toISOString().split("T")[0],
      fullDate: date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
      day: date.toLocaleDateString("en-GB", { weekday: "short" }),
      dayNum: date.getDate(),
      month: date.toLocaleDateString("en-GB", { month: "short" }),
    });
  }
  return days;
}

export default function BookPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [styles, setStyles] = useState<Style[]>([]);
  const [isLoadingStyles, setIsLoadingStyles] = useState(true);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", notes: "" });
  const [paymentType, setPaymentType] = useState<"deposit" | "full">("deposit");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isDateBlocked, setIsDateBlocked] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Fetch styles from database
  useEffect(() => {
    fetch("/api/styles")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setStyles(data);
        }
      })
      .catch((err) => console.error("Error fetching styles:", err))
      .finally(() => setIsLoadingStyles(false));
  }, []);

  const days = getNext7Days();
  const selectedStyleData = styles.find((s) => s.id === selectedStyle);
  const selectedDateData = days.find((d) => d.date === selectedDate);

  // Fetch booked slots when date changes
  useEffect(() => {
    if (selectedDate) {
      setIsLoadingSlots(true);
      setSelectedTime(null); // Reset time when date changes

      fetch(`/api/slots?date=${selectedDate}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.isBlocked) {
            setIsDateBlocked(true);
            setBookedSlots([]);
          } else {
            setIsDateBlocked(false);
            // Extract booked start times
            const booked = data.bookedSlots?.map((slot: any) => slot.startTime) || [];
            setBookedSlots(booked);
          }
        })
        .catch((err) => {
          console.error("Error fetching slots:", err);
          setBookedSlots([]);
        })
        .finally(() => {
          setIsLoadingSlots(false);
        });
    }
  }, [selectedDate]);

  const depositAmount = selectedStyleData ? selectedStyleData.price * 0.3 : 0;
  const fullAmount = selectedStyleData?.price || 0;
  const paymentAmount = paymentType === "deposit" ? depositAmount : fullAmount;

  const handlePayment = async () => {
    setIsProcessing(true);
    setError("");

    const maxRetries = 3;
    let lastError = "";

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            styleId: selectedStyleData?.id,
            styleName: selectedStyleData?.name,
            stylePrice: selectedStyleData?.price,
            styleSlug: selectedStyleData?.slug,
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            appointmentDate: selectedDateData?.fullDate,
            appointmentTime: selectedTime,
            notes: formData.notes,
            paymentType,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Server error: ${response.status}`);
        }

        const data = await response.json();

        if (data.mockMode) {
          // Mock mode - redirect to success page
          router.push(data.redirectUrl);
          return;
        } else if (data.url) {
          // Real Stripe - redirect to checkout
          window.location.href = data.url;
          return;
        } else {
          throw new Error(data.error || "Failed to create checkout session");
        }
      } catch (err: any) {
        lastError = err.message || "Connection failed";
        console.error(`Checkout attempt ${attempt} failed:`, err);

        if (attempt < maxRetries) {
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }

    // All retries failed
    setError(`An error occurred with our connection to Stripe. Request was retried ${maxRetries} times. Please check your internet connection and try again.`);
    setIsProcessing(false);
  };

  const canProceed = () => {
    if (step === 1) return selectedStyle !== null;
    if (step === 2) return selectedDate !== null && selectedTime !== null && !isDateBlocked && !bookedSlots.includes(selectedTime || "");
    if (step === 3) return formData.name && formData.email && formData.phone;
    if (step === 4) return true;
    return false;
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step >= s ? "bg-[#FFD700] text-black" : "bg-zinc-800 text-white/50"
                  }`}
                >
                  {step > s ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 4 && (
                  <div className={`w-12 md:w-20 h-1 mx-2 ${step > s ? "bg-[#FFD700]" : "bg-zinc-800"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Labels */}
          <div className="hidden md:flex justify-center gap-8 mb-8 text-sm">
            <span className={step >= 1 ? "text-[#FFD700]" : "text-white/40"}>Style</span>
            <span className={step >= 2 ? "text-[#FFD700]" : "text-white/40"}>Date & Time</span>
            <span className={step >= 3 ? "text-[#FFD700]" : "text-white/40"}>Details</span>
            <span className={step >= 4 ? "text-[#FFD700]" : "text-white/40"}>Payment</span>
          </div>

          {/* Step 1: Select Style */}
          {step === 1 && (
            <div>
              <h1 className="text-3xl font-bold text-white text-center mb-2">Choose Your Style</h1>
              <p className="text-white/60 text-center mb-8">Select the hairstyle you want to book</p>
              {isLoadingStyles ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-[#FFD700] animate-spin" />
                  <span className="text-white/60 ml-3">Loading styles...</span>
                </div>
              ) : styles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-white/60">No styles available at the moment.</p>
                  <Link href="/styles" className="text-[#FFD700] hover:underline mt-2 inline-block">
                    View our gallery
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {styles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        selectedStyle === style.id
                          ? "border-[#FFD700] bg-[#FFD700]/10"
                          : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                      }`}
                    >
                      <div className="aspect-square relative rounded-lg overflow-hidden mb-3 bg-zinc-800">
                        {style.images?.[0] ? (
                          <Image src={style.images[0]} alt={style.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/20">
                            No image
                          </div>
                        )}
                      </div>
                      <h3 className="text-white font-medium text-sm">{style.name}</h3>
                      <p className="text-[#FFD700] font-bold text-xs">{formatPrice(style.price, style.priceMax)}</p>
                      <p className="text-white/50 text-xs flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" /> {formatDuration(style.duration, style.durationMax)}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Select Date & Time */}
          {step === 2 && (
            <div>
              <h1 className="text-3xl font-bold text-white text-center mb-2">Pick a Date & Time</h1>
              <p className="text-white/60 text-center mb-8">Choose when you&apos;d like your appointment</p>

              <div className="mb-8">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#FFD700]" /> Select Date
                </h3>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {days.map((day) => (
                    <button
                      key={day.date}
                      onClick={() => setSelectedDate(day.date)}
                      className={`p-3 sm:p-2 min-h-[70px] rounded-xl border transition-all text-center ${
                        selectedDate === day.date
                          ? "border-[#FFD700] bg-[#FFD700]/10"
                          : "border-zinc-800 bg-zinc-900 hover:border-zinc-700 active:bg-zinc-800"
                      }`}
                    >
                      <p className="text-white/50 text-xs">{day.day}</p>
                      <p className="text-white font-bold text-lg">{day.dayNum}</p>
                      <p className="text-white/50 text-xs">{day.month}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#FFD700]" /> Select Time
                </h3>
                {isDateBlocked ? (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
                    <p className="text-red-400">This date is not available for booking.</p>
                    <p className="text-white/50 text-sm mt-1">Please select another date.</p>
                  </div>
                ) : isLoadingSlots ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-[#FFD700] animate-spin" />
                    <span className="text-white/60 ml-2">Loading available times...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {timeSlots.map((time) => {
                      const isBooked = bookedSlots.includes(time);
                      return (
                        <button
                          key={time}
                          onClick={() => !isBooked && setSelectedTime(time)}
                          disabled={isBooked}
                          className={`p-3 min-h-[48px] rounded-xl border transition-all ${
                            isBooked
                              ? "border-zinc-800 bg-zinc-800/50 text-white/30 cursor-not-allowed line-through"
                              : selectedTime === time
                              ? "border-[#FFD700] bg-[#FFD700]/10 text-[#FFD700]"
                              : "border-zinc-800 bg-zinc-900 hover:border-zinc-700 text-white"
                          }`}
                        >
                          {time}
                          {isBooked && <span className="block text-xs text-red-400/70">Booked</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
                {bookedSlots.length > 0 && !isDateBlocked && (
                  <p className="text-white/40 text-xs mt-3 text-center">
                    Times marked as &quot;Booked&quot; are no longer available
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Your Details */}
          {step === 3 && (
            <div>
              <h1 className="text-3xl font-bold text-white text-center mb-2">Your Details</h1>
              <p className="text-white/60 text-center mb-8">Tell us how to reach you</p>

              <div className="max-w-md mx-auto space-y-4">
                <div>
                  <label className="text-white/70 text-sm mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" /> Full Name *
                  </label>
                  <Input
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-zinc-900 border-zinc-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-white/70 text-sm mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email Address *
                  </label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-zinc-900 border-zinc-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-white/70 text-sm mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Phone Number *
                  </label>
                  <Input
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-zinc-900 border-zinc-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-white/70 text-sm mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Notes (Optional)
                  </label>
                  <textarea
                    placeholder="Any special requests or notes..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-md p-3 min-h-[100px] placeholder:text-white/40"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Payment */}
          {step === 4 && (
            <div>
              <h1 className="text-3xl font-bold text-white text-center mb-2">Secure Payment</h1>
              <p className="text-white/60 text-center mb-8">Choose your payment option</p>

              <div className="max-w-lg mx-auto">
                {/* Booking Summary */}
                <div className="bg-zinc-900 rounded-xl p-6 border border-[#FFD700]/10 mb-6">
                  <h3 className="text-white font-semibold mb-4">Booking Summary</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Style</span>
                      <span className="text-white">{selectedStyleData?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Date</span>
                      <span className="text-white">{selectedDateData?.fullDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Time</span>
                      <span className="text-white">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Duration</span>
                      <span className="text-white">{formatDuration(selectedStyleData?.duration || 0, selectedStyleData?.durationMax)}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-white/10">
                      <span className="text-white font-semibold">Total Price</span>
                      <span className="text-[#FFD700] font-bold">{formatPrice(fullAmount)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Options */}
                <div className="space-y-3 mb-6">
                  <h3 className="text-white font-semibold mb-2">Payment Option</h3>

                  {/* Deposit Option */}
                  <button
                    onClick={() => setPaymentType("deposit")}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      paymentType === "deposit"
                        ? "border-[#FFD700] bg-[#FFD700]/10"
                        : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-semibold">Pay 30% Deposit</p>
                        <p className="text-white/60 text-sm">Pay the rest at your appointment</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#FFD700] font-bold text-xl">{formatPrice(depositAmount)}</p>
                        <p className="text-white/40 text-xs">now</p>
                      </div>
                    </div>
                    {paymentType === "deposit" && (
                      <div className="mt-3 pt-3 border-t border-white/10 text-sm text-white/60">
                        Balance due at appointment: {formatPrice(fullAmount - depositAmount)}
                      </div>
                    )}
                  </button>

                  {/* Full Payment Option */}
                  <button
                    onClick={() => setPaymentType("full")}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      paymentType === "full"
                        ? "border-[#FFD700] bg-[#FFD700]/10"
                        : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-semibold">Pay in Full</p>
                        <p className="text-white/60 text-sm">Complete payment now</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#FFD700] font-bold text-xl">{formatPrice(fullAmount)}</p>
                        <p className="text-white/40 text-xs">total</p>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Security Info */}
                <div className="flex items-center gap-3 p-4 bg-zinc-900/50 rounded-lg border border-white/10 mb-6">
                  <Shield className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <p className="text-white/60 text-sm">
                    Secure payment powered by Stripe. Your card details are encrypted and never stored.
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg mb-6">
                    <p className="text-yellow-400 text-sm">{error}</p>
                  </div>
                )}

                {/* Pay Button */}
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full h-14 bg-[#FFD700] text-black hover:bg-[#FFD700]/90 text-lg font-semibold disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Pay {formatPrice(paymentAmount)}
                    </>
                  )}
                </Button>

                <p className="text-white/40 text-xs text-center mt-4">
                  By proceeding, you agree to our booking terms and cancellation policy.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-12">
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className="border-zinc-700 text-white hover:bg-zinc-800 disabled:opacity-30"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>

            {step < 4 && (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90 disabled:opacity-30"
              >
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
