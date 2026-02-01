"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Adaeze Okonkwo",
    role: "Regular Client",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop",
    rating: 5,
    text: "LAYO HAIR is absolutely amazing! My knotless braids were perfect and lasted for 2 months. The attention to detail is unmatched. I always leave feeling like a queen!",
    style: "Knotless Braids",
  },
  {
    id: 2,
    name: "Ngozi Eze",
    role: "First-time Client",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    rating: 5,
    text: "I was nervous about trying a new stylist, but Layo made me feel so comfortable. My passion twists came out beautiful and the price was very fair. Highly recommend!",
    style: "Passion Twists",
  },
  {
    id: 3,
    name: "Funke Adeyemi",
    role: "Regular Client",
    image: "https://images.unsplash.com/photo-1523263685509-57c1d050d19b?w=100&h=100&fit=crop",
    rating: 5,
    text: "Best hair stylist in Lagos! I've been coming here for 2 years and the quality is always consistent. The online booking system makes it so easy to schedule appointments.",
    style: "Goddess Locs",
  },
  {
    id: 4,
    name: "Chidinma Nwankwo",
    role: "Regular Client",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 5,
    text: "The Fulani braids I got were stunning! Everyone kept asking where I got my hair done. Layo is truly talented and professional. Will definitely be back!",
    style: "Fulani Braids",
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section className="py-20 bg-zinc-950 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-[#FFD700] text-sm font-semibold uppercase tracking-wider">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-4">
            What Our <span className="text-[#FFD700]">Clients</span> Say
          </h2>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Quote Icon */}
          <div className="absolute -top-4 left-0 opacity-10">
            <Quote className="w-24 h-24 text-[#FFD700]" />
          </div>

          {/* Main Testimonial */}
          <div className="bg-zinc-900 border border-[#FFD700]/10 rounded-2xl p-8 md:p-12 relative">
            {/* Stars */}
            <div className="flex gap-1 mb-6 justify-center">
              {[...Array(current.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-[#FFD700] fill-[#FFD700]" />
              ))}
            </div>

            {/* Quote */}
            <p className="text-white/80 text-lg md:text-xl text-center leading-relaxed mb-8">
              &ldquo;{current.text}&rdquo;
            </p>

            {/* Style Badge */}
            <div className="flex justify-center mb-6">
              <span className="bg-[#FFD700]/10 text-[#FFD700] text-sm px-4 py-1 rounded-full">
                {current.style}
              </span>
            </div>

            {/* Author */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#FFD700]/30 mb-3">
                <Image
                  src={current.image}
                  alt={current.name}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
              <h4 className="text-white font-semibold">{current.name}</h4>
              <p className="text-white/50 text-sm">{current.role}</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prevTestimonial}
              className="w-10 h-10 rounded-full border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700] hover:bg-[#FFD700]/10 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-[#FFD700] w-6"
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="w-10 h-10 rounded-full border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700] hover:bg-[#FFD700]/10 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
