import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Testimonials } from "@/components/common/testimonials";
import { WorkGallery } from "@/components/home/work-gallery";
import { CategoryCards } from "@/components/home/category-cards";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section - African Braids Background */}
        <section className="relative min-h-[100vh] md:min-h-[90vh] flex items-end md:items-center overflow-hidden pb-8 md:pb-0">
          {/* Background Image - Lemonade Braids - Portrait optimized for mobile */}
          <div
            className="absolute inset-0 bg-cover bg-top md:bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://res.cloudinary.com/dtji1dxj5/image/upload/q_auto,f_auto/layo-hair/hero/lemonade-braids-hero.jpg')`,
            }}
          />
          {/* Gradient Overlay - Stronger on mobile for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/95 via-black/70 to-black/30 md:from-black/90 md:via-black/60 md:to-black/30" />

          {/* Content */}
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-xl">
              {/* Main Heading */}
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                <span className="text-[#FFD700]">LAYO</span> HAIR
              </h1>

              {/* Tagline */}
              <p className="text-xl md:text-2xl text-white/80 mt-4 font-light">
                Where Every Strand Tells a Story
              </p>

              {/* Brief Description */}
              <p className="text-white/60 mt-6 max-w-md leading-relaxed">
                Premium braids, locs, twists & protective styles in Lincoln.
                Experience the art of African hair styling.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mt-8">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-semibold px-8"
                >
                  <Link href="/book">
                    Book Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <Link href="/styles">View Styles</Link>
                </Button>
              </div>

              {/* Trust Indicator */}
              <div className="flex items-center gap-4 mt-8">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />
                  ))}
                </div>
                <span className="text-white/70 text-sm">500+ Happy Clients</span>
              </div>
            </div>
          </div>
        </section>

        {/* Services - Category Cards */}
        <CategoryCards />

        {/* Portfolio - Work Gallery */}
        <WorkGallery />

        {/* Social Proof - Testimonials */}
        <Testimonials />

        {/* Final CTA */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready for Your New Look?
            </h2>
            <p className="text-white/60 mb-8 max-w-md mx-auto">
              Book your appointment today.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-semibold px-10"
            >
              <Link href="/book">
                Book Appointment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
