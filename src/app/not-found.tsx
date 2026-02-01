import Link from "next/link";
import { ArrowLeft, Home, Calendar, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center max-w-lg">
        {/* 404 Number */}
        <div className="mb-8">
          <span className="text-[150px] md:text-[200px] font-bold leading-none bg-gradient-to-b from-[#FFD700] to-[#FFD700]/20 bg-clip-text text-transparent">
            404
          </span>
        </div>

        {/* Message */}
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Oops! Page Not Found
        </h1>
        <p className="text-white/60 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Don&apos;t worry, let&apos;s get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            asChild
            size="lg"
            className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-semibold"
          >
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Go Home
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700]/10"
          >
            <Link href="/book">
              <Calendar className="mr-2 h-5 w-5" />
              Book Appointment
            </Link>
          </Button>
        </div>

        {/* Quick Links */}
        <div className="border-t border-white/10 pt-8">
          <p className="text-white/50 text-sm mb-4">Or try these popular pages:</p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            <Link
              href="/styles"
              className="text-[#FFD700] hover:text-[#FFD700]/80 text-sm flex items-center gap-1 py-2 px-3 rounded-lg hover:bg-[#FFD700]/10 active:bg-[#FFD700]/20 min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4" />
              Browse Styles
            </Link>
            <Link
              href="/gallery"
              className="text-[#FFD700] hover:text-[#FFD700]/80 text-sm flex items-center gap-1 py-2 px-3 rounded-lg hover:bg-[#FFD700]/10 active:bg-[#FFD700]/20 min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4" />
              View Gallery
            </Link>
            <Link
              href="/track"
              className="text-[#FFD700] hover:text-[#FFD700]/80 text-sm flex items-center gap-1 py-2 px-3 rounded-lg hover:bg-[#FFD700]/10 active:bg-[#FFD700]/20 min-h-[44px]"
            >
              <Search className="w-4 h-4" />
              Track Booking
            </Link>
            <Link
              href="/contact"
              className="text-[#FFD700] hover:text-[#FFD700]/80 text-sm flex items-center gap-1 py-2 px-3 rounded-lg hover:bg-[#FFD700]/10 active:bg-[#FFD700]/20 min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4" />
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
