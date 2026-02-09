"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Scissors, Calendar } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

interface GalleryImage {
  id: string;
  src: string;
  category: string;
  title: string;
  slug: string;
}

export default function GalleryPage() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch("/api/styles");
        const styles = await res.json();

        // Extract all images from all styles
        const images: GalleryImage[] = [];
        const categorySet = new Set<string>(["All"]);

        styles.forEach((style: any) => {
          const categoryName = style.category.charAt(0) + style.category.slice(1).toLowerCase();
          categorySet.add(categoryName);

          // Add all images from this style
          style.images?.forEach((imgUrl: string, index: number) => {
            images.push({
              id: `${style.id}-${index}`,
              src: imgUrl,
              category: categoryName,
              title: style.name,
              slug: style.slug,
            });
          });
        });

        setGalleryImages(images);
        setCategories(Array.from(categorySet));
      } catch (error) {
        console.error("Failed to fetch gallery:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchGallery();
  }, []);

  const filteredImages = selectedCategory === "All"
    ? galleryImages
    : galleryImages.filter((img) => img.category === selectedCategory);

  const openLightbox = (index: number) => {
    setCurrentImage(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = useCallback(() => {
    setCurrentImage((prev) => (prev + 1) % filteredImages.length);
  }, [filteredImages.length]);

  const prevImage = useCallback(() => {
    setCurrentImage((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  }, [filteredImages.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextImage();
      else if (e.key === "ArrowLeft") prevImage();
      else if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, nextImage, prevImage]);

  // Swipe support
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;
    if (diff > threshold) nextImage();      // Swipe left → next
    else if (diff < -threshold) prevImage(); // Swipe right → prev
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-b from-zinc-900 to-black">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our <span className="text-[#FFD700]">Gallery</span>
            </h1>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              Browse through our portfolio of stunning hairstyles. Every creation tells a unique story.
            </p>
          </div>
        </section>

        {/* Filter */}
        <section className="py-6 bg-zinc-950 border-b border-[#FFD700]/10 sticky top-16 z-30">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 overflow-x-auto pb-1 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? "bg-[#FFD700] text-black"
                      : "bg-zinc-900 text-white/70 hover:bg-zinc-800 hover:text-white"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="aspect-[3/4] bg-zinc-800 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredImages.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => openLightbox(index)}
                    className="group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer"
                  >
                    {image.src ? (
                      <Image
                        src={image.src}
                        alt={image.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                        <Scissors className="w-12 h-12 text-zinc-600" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[#FFD700] text-xs font-medium">{image.category}</span>
                      <span className="text-white font-semibold mt-1">{image.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {!loading && filteredImages.length === 0 && (
              <div className="text-center py-16">
                <p className="text-white/40">No images in this category yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-[#FFD700]/10 via-[#FFD700]/5 to-[#FFD700]/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Love What You See?</h2>
            <p className="text-white/60 mb-6">Book your appointment and get your dream hairstyle</p>
            <Button asChild size="lg" className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-semibold">
              <Link href="/book">Book Appointment</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Lightbox */}
      {lightboxOpen && filteredImages.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur-sm border-b border-white/5 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[#FFD700] text-xs font-medium">{filteredImages[currentImage].category}</span>
              <span className="text-white/20">·</span>
              <span className="text-white font-semibold text-sm truncate">{filteredImages[currentImage].title}</span>
            </div>
            <button
              onClick={closeLightbox}
              className="text-white/60 hover:text-white p-2 -mr-2 rounded-lg hover:bg-white/10 transition-colors shrink-0"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Image area with swipe */}
          <div
            className="flex-1 relative flex items-center justify-center overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={closeLightbox}
          >
            <div
              className="relative w-full h-full max-w-4xl mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={filteredImages[currentImage].src}
                alt={filteredImages[currentImage].title}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            {/* Prev button */}
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-0 top-0 bottom-0 w-16 sm:w-20 flex items-center justify-start pl-2 sm:pl-4 text-white/30 hover:text-white transition-colors group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/10 group-hover:bg-black/70 group-hover:border-[#FFD700]/30 transition-all">
                <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
            </button>

            {/* Next button */}
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-0 top-0 bottom-0 w-16 sm:w-20 flex items-center justify-end pr-2 sm:pr-4 text-white/30 hover:text-white transition-colors group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/10 group-hover:bg-black/70 group-hover:border-[#FFD700]/30 transition-all">
                <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
            </button>
          </div>

          {/* Bottom bar */}
          <div className="shrink-0 bg-black/80 backdrop-blur-sm border-t border-white/5 px-4 py-3 safe-area-bottom">
            <div className="flex items-center justify-between gap-3 max-w-4xl mx-auto">
              {/* Image counter */}
              <span className="text-white/40 text-xs font-medium tabular-nums">
                {currentImage + 1} / {filteredImages.length}
              </span>

              {/* Book button */}
              <Link
                href={`/book?style=${filteredImages[currentImage].slug}`}
                className="flex items-center gap-2 bg-[#FFD700] text-black px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-[#FFD700]/90 active:scale-[0.97] transition-all"
              >
                <Calendar className="w-4 h-4" />
                Book This Style
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
