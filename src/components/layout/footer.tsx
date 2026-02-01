import Link from "next/link";
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail } from "lucide-react";
import { siteConfig } from "@/config/site";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-gold/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gold">LAYO</span>
              <span className="text-2xl font-light text-white">HAIR</span>
            </Link>
            <p className="text-white/60 text-sm">
              {siteConfig.tagline}
            </p>
            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href={siteConfig.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-gold transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href={siteConfig.links.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-gold transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-gold transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/styles" className="text-white/60 hover:text-gold text-sm transition-colors">
                  Our Styles
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-white/60 hover:text-gold text-sm transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/book" className="text-white/60 hover:text-gold text-sm transition-colors">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link href="/track" className="text-white/60 hover:text-gold text-sm transition-colors">
                  Track Booking
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/60 hover:text-gold text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/60 hover:text-gold text-sm transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li className="text-white/60 text-sm">Braids</li>
              <li className="text-white/60 text-sm">Cornrows</li>
              <li className="text-white/60 text-sm">Twists</li>
              <li className="text-white/60 text-sm">Locs</li>
              <li className="text-white/60 text-sm">Natural Hair</li>
              <li className="text-white/60 text-sm">Treatments</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                <span className="text-white/60 text-sm">{siteConfig.contact.address}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gold flex-shrink-0" />
                <a href={`tel:${siteConfig.contact.phone}`} className="text-white/60 text-sm hover:text-gold transition-colors">
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gold flex-shrink-0" />
                <a href={`mailto:${siteConfig.contact.email}`} className="text-white/60 text-sm hover:text-gold transition-colors">
                  {siteConfig.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gold/20 mt-8 pt-8 text-center">
          <p className="text-white/40 text-sm">
            &copy; {currentYear} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
