import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { StylesFilter } from "@/components/styles/styles-filter";

export default async function StylesPage() {
  // Fetch all active styles from database
  const styles = await prisma.style.findMany({
    where: { isActive: true },
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
  });

  // Get unique categories
  const categories = ["All", ...new Set(styles.map((s) => s.category))];

  // Transform styles for client component
  const stylesData = styles.map((style) => ({
    id: style.id,
    name: style.name,
    slug: style.slug,
    category: style.category,
    price: Number(style.price),
    priceMax: style.priceMax ? Number(style.priceMax) : null,
    duration: style.duration,
    durationMax: style.durationMax ?? null,
    description: style.description || "",
    image: style.images?.[0] || "",
    isFeatured: style.isFeatured,
  }));

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-12 md:py-20 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #FFD700 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <span className="inline-block text-[#FFD700] text-sm font-medium tracking-wider uppercase mb-4 px-4 py-1.5 bg-[#FFD700]/10 rounded-full border border-[#FFD700]/20">
              Our Collection
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Discover Your Perfect{" "}
              <span className="text-[#FFD700] relative">
                Style
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M1 5.5C47 2 153 2 199 5.5" stroke="#FFD700" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>
            <p className="text-white/60 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
              From stunning braids to elegant locs, explore our curated collection of African hairstyles.
              Each style is crafted with precision and care.
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-8 md:gap-16 mt-10">
              <div className="text-center">
                <span className="block text-3xl md:text-4xl font-bold text-[#FFD700]">12+</span>
                <span className="text-white/50 text-sm">Style Categories</span>
              </div>
              <div className="text-center">
                <span className="block text-3xl md:text-4xl font-bold text-[#FFD700]">141</span>
                <span className="text-white/50 text-sm">Gallery Images</span>
              </div>
              <div className="text-center">
                <span className="block text-3xl md:text-4xl font-bold text-[#FFD700]">500+</span>
                <span className="text-white/50 text-sm">Happy Clients</span>
              </div>
            </div>
          </div>
        </section>

        {/* Styles with Filter */}
        <StylesFilter
          styles={stylesData}
          categories={categories}
        />

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-[#FFD700]/10 via-[#FFD700]/5 to-[#FFD700]/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Found Your Perfect Style?
            </h2>
            <p className="text-white/60 mb-6">
              Book your appointment now and let us bring your vision to life
            </p>
            <Button
              asChild
              size="lg"
              className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-semibold"
            >
              <Link href="/book">Book Appointment</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
