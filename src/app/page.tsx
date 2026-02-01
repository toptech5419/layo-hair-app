import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Testimonials } from "@/components/common/testimonials";

// Featured styles data (prices in GBP)
const featuredStyles = [
  {
    id: "1",
    name: "Knotless Braids",
    slug: "knotless-braids",
    price: 120,
    duration: 240,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=500&fit=crop",
  },
  {
    id: "2",
    name: "Fulani Braids",
    slug: "fulani-braids",
    price: 150,
    duration: 300,
    image: "https://images.unsplash.com/photo-1595959183082-7b570b7e1daf?w=400&h=500&fit=crop",
  },
  {
    id: "3",
    name: "French Curls",
    slug: "french-curls",
    price: 160,
    duration: 300,
    image: "https://images.unsplash.com/photo-1534180477871-5d6cc81f3920?w=400&h=500&fit=crop",
  },
  {
    id: "4",
    name: "Goddess Locs",
    slug: "goddess-locs",
    price: 180,
    duration: 360,
    image: "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=400&h=500&fit=crop",
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(price);
}

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours} hr${hours > 1 ? "s" : ""}`;
  return `${hours} hr${hours > 1 ? "s" : ""} ${mins} mins`;
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-zinc-900" />

          {/* Gold accent lines */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />

          <div className="relative z-10 container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-full px-4 py-2">
                <Sparkles className="w-4 h-4 text-[#FFD700]" />
                <span className="text-[#FFD700] text-sm font-medium">Premium Hair Styling</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                Where Every Strand{" "}
                <span className="text-[#FFD700]">Tells a Story</span>
              </h1>

              {/* Subheading */}
              <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto">
                Experience the art of African hair styling. From braids to locs,
                we create stunning looks that celebrate your unique beauty.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90 text-lg px-8 py-6 font-semibold"
                >
                  <Link href="/book">
                    Book Appointment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700]/10 text-lg px-8 py-6"
                >
                  <Link href="/styles">Browse Styles</Link>
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-white/60">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#FFD700] fill-[#FFD700]" />
                  <span>4.9 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-[#FFD700]">500+</span>
                  <span>Happy Clients</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-[#FFD700]">5+</span>
                  <span>Years Experience</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-[#FFD700]/50 rounded-full flex items-start justify-center p-2">
              <div className="w-1.5 h-3 bg-[#FFD700] rounded-full animate-pulse" />
            </div>
          </div>
        </section>

        {/* Featured Styles Section */}
        <section className="py-20 bg-zinc-950">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Featured <span className="text-[#FFD700]">Styles</span>
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto">
                Explore our most popular hairstyles, crafted with precision and care
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredStyles.map((style) => (
                <Link
                  key={style.id}
                  href={`/styles/${style.slug}`}
                  className="group relative bg-zinc-900 rounded-xl overflow-hidden border border-[#FFD700]/10 hover:border-[#FFD700]/30 transition-all duration-300"
                >
                  {/* Style Image */}
                  <div className="aspect-[3/4] bg-zinc-800 relative overflow-hidden">
                    <Image
                      src={style.image}
                      alt={style.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-[#FFD700]/0 group-hover:bg-[#FFD700]/10 transition-colors z-20" />
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                    <h3 className="text-lg font-semibold text-white group-hover:text-[#FFD700] transition-colors">
                      {style.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[#FFD700] font-bold">
                        {formatPrice(style.price)}
                      </span>
                      <span className="text-white/60 text-sm flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDuration(style.duration)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-10">
              <Button
                asChild
                variant="outline"
                className="border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700]/10"
              >
                <Link href="/styles">
                  View All Styles
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Why Choose <span className="text-[#FFD700]">LAYO HAIR</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Expert Stylists",
                  description:
                    "Our team of skilled professionals specializes in African hair textures and protective styles.",
                  icon: "✨",
                },
                {
                  title: "Premium Products",
                  description:
                    "We use only high-quality, hair-friendly products that nourish and protect your natural hair.",
                  icon: "💎",
                },
                {
                  title: "Easy Booking",
                  description:
                    "Book your appointment online 24/7. No account needed, just pick your style and time.",
                  icon: "📱",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-zinc-900/50 border border-[#FFD700]/10 rounded-xl p-8 text-center hover:border-[#FFD700]/30 transition-colors"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-white/60">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <Testimonials />

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-[#FFD700]/20 via-[#FFD700]/10 to-[#FFD700]/20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Look?
            </h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">
              Book your appointment today and let us create a stunning style just for you.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90 text-lg px-8 py-6 font-semibold"
            >
              <Link href="/book">
                Book Now
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
