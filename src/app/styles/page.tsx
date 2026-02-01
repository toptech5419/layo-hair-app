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
    duration: style.duration,
    description: style.description || "",
    image: style.images?.[0] || "",
    isFeatured: style.isFeatured,
  }));

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-b from-zinc-900 to-black">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our <span className="text-[#FFD700]">Styles</span>
            </h1>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              Explore our collection of stunning hairstyles. From braids to
              locs, find the perfect look for you.
            </p>
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
