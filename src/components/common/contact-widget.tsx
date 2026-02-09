"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  MessageCircle,
  X,
  Phone,
  Mail,
  Calendar,
  Scissors,
  Clock,
  ChevronRight,
  MapPin,
  Send,
} from "lucide-react";

const BUSINESS_CONFIG = {
  name: "LAYO HAIR",
  phone: "+447350167537",
  phoneDisplay: "+44 7350 167537",
  whatsapp: "+447350167537",
  email: "layohair5@gmail.com",
  hours: {
    open: 9,
    close: 19,
    days: [0, 1, 2, 3, 4, 5, 6],
  },
  location: "Lincoln, LN1 1RP, UK",
  defaultMessage: "Hi! I'd like to book an appointment at LAYO HAIR.",
};

// Pages where the widget should be completely hidden
const HIDDEN_PAGES = ["/admin"];

// Pages where the notification tooltip should NOT pop up (user is already engaged)
const NO_NOTIFICATION_PAGES = ["/book", "/contact"];

function isBusinessOpen(): boolean {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  return BUSINESS_CONFIG.hours.days.includes(day) && hour >= BUSINESS_CONFIG.hours.open && hour < BUSINESS_CONFIG.hours.close;
}

function getStatusMessage(): string {
  const now = new Date();
  const hour = now.getHours();

  if (isBusinessOpen()) {
    const hoursLeft = BUSINESS_CONFIG.hours.close - hour;
    if (hoursLeft <= 2) return `Closing in ${hoursLeft}hr${hoursLeft > 1 ? "s" : ""}`;
    return "We're open now!";
  }

  if (hour < BUSINESS_CONFIG.hours.open) return `Opens at ${BUSINESS_CONFIG.hours.open}am today`;
  return `Opens at ${BUSINESS_CONFIG.hours.open}am tomorrow`;
}

