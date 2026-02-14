import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "500+", label: "Happy Clients" },
  { value: "5+", label: "Years Experience" },
  { value: "50+", label: "Styles Mastered" },
  { value: "4.9", label: "Average Rating" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />
      <main className="flex-1">
        {/* Hero + Story */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-zinc-900 to-black">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                About <span className="text-[#FFD700]">LAYO HAIR</span>
              </h1>
              <p className="text-white/70 text-lg leading-relaxed">
                Born from a deep love for African hair culture, LAYO HAIR is where traditional
                techniques meet modern trends. We specialize in creating stunning protective
                styles that celebrate your natural beauty — every braid, twist, and loc is a work of art.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 md:py-16 bg-zinc-950">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-3xl md:text-5xl font-bold text-[#FFD700]">{stat.value}</p>
                  <p className="text-white/60 mt-1 text-sm md:text-base">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Founder */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-zinc-900 border border-[#FFD700]/10 rounded-2xl p-8 md:p-12">
                <div className="flex flex-col items-center text-center gap-6">
                  <div className="w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden flex-shrink-0 border-4 border-[#FFD700]/30">
                    <Image
                      src="/layo-profile.jpeg"
                      alt="Layo - Founder & Lead Stylist"
                      width={192}
                      height={192}
                      className="object-cover object-[50%_65%] w-full h-full"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">Layo</h3>
                    <p className="text-[#FFD700] mb-4">Founder & Lead Stylist</p>
                    <p className="text-white/60 leading-relaxed">
                      With over 5 years of experience in protective styling, Layo has mastered the art
                      of creating hairstyles that are both beautiful and healthy for your hair. Her
                      attention to detail and genuine care for each client has made LAYO HAIR a
                      go-to destination for hair transformations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20 bg-gradient-to-r from-[#FFD700]/20 via-[#FFD700]/10 to-[#FFD700]/20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Look?
            </h2>
            <p className="text-white/60 mb-8 max-w-md mx-auto">
              Book your appointment today and let us create something beautiful.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-semibold">
                <Link href="/book">
                  Book Appointment <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700]/10">
                <Link href="/styles">View Our Styles</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
