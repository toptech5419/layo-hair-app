"use client";

import Image from "next/image";
import Link from "next/link";
import { Instagram, ArrowRight, Sparkles, Award, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const highlights = [
  { icon: Award, text: "5+ Years Experience" },
  { icon: Sparkles, text: "Specialized in Protective Styles" },
  { icon: Heart, text: "Passionate About African Hair" },
];

export function StylistProfile() {
  return (
    <section className="py-20 bg-zinc-950 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl -translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <div className="relative animate-fade-in-left">
            {/* Main image */}
            <div className="relative aspect-[4/5] max-w-md mx-auto">
              {/* Decorative frame */}
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-[#FFD700]/30 rounded-2xl" />

              {/* Image container */}
              <div className="relative w-full h-full overflow-hidden rounded-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=750&fit=crop"
                  alt="Layo - Professional Hair Stylist"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              {/* Experience badge */}
              <div className="absolute -bottom-4 -right-4 glass-card rounded-xl p-4">
                <div className="text-center">
                  <span className="block text-3xl font-bold text-[#FFD700]">5+</span>
                  <span className="text-white/70 text-sm">Years of Excellence</span>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-8 -right-8 w-16 h-16 border border-[#FFD700]/20 rounded-full" />
              <div className="absolute -bottom-8 -left-8 w-24 h-24 border border-[#FFD700]/20 rounded-full" />
            </div>
          </div>

          {/* Content Section */}
          <div className="animate-fade-in-right">
            {/* Label */}
            <span className="inline-flex items-center gap-2 text-[#FFD700] text-sm font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-4 h-4" />
              Meet Your Stylist
            </span>

            {/* Name */}
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Hi, I&apos;m <span className="text-[#FFD700]">Layo</span>
            </h2>

            {/* Bio */}
            <p className="text-white/70 text-lg leading-relaxed mb-6">
              Welcome to LAYO HAIR! I&apos;m a passionate hair stylist with over 5 years
              of experience specializing in African hair textures and protective styles.
              My mission is to help every woman feel beautiful and confident with
              hairstyles that celebrate their unique beauty.
            </p>

            <p className="text-white/60 leading-relaxed mb-8">
              From intricate braiding patterns to stunning locs, I take pride in
              creating looks that not only protect your natural hair but also make
              you feel like the queen you are. Every strand tells a story, and I&apos;m
              here to help you tell yours.
            </p>

            {/* Highlights */}
            <div className="space-y-3 mb-8">
              {highlights.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFD700]/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-[#FFD700]" />
                  </div>
                  <span className="text-white/80">{item.text}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-semibold"
              >
                <Link href="/book">
                  Book With Me
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700]/10"
              >
                <a
                  href="https://instagram.com/layohair"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="mr-2 h-5 w-5" />
                  Follow on Instagram
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
