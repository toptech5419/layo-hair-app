"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";

// Business configuration
const BUSINESS_CONFIG = {
  name: "LAYO HAIR",
  phone: "+447350167537",
  whatsapp: "+447350167537",
  email: "hello@layohair.com",
  // Business hours: 9am-7pm every day
  hours: {
    open: 9, // 9 AM
    close: 19, // 7 PM (19:00)
    days: [0, 1, 2, 3, 4, 5, 6], // Sunday (0) to Saturday (6) - all days
  },
  location: "Lincoln, LN1 1RP",
  defaultMessage: "Hi! I'd like to book an appointment at LAYO HAIR.",
};

// Check if business is currently open
function isBusinessOpen(): boolean {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();

  const isOpenDay = BUSINESS_CONFIG.hours.days.includes(day);
  const isOpenHour =
    hour >= BUSINESS_CONFIG.hours.open && hour < BUSINESS_CONFIG.hours.close;

  return isOpenDay && isOpenHour;
}

// Get status message
function getStatusMessage(): string {
  const now = new Date();
  const hour = now.getHours();

  if (isBusinessOpen()) {
    const hoursLeft = BUSINESS_CONFIG.hours.close - hour;
    if (hoursLeft <= 2) {
      return `Closing in ${hoursLeft} hour${hoursLeft > 1 ? "s" : ""}`;
    }
    return "We're open now!";
  }

  // Calculate when we open next
  if (hour < BUSINESS_CONFIG.hours.open) {
    return `Opens at ${BUSINESS_CONFIG.hours.open}am today`;
  }
  return `Opens at ${BUSINESS_CONFIG.hours.open}am tomorrow`;
}

// Contact options
const contactOptions = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    description: "Chat with us",
    icon: MessageCircle,
    color: "bg-[#25D366]",
    hoverColor: "hover:bg-[#20BD5A]",
    href: `https://wa.me/${BUSINESS_CONFIG.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(BUSINESS_CONFIG.defaultMessage)}`,
    external: true,
  },
  {
    id: "call",
    label: "Call Us",
    description: "Speak directly",
    icon: Phone,
    color: "bg-blue-500",
    hoverColor: "hover:bg-blue-600",
    href: `tel:${BUSINESS_CONFIG.phone}`,
    external: false,
  },
  {
    id: "email",
    label: "Email",
    description: "Send a message",
    icon: Mail,
    color: "bg-purple-500",
    hoverColor: "hover:bg-purple-600",
    href: `mailto:${BUSINESS_CONFIG.email}?subject=Booking Inquiry&body=${encodeURIComponent(BUSINESS_CONFIG.defaultMessage)}`,
    external: false,
  },
];

// Quick actions
const quickActions = [
  {
    id: "book",
    label: "Book Appointment",
    icon: Calendar,
    href: "/book",
    primary: true,
  },
  {
    id: "styles",
    label: "View Styles",
    icon: Scissors,
    href: "/styles",
    primary: false,
  },
];

export function ContactWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  // Update business status
  useEffect(() => {
    const updateStatus = () => {
      setIsOnline(isBusinessOpen());
      setStatusMessage(getStatusMessage());
    };

    updateStatus();
    // Update every minute
    const interval = setInterval(updateStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  // Show notification after 5 seconds if widget hasn't been opened
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowNotification(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  // Hide notification when widget is opened
  useEffect(() => {
    if (isOpen) {
      setShowNotification(false);
    }
  }, [isOpen]);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      {/* Notification Badge */}
      {showNotification && !isOpen && (
        <div className="absolute -top-2 -left-2 animate-bounce">
          <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            1
          </div>
        </div>
      )}

      {/* Tooltip when closed */}
      {showNotification && !isOpen && (
        <div className="absolute bottom-16 right-0 w-48 animate-fade-in-up">
          <div className="bg-white text-gray-800 text-sm p-3 rounded-lg shadow-lg">
            <p className="font-medium">Need help booking?</p>
            <p className="text-gray-500 text-xs mt-1">We typically reply instantly!</p>
            <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-3 h-3 bg-white" />
          </div>
        </div>
      )}

      {/* Main Widget Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#FFD700] to-[#B8860B] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-black/20 rounded-full flex items-center justify-center">
                  <Scissors className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-black font-bold">{BUSINESS_CONFIG.name}</p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400"
                      }`}
                    />
                    <p className="text-black/70 text-xs">{statusMessage}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-black/60 hover:text-black p-2 -m-2 rounded-full hover:bg-black/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Business Hours Banner */}
          <div className="bg-gray-50 px-4 py-2 flex items-center gap-2 text-gray-600 text-sm border-b">
            <Clock className="w-4 h-4" />
            <span>Open daily: 9am - 7pm</span>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-b bg-white">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-3 font-medium">
              Quick Actions
            </p>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <Link
                  key={action.id}
                  href={action.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 p-3 rounded-xl transition-all ${
                    action.primary
                      ? "bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-semibold"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <action.icon className="w-4 h-4" />
                  <span className="text-sm">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Options */}
          <div className="p-4 bg-white">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-3 font-medium">
              Contact Us
            </p>
            <div className="space-y-2">
              {contactOptions.map((option) => (
                <a
                  key={option.id}
                  href={option.href}
                  target={option.external ? "_blank" : undefined}
                  rel={option.external ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div
                    className={`w-10 h-10 ${option.color} rounded-full flex items-center justify-center transition-transform group-hover:scale-110`}
                  >
                    <option.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium text-sm">
                      {option.label}
                    </p>
                    <p className="text-gray-500 text-xs">{option.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 flex items-center gap-2 text-gray-500 text-xs">
            <MapPin className="w-3 h-3" />
            <span>{BUSINESS_CONFIG.location}</span>
          </div>
        </div>
      )}

      {/* Main Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          isOpen
            ? "bg-gray-700 hover:bg-gray-800 rotate-0"
            : "bg-gradient-to-r from-[#FFD700] to-[#B8860B] hover:scale-110"
        }`}
        aria-label="Contact us"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-7 h-7 text-black" />
        )}

        {/* Online indicator on button */}
        {!isOpen && (
          <span
            className={`absolute top-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
              isOnline ? "bg-green-500" : "bg-gray-400"
            }`}
          />
        )}
      </button>

      {/* Pulse animation when closed */}
      {!isOpen && (
        <span className="absolute inset-0 rounded-full bg-[#FFD700] animate-ping opacity-20 pointer-events-none" />
      )}
    </div>
  );
}
