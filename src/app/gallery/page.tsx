"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

const galleryImages = [
  { id: 1, src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=800&fit=crop", category: "Braids", title: "Knotless Braids" },
  { id: 2, src: "https://images.unsplash.com/photo-1595959183082-7b570b7e1daf?w=600&h=800&fit=crop", category: "Braids", title: "Fulani Braids" },
  { id: 3, src: "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=600&h=800&fit=crop", category: "Locs", title: "Goddess Locs" },
  { id: 4, src: "https://images.unsplash.com/photo-1534180477871-5d6cc81f3920?w=600&h=800&fit=crop", category: "Braids", title: "French Curls" },
  { id: 5, src: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?w=600&h=800&fit=crop", category: "Twists", title: "Passion Twists" },
  { id: 6, src: "https://images.unsplash.com/photo-1523263685509-57c1d050d19b?w=600&h=800&fit=crop", category: "Locs", title: "Butterfly Locs" },
  { id: 7, src: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&h=800&fit=crop", category: "Braids", title: "Box Braids" },
  { id: 8, src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=800&fit=crop", category: "Twists", title: "Senegalese Twists" },
  { id: 9, src: "https://images.unsplash.com/photo-1594369908155-60ced2a37e59?w=600&h=800&fit=crop", category: "Braids", title: "Boho Braids" },
  { id: 10, src: "https://images.unsplash.com/photo-1611077544695-e0e15a56077f?w=600&h=800&fit=crop", category: "Cornrows", title: "Classic Cornrows" },
  { id: 11, src: "https://images.unsplash.com/photo-1580501170888-80668882ca0c?w=600&h=800&fit=crop", category: "Locs", title: "Soft Locs" },
  { id: 12, src: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=600&h=800&fit=crop", category: "Braids", title: "Tribal Braids" },
];

const categories = ["All", "Braids", "Locs", "Twists", "Cornrows"];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

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

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % filteredImages.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => openLightbox(index)}
                  className="group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer"
                >
                  <Image
                    src={image.src}
                    alt={image.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[#FFD700] text-xs font-medium">{image.category}</span>
                    <span className="text-white font-semibold mt-1">{image.title}</span>
                  </div>
                </button>
              ))}
            </div>

            {filteredImages.length === 0 && (
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
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/60 hover:text-white p-2"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 text-white/60 hover:text-white p-2"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          <div className="relative w-full max-w-4xl aspect-[3/4] mx-4">
            <Image
              src={filteredImages[currentImage].src}
              alt={filteredImages[currentImage].title}
              fill
              className="object-contain"
            />
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <span className="text-[#FFD700] text-sm">{filteredImages[currentImage].category}</span>
              <h3 className="text-white text-xl font-semibold">{filteredImages[currentImage].title}</h3>
            </div>
          </div>

          <button
            onClick={nextImage}
            className="absolute right-4 text-white/60 hover:text-white p-2"
          >
            <ChevronRight className="w-10 h-10" />
          </button>

          <div className="absolute bottom-4 left-0 right-0 text-center text-white/40 text-sm">
            {currentImage + 1} / {filteredImages.length}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
