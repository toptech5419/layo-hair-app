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
    description: "We believe every strand tells a story. Our passion drives us to create hairstyles that make you feel confident and beautiful.",
  },
  {
    icon: Award,
    title: "Excellence in Craft",
    description: "We continuously refine our skills and stay updated with the latest techniques to deliver exceptional results every time.",
  },
  {
    icon: Users,
    title: "Client-Centered",
    description: "Your satisfaction is our priority. We listen to your needs and work together to achieve your dream look.",
  },
  {
    icon: Sparkles,
    title: "Quality Products",
    description: "We use only premium, hair-friendly products that protect and nourish your natural hair while creating stunning styles.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 bg-gradient-to-b from-zinc-900 to-black">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                About <span className="text-[#FFD700]">LAYO HAIR</span>
              </h1>
              <p className="text-white/60 text-lg md:text-xl leading-relaxed">
                Where African hair artistry meets modern elegance. We specialize in creating
                stunning protective styles that celebrate your natural beauty.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="aspect-[4/5] relative rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=750&fit=crop"
                  alt="Hair stylist at work"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <div>
                <span className="text-[#FFD700] text-sm font-semibold uppercase tracking-wider">Our Story</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mt-4 mb-6">
                  A Journey of Passion and Purpose
                </h2>
                <div className="space-y-4 text-white/70 leading-relaxed">
                  <p>
                    LAYO HAIR was born from a deep love for African hair culture and a desire to
                    create a space where every woman can feel celebrated. What started as a small
                    home-based venture has grown into a trusted name in hair styling.
                  </p>
                  <p>
                    Our founder, inspired by the rich traditions of African hairstyling, combined
                    traditional techniques with modern trends to create unique, head-turning looks.
                    Every braid, twist, and loc we create is a work of art.
                  </p>
                  <p>
                    Today, we continue to push boundaries, staying ahead of trends while honoring
                    the cultural heritage that inspires our work. Our mission is simple: to make
                    every client leave feeling more beautiful and confident than when they arrived.
                  </p>
                </div>
                <Button asChild className="mt-8 bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
                  <Link href="/book">
                    Book With Us <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-zinc-950">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-4xl md:text-5xl font-bold text-[#FFD700]">{stat.value}</p>
                  <p className="text-white/60 mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-[#FFD700] text-sm font-semibold uppercase tracking-wider">What We Stand For</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-4">Our Values</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-zinc-900 border border-[#FFD700]/10 rounded-xl p-6 hover:border-[#FFD700]/30 transition-colors"
                >
                  <div className="w-12 h-12 bg-[#FFD700]/10 rounded-xl flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-[#FFD700]" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
                  <p className="text-white/60 text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team/Founder */}
        <section className="py-20 bg-zinc-950">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-[#FFD700] text-sm font-semibold uppercase tracking-wider">Meet The Artist</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mt-4">The Hands Behind The Magic</h2>
              </div>
              <div className="bg-zinc-900 border border-[#FFD700]/10 rounded-2xl p-8 md:p-12">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-48 h-48 rounded-full overflow-hidden flex-shrink-0 border-4 border-[#FFD700]/30">
                    <Image
                      src="/layo-profile.jpeg"
                      alt="Layo - Founder & Lead Stylist"
                      width={192}
                      height={192}
                      className="object-cover object-[50%_65%] w-full h-full"
                    />
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-bold text-white mb-2">Layo</h3>
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
        <section className="py-20 bg-gradient-to-r from-[#FFD700]/20 via-[#FFD700]/10 to-[#FFD700]/20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Experience the LAYO HAIR Difference?
            </h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">
              Book your appointment today and let us create something beautiful together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-semibold">
                <Link href="/book">Book Appointment</Link>
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
