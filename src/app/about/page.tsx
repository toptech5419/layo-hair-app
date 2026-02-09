import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Heart, Award, Users, Sparkles } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "500+", label: "Happy Clients" },
  { value: "5+", label: "Years Experience" },
  { value: "50+", label: "Styles Mastered" },
  { value: "4.9", label: "Average Rating" },
];

const values = [
  {
    icon: Heart,
    title: "Passion for Hair",
    description: "Creating hairstyles that make you feel confident and beautiful.",
  },
  {
    icon: Award,
    title: "Excellence in Craft",
    description: "Staying updated with the latest techniques for exceptional results.",
  },
  {
    icon: Users,
    title: "Client-Centered",
    description: "We listen to your needs and work together for your dream look.",
  },
  {
    icon: Sparkles,
    title: "Quality Products",
    description: "Premium, hair-friendly products that protect your natural hair.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-12 bg-gradient-to-b from-zinc-900 to-black">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              About <span className="text-[#FFD700]">LAYO HAIR</span>
            </h1>
            <p className="text-white/60 max-w-2xl mx-auto">
              Where African hair artistry meets modern elegance. We specialize in creating
              stunning protective styles that celebrate your natural beauty.
            </p>
          </div>
        </section>

        {/* Stats strip */}
        <section className="py-6 bg-zinc-950 border-y border-white/5">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-[#FFD700]">{stat.value}</p>
                  <p className="text-white/50 text-xs mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story + Founder merged */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start max-w-5xl mx-auto">
              {/* Story side */}
              <div>
                <span className="text-[#FFD700] text-xs font-semibold uppercase tracking-wider">Our Story</span>
                <h2 className="text-2xl md:text-3xl font-bold text-white mt-2 mb-4">
                  A Journey of Passion and Purpose
                </h2>
                <div className="space-y-3 text-white/60 text-sm leading-relaxed">
                  <p>
                    LAYO HAIR was born from a deep love for African hair culture and a desire to
                    create a space where every woman can feel celebrated. What started as a small
                    home-based venture has grown into a trusted name in hair styling.
                  </p>
                  <p>
                    Our founder combined traditional techniques with modern trends to create unique,
                    head-turning looks. Every braid, twist, and loc we create is a work of art.
                  </p>
                  <p>
                    Today, we continue to push boundaries while honoring the cultural heritage that
                    inspires our work — making every client leave feeling more beautiful and confident.
                  </p>
                </div>
                <Button asChild className="mt-6 bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
                  <Link href="/book">
                    Book With Us <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>

              {/* Founder side */}
              <div className="bg-zinc-900 border border-[#FFD700]/10 rounded-2xl p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#FFD700]/30 mb-4">
                    <Image
                      src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop"
                      alt="Founder"
                      width={128}
                      height={128}
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white">Layo</h3>
                  <p className="text-[#FFD700] text-sm mb-3">Founder & Lead Stylist</p>
                  <p className="text-white/60 text-sm leading-relaxed">
                    With over 5 years of experience in protective styling, Layo has mastered the art
                    of creating hairstyles that are both beautiful and healthy for your hair. Her
                    attention to detail and genuine care for each client has made LAYO HAIR a
                    go-to destination for hair transformations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values - compact 2x2 */}
        <section className="py-10 bg-zinc-950">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-xl font-bold text-white mb-6 text-center">
              What We <span className="text-[#FFD700]">Stand For</span>
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-zinc-900 border border-[#FFD700]/10 rounded-xl p-4 hover:border-[#FFD700]/30 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-[#FFD700]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <value.icon className="w-4 h-4 text-[#FFD700]" />
                    </div>
                    <h3 className="text-sm font-semibold text-white">{value.title}</h3>
                  </div>
                  <p className="text-white/50 text-xs leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
