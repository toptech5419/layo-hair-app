"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Home,
  Scissors,
  Image,
  Search,
  User,
  Phone,
  Calendar,
  Instagram,
  MessageCircle,
  Clock,
  MapPin,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Home", icon: Home, description: "Back to homepage" },
  { href: "/styles", label: "Styles", icon: Scissors, description: "Browse our styles" },
  { href: "/gallery", label: "Gallery", icon: Image, description: "See our work" },
  { href: "/book", label: "Book Now", icon: Calendar, description: "Schedule appointment" },
  { href: "/track", label: "Track Booking", icon: Search, description: "Check your booking" },
  { href: "/about", label: "About", icon: User, description: "Learn about us" },
  { href: "/contact", label: "Contact", icon: Phone, description: "Get in touch" },
];

const contactInfo = {
  phone: "+447350167537",
  whatsapp: "+447350167537",
  hours: "9am - 7pm Daily",
  location: "Lincoln, UK",
};

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#FFD700]/20 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-1 z-50">
            <span className="text-2xl font-bold text-[#FFD700]">LAYO</span>
            <span className="text-2xl font-light text-white">HAIR</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.filter(link => link.href !== "/book").map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-[#FFD700] ${
                  pathname === link.href ? "text-[#FFD700]" : "text-white/80"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button asChild className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-semibold">
              <Link href="/book">Book Now</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden relative z-50 w-10 h-10 flex items-center justify-center"
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-5">
              {/* Hamburger lines that animate to X */}
              <span
                className={`absolute left-0 w-full h-0.5 bg-current transform transition-all duration-300 ease-out ${
                  isOpen
                    ? "top-2 rotate-45 bg-white"
                    : "top-0 bg-[#FFD700]"
                }`}
              />
              <span
                className={`absolute left-0 top-2 w-full h-0.5 bg-[#FFD700] transition-all duration-300 ease-out ${
                  isOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
                }`}
              />
              <span
                className={`absolute left-0 w-full h-0.5 bg-current transform transition-all duration-300 ease-out ${
                  isOpen
                    ? "top-2 -rotate-45 bg-white"
                    : "top-4 bg-[#FFD700]"
                }`}
              />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          isOpen ? "visible" : "invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`absolute inset-y-0 right-0 w-full max-w-sm bg-gradient-to-b from-black via-zinc-950 to-black transform transition-transform duration-500 ease-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />
          <div className="absolute top-20 right-0 w-64 h-64 bg-[#FFD700]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-0 w-48 h-48 bg-[#FFD700]/5 rounded-full blur-3xl" />

          {/* Menu Content */}
          <div className="relative h-full flex flex-col pt-20 pb-8 px-6 overflow-y-auto">
            {/* Brand Header */}
            <div
              className={`mb-8 transition-all duration-500 delay-100 ${
                isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-[#FFD700]" />
                <span className="text-[#FFD700] text-sm font-medium">Premium Hair Styling</span>
              </div>
              <h2 className="text-2xl font-bold text-white">
                Where Every Strand <span className="text-[#FFD700]">Tells a Story</span>
              </h2>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1">
              <ul className="space-y-1">
                {navLinks.map((link, index) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;

                  return (
                    <li
                      key={link.href}
                      className={`transition-all duration-500 ${
                        isOpen
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 translate-x-8"
                      }`}
                      style={{ transitionDelay: `${150 + index * 50}ms` }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`group flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                          isActive
                            ? "bg-[#FFD700]/10 border border-[#FFD700]/30"
                            : "hover:bg-white/5"
                        }`}
                      >
                        {/* Icon */}
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            isActive
                              ? "bg-[#FFD700] text-black"
                              : "bg-white/5 text-[#FFD700] group-hover:bg-[#FFD700]/20"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>

                        {/* Text */}
                        <div className="flex-1">
                          <span
                            className={`block font-semibold transition-colors ${
                              isActive ? "text-[#FFD700]" : "text-white group-hover:text-[#FFD700]"
                            }`}
                          >
                            {link.label}
                          </span>
                          <span className="text-white/50 text-sm">{link.description}</span>
                        </div>

                        {/* Arrow */}
                        <ChevronRight
                          className={`w-5 h-5 transition-all duration-300 ${
                            isActive
                              ? "text-[#FFD700]"
                              : "text-white/30 group-hover:text-[#FFD700] group-hover:translate-x-1"
                          }`}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Contact Section */}
            <div
              className={`mt-6 pt-6 border-t border-white/10 transition-all duration-500 delay-500 ${
                isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {/* Quick Contact */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <a
                  href={`https://wa.me/${contactInfo.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded-xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">WhatsApp</span>
                </a>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="flex items-center gap-2 p-3 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span className="text-sm font-medium">Call Us</span>
                </a>
              </div>

              {/* Business Info */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-white/60">
                  <Clock className="w-4 h-4 text-[#FFD700]" />
                  <span>Open {contactInfo.hours}</span>
                </div>
                <div className="flex items-center gap-3 text-white/60">
                  <MapPin className="w-4 h-4 text-[#FFD700]" />
                  <span>{contactInfo.location}</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4 mt-6">
                <a
                  href="https://instagram.com/layohair"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-[#FFD700] hover:bg-white/10 transition-all"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href={`https://wa.me/${contactInfo.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-[#25D366] hover:bg-white/10 transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Footer Branding */}
            <div
              className={`mt-6 text-center transition-all duration-500 delay-600 ${
                isOpen ? "opacity-100" : "opacity-0"
              }`}
            >
              <p className="text-white/30 text-xs">
                © 2025 LAYO HAIR. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