export function ContactWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Check if notification was already shown/dismissed this session
  const wasNotificationShown = useCallback(() => {
    try {
      return sessionStorage.getItem("layo-widget-notif-shown") === "true";
    } catch {
      return false;
    }
  }, []);

  const markNotificationShown = useCallback(() => {
    try {
      sessionStorage.setItem("layo-widget-notif-shown", "true");
    } catch {
      // sessionStorage not available
    }
  }, []);

  // Update business hours status
  useEffect(() => {
    const updateStatus = () => {
      setIsOnline(isBusinessOpen());
      setStatusMessage(getStatusMessage());
    };
    updateStatus();
    const interval = setInterval(updateStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  // Show notification tooltip - only once per session, only on relevant pages
  useEffect(() => {
    if (isOpen || dismissed || wasNotificationShown()) return;

    const isNoNotifPage = NO_NOTIFICATION_PAGES.some((p) => pathname.startsWith(p));
    if (isNoNotifPage) return;

    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowNotification(true);
        markNotificationShown();
      }
    }, 15000);

    return () => clearTimeout(timer);
  }, [isOpen, dismissed, pathname, wasNotificationShown, markNotificationShown]);

  // Hide notification when widget is opened
  useEffect(() => {
    if (isOpen) setShowNotification(false);
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Hide on admin pages
  if (HIDDEN_PAGES.some((p) => pathname.startsWith(p))) return null;

  const dismissNotification = () => {
    setShowNotification(false);
    setDismissed(true);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      {/* Backdrop on mobile when open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm sm:hidden -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Tooltip when closed - shows once per session */}
      {showNotification && !isOpen && (
        <div className="absolute bottom-[68px] right-0 w-52 animate-in slide-in-from-bottom-2 fade-in duration-300">
          <div className="bg-zinc-900 border border-[#FFD700]/20 text-white text-sm p-3 rounded-xl shadow-2xl shadow-black/50 relative">
            <button
              onClick={dismissNotification}
              className="absolute top-1.5 right-1.5 text-white/30 hover:text-white/60 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
            <p className="font-semibold text-[#FFD700]">Need help booking?</p>
            <p className="text-white/50 text-xs mt-1">We typically reply instantly!</p>
            <div className="absolute bottom-0 right-5 translate-y-1/2 rotate-45 w-3 h-3 bg-zinc-900 border-r border-b border-[#FFD700]/20" />
          </div>
        </div>
      )}

      {/* Main Widget Panel */}
      {isOpen && (
        <div className="absolute bottom-[68px] right-0 w-[calc(100vw-2rem)] sm:w-80 max-w-sm rounded-2xl shadow-2xl shadow-black/60 overflow-hidden animate-in slide-in-from-bottom-3 fade-in duration-300 border border-[#FFD700]/10">
          {/* Header */}
          <div className="bg-gradient-to-br from-[#FFD700] via-[#DAA520] to-[#B8860B] p-5 relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
            <div className="absolute -bottom-3 -left-3 w-16 h-16 rounded-full bg-white/10" />

            <div className="flex items-center justify-between relative">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-black rounded-xl flex items-center justify-center shadow-lg">
                  <Scissors className="w-5 h-5 text-[#FFD700]" />
                </div>
                <div>
                  <p className="text-black font-bold text-base tracking-wide">{BUSINESS_CONFIG.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-600 animate-pulse" : "bg-black/30"}`} />
                    <p className="text-black/70 text-xs font-medium">{statusMessage}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-black/50 hover:text-black p-1.5 rounded-lg hover:bg-black/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Hours bar */}
          <div className="bg-zinc-900 px-4 py-2.5 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-2 text-white/50 text-xs">
              <Clock className="w-3.5 h-3.5" />
              <span>Open daily: 9am – 7pm</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/40 text-xs">
              <MapPin className="w-3 h-3" />
              <span>Lincoln, UK</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4 bg-black border-b border-white/5">
            <div className="grid grid-cols-2 gap-2.5">
              <Link
                href="/book"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[#FFD700] text-black font-semibold text-sm hover:bg-[#FFD700]/90 transition-all active:scale-[0.98]"
              >
                <Calendar className="w-4.5 h-4.5" />
                Book Now
              </Link>
              <Link
                href="/styles"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 p-3.5 rounded-xl bg-zinc-900 text-white/80 text-sm hover:bg-zinc-800 border border-white/10 transition-all active:scale-[0.98]"
              >
                <Scissors className="w-4.5 h-4.5" />
                View Styles
              </Link>
            </div>
          </div>

          {/* Contact Options */}
          <div className="p-4 bg-black">
            <p className="text-white/30 text-[10px] uppercase tracking-[0.15em] font-semibold mb-3">
              Get in Touch
            </p>
            <div className="space-y-1.5">
              {/* WhatsApp */}
              <a
                href={`https://wa.me/${BUSINESS_CONFIG.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(BUSINESS_CONFIG.defaultMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-zinc-900 transition-all group active:scale-[0.98]"
              >
                <div className="w-10 h-10 bg-[#25D366] rounded-xl flex items-center justify-center shadow-lg shadow-[#25D366]/20 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm">WhatsApp</p>
                  <p className="text-white/40 text-xs">Chat with us instantly</p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-[#FFD700] group-hover:translate-x-0.5 transition-all" />
              </a>

              {/* Call */}
              <a
                href={`tel:${BUSINESS_CONFIG.phone}`}
                className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-zinc-900 transition-all group active:scale-[0.98]"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm">Call Us</p>
                  <p className="text-white/40 text-xs">{BUSINESS_CONFIG.phoneDisplay}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-[#FFD700] group-hover:translate-x-0.5 transition-all" />
              </a>

              {/* Email */}
              <a
                href={`mailto:${BUSINESS_CONFIG.email}?subject=Booking%20Inquiry&body=${encodeURIComponent(BUSINESS_CONFIG.defaultMessage)}`}
                className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-zinc-900 transition-all group active:scale-[0.98]"
              >
                <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm">Email</p>
                  <p className="text-white/40 text-xs truncate">{BUSINESS_CONFIG.email}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-[#FFD700] group-hover:translate-x-0.5 transition-all" />
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-zinc-950 px-4 py-3 flex items-center justify-between">
            <p className="text-white/20 text-[10px]">Powered by LAYO HAIR</p>
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="text-[#FFD700]/60 hover:text-[#FFD700] text-[10px] font-medium flex items-center gap-1 transition-colors"
            >
              More options <Send className="w-2.5 h-2.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Main Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
          isOpen
            ? "bg-zinc-800 hover:bg-zinc-700 border border-white/10"
            : "bg-gradient-to-br from-[#FFD700] to-[#B8860B] hover:scale-110 hover:shadow-[#FFD700]/30 hover:shadow-2xl"
        }`}
        aria-label={isOpen ? "Close contact menu" : "Contact us"}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white transition-transform duration-200" />
        ) : (
          <MessageCircle className="w-7 h-7 text-black transition-transform duration-200" />
        )}

        {/* Online indicator */}
        {!isOpen && (
          <span className={`absolute top-0 right-0 w-4 h-4 rounded-full border-2 border-black ${isOnline ? "bg-green-500" : "bg-zinc-500"}`} />
        )}
      </button>
    </div>
  );
}
