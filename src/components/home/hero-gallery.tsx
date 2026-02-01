"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const heroImages = [
  {
    src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=500&fit=crop",
    alt: "Beautiful knotless braids",
  },
  {
    src: "https://images.unsplash.com/photo-1595959183082-7b570b7e1daf?w=400&h=500&fit=crop",
    alt: "Elegant Fulani braids",
  },
  {
    src: "https://images.unsplash.com/photo-1534180477871-5d6cc81f3920?w=400&h=500&fit=crop",
    alt: "Stunning French curls",
  },
  {
    src: "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=400&h=500&fit=crop",
    alt: "Gorgeous goddess locs",
  },
  {
    src: "https://images.unsplash.com/photo-1522337094846-8a818192de1f?w=400&h=500&fit=crop",
    alt: "Beautiful box braids",
  },
  {
    src: "https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?w=400&h=500&fit=crop",
    alt: "Twist protective style",
  },
];

export function HeroGallery() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[400px] md:min-h-[600px]">
      {/* Main grid layout */}
      <div className="grid grid-cols-3 grid-rows-2 gap-3 h-full p-4">
        {heroImages.slice(0, 6).map((image, index) => (
          <div
            key={index}
            className={`relative overflow-hidden rounded-xl transition-all duration-700 ${
              index === activeIndex
                ? "ring-2 ring-[#FFD700] scale-105 z-10"
                : "opacity-70 hover:opacity-100"
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-700 hover:scale-110"
              sizes="(max-width: 768px) 33vw, 20vw"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

            {/* Active indicator */}
            {index === activeIndex && (
              <div className="absolute bottom-2 left-2 right-2">
                <div className="h-0.5 bg-[#FFD700] rounded-full animate-pulse" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-4 -right-4 w-24 h-24 border border-[#FFD700]/20 rounded-full" />
      <div className="absolute -bottom-4 -left-4 w-16 h-16 border border-[#FFD700]/30 rounded-full" />
    </div>
  );
}
