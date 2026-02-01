"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Adaeze O.",
    image: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "My knotless braids were perfect and lasted for 2 months. The attention to detail is unmatched!",
    style: "Knotless Braids",
  },
  {
    id: 2,
    name: "Ngozi E.",
    image: "https://images.unsplash.com/photo-1499557354967-2b2d8910bcca?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "Layo made me feel so comfortable. My passion twists came out beautiful and the price was fair.",
    style: "Passion Twists",
  },
  {
    id: 3,
    name: "Funke A.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "Best hair stylist in Lincoln! I've been coming here for 2 years and the quality is always consistent.",
    style: "Goddess Locs",
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 bg-zinc-950">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Client <span className="text-[#FFD700]">Reviews</span>
          </h2>
        </div>

        {/* Testimonials Slider */}
        <div className="max-w-xl mx-auto">
          <div className="bg-white/5 rounded-2xl p-8 text-center">
            {/* Stars */}
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-[#FFD700] fill-[#FFD700]" />
              ))}
            </div>

            {/* Quote */}
            <p className="text-white/90 text-lg leading-relaxed mb-6">
              &ldquo;{testimonials[currentIndex].text}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={testimonials[currentIndex].image}
                  alt={testimonials[currentIndex].name}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="text-left">
                <h4 className="text-white font-semibold">{testimonials[currentIndex].name}</h4>
                <p className="text-[#FFD700] text-sm">{testimonials[currentIndex].style}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prevTestimonial}
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-[#FFD700] hover:bg-white/10 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-[#FFD700] w-6"
                      : "bg-white/30 w-2 hover:bg-white/50"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-[#FFD700] hover:bg-white/10 transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
