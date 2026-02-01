"use client";

import Link from "next/link";
import { Instagram, Facebook, MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 border-t border-white/10">
      {/* Main Footer - Horizontal Layout */}
      <div className="container mx-auto px-4 py-8">
        {/* Top Row - Brand + Links */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-white/5">
          {/* Brand */}
          <Link href="/" className="inline-flex items-center space-x-1">
            <span className="text-xl font-bold text-[#FFD700]">LAYO</span>
            <span className="text-xl font-light text-white">HAIR</span>
          </Link>

          {/* Navigation Links - Horizontal */}
          <nav className="flex flex-wrap items-center gap-6">
            <Link href="/styles" className="text-white/60 hover:text-[#FFD700] text-sm transition-colors">
              Styles
            </Link>
            <Link href="/book" className="text-white/60 hover:text-[#FFD700] text-sm transition-colors">
              Book
            </Link>
            <Link href="/gallery" className="text-white/60 hover:text-[#FFD700] text-sm transition-colors">
              Gallery
            </Link>
            <Link href="/contact" className="text-white/60 hover:text-[#FFD700] text-sm transition-colors">
              Contact
            </Link>
          </nav>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a
              href={siteConfig.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-[#FFD700] hover:bg-white/10 transition-all"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={siteConfig.links.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-[#FFD700] hover:bg-white/10 transition-all"
              aria-label="Facebook"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href={siteConfig.links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-[#25D366] hover:bg-white/10 transition-all"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Bottom Row - Contact Info + Copyright - All Horizontal */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-6">
          {/* Contact Info - Horizontal */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm">
            <a
              href={siteConfig.contact.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-white/50 hover:text-[#FFD700] transition-colors"
            >
              <MapPin className="h-3.5 w-3.5" />
              <span>{siteConfig.contact.fullAddress}</span>
            </a>
            <a
              href={`tel:${siteConfig.contact.whatsapp}`}
              className="flex items-center gap-1.5 text-white/50 hover:text-[#FFD700] transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>{siteConfig.contact.phone}</span>
            </a>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="flex items-center gap-1.5 text-white/50 hover:text-[#FFD700] transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>{siteConfig.contact.email}</span>
            </a>
          </div>

          {/* Copyright + Legal */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-white/30">
            <span>© {currentYear} {siteConfig.name}</span>
            <Link href="/privacy" className="hover:text-white/50 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white/50 transition-colors">Terms</Link>
            <Link href="/admin/login" className="hover:text-white/40 transition-colors">Staff</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
