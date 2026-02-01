"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GalleryItem {
  id: string;
  image: string;
  title: string;
  category: string;
  slug: string;
}

export function WorkGallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch("/api/styles?featured=true");
        const styles = await res.json();

        // Get featured styles with images (max 6)
        const items: GalleryItem[] = styles
          .filter((style: any) => style.images?.length > 0)
          .slice(0, 6)
          .map((style: any) => ({
            id: style.id,
            image: style.images[0],
            title: style.name,
            category: style.category.charAt(0) + style.category.slice(1).toLowerCase(),
            slug: style.slug,
          }));

        setGalleryItems(items);
      } catch (error) {
        console.error("Failed to fetch gallery:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchGallery();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Our <span className="text-[#FFD700]">Work</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[3/4] bg-zinc-800 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Our <span className="text-[#FFD700]">Work</span>
          </h2>
          <p className="text-white/60 mt-3 max-w-lg mx-auto">
            Browse through our collection of stunning hairstyles
          </p>
        </div>

        {/* Grid - 6 items, clean layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryItems.map((item) => (
            <Link
              key={item.id}
              href={`/styles/${item.slug}`}
              className="relative group cursor-pointer"
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                    <Scissors className="w-12 h-12 text-zinc-600" />
                  </div>
                )}

                {/* Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${
                    hoveredId === item.id ? "opacity-100" : "opacity-60"
                  }`}
                />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="text-[#FFD700] text-xs uppercase tracking-wider">
                    {item.category}
                  </span>
                  <h3 className="text-white font-semibold mt-1">{item.title}</h3>
                </div>

                {/* Border on hover */}
                <div
                  className={`absolute inset-0 rounded-xl border-2 transition-colors duration-300 ${
                    hoveredId === item.id ? "border-[#FFD700]" : "border-transparent"
                  }`}
                />
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Button
            asChild
            variant="outline"
            className="border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700]/10"
          >
            <Link href="/gallery">
              View Full Gallery
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
