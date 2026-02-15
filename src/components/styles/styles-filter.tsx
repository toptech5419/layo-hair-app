"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, Search, Filter, Star, Scissors, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Style {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  priceMax?: number | null;
  duration: number;
  durationMax?: number | null;
  description: string;
  image: string;
  isFeatured: boolean;
}

interface StylesFilterProps {
  styles: Style[];
  categories: string[];
}

// Format category names nicely
function formatCategory(category: string): string {
  const categoryNames: Record<string, string> = {
    BRAIDS: "Braids",
    CORNROWS: "Cornrows",
    TWISTS: "Twists",
    LOCS: "Locs",
    NATURAL: "Natural",
    WEAVES: "Weaves",
    WIGS: "Wigs",
    TREATMENTS: "Treatments",
    OTHER: "Other",
    All: "All Styles",
  };
  return categoryNames[category] || category;
}

function formatPrice(price: number, priceMax?: number | null) {
  const fmt = (val: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  if (priceMax && priceMax > price) return `${fmt(price)} - ${fmt(priceMax)}`;
  return fmt(price);
}

function formatDuration(minutes: number, maxMinutes?: number | null) {
  const fmt = (m: number) => {
    const hours = Math.floor(m / 60);
    const mins = m % 60;
    if (hours === 0) return `${mins} min`;
    return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
  };
  if (maxMinutes && maxMinutes > minutes) return `${fmt(minutes)} - ${fmt(maxMinutes)}`;
  return fmt(minutes);
}

export function StylesFilter({ styles, categories }: StylesFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStyles = styles.filter((style) => {
    const matchesCategory =
      selectedCategory === "All" || style.category === selectedCategory;
    const matchesSearch =
      style.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      style.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort categories in a logical order
  const categoryOrder = ["All", "BRAIDS", "CORNROWS", "LOCS", "TWISTS", "NATURAL", "WEAVES", "WIGS", "TREATMENTS", "OTHER"];
  const sortedCategories = categories.sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
  });

  return (
    <>
      {/* Filters - Sticky Header */}
      <section className="py-4 md:py-6 bg-zinc-950/95 backdrop-blur-md border-b border-[#FFD700]/10 sticky top-16 z-30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative w-full max-w-md mx-auto md:mx-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FFD700]/60" />
              <Input
                placeholder="Search styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 bg-zinc-900/80 border-[#FFD700]/20 text-white placeholder:text-white/40 rounded-full focus:border-[#FFD700]/50 focus:ring-[#FFD700]/20"
              />
            </div>

            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:justify-center">
              {sortedCategories.map((category) => {
                const count = category === "All"
                  ? styles.length
                  : styles.filter(s => s.category === category).length;

                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
                      selectedCategory === category
                        ? "bg-[#FFD700] text-black shadow-lg shadow-[#FFD700]/20"
                        : "bg-zinc-900 text-white/70 hover:bg-zinc-800 hover:text-white border border-white/5 hover:border-[#FFD700]/30"
                    }`}
                  >
                    {formatCategory(category)}
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      selectedCategory === category
                        ? "bg-black/20 text-black"
                        : "bg-white/10 text-white/50"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Results Count */}
      <div className="container mx-auto px-4 py-4">
        <p className="text-white/40 text-sm">
          {filteredStyles.length === styles.length
            ? `Showing all ${styles.length} styles`
            : `Showing ${filteredStyles.length} of ${styles.length} styles`
          }
        </p>
      </div>

      {/* Styles Grid */}
      <section className="pb-12">
        <div className="container mx-auto px-4">
          {filteredStyles.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mx-auto mb-6">
                <Filter className="w-10 h-10 text-[#FFD700]/40" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No styles found</h3>
              <p className="text-white/50 max-w-md mx-auto">
                Try adjusting your search or selecting a different category
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="mt-6 px-6 py-2 bg-[#FFD700] text-black rounded-full font-medium hover:bg-[#FFD700]/90 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredStyles.map((style, index) => (
                <Link
                  key={style.id}
                  href={`/styles/${style.slug}`}
                  className="group relative bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 hover:border-[#FFD700]/40 transition-all duration-500 hover:shadow-xl hover:shadow-[#FFD700]/5"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Image Container */}
                  <div className="aspect-[3/4] relative overflow-hidden">
                    {style.image ? (
                      <Image
                        src={style.image}
                        alt={style.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
                        <Scissors className="w-16 h-16 text-[#FFD700]/20" />
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="text-xs bg-[#FFD700] text-black px-3 py-1.5 rounded-full font-semibold shadow-lg">
                        {formatCategory(style.category)}
                      </span>
                    </div>

                    {/* Featured Badge */}
                    {style.isFeatured && (
                      <div className="absolute top-3 right-3">
                        <span className="flex items-center gap-1 text-xs bg-black/60 backdrop-blur-sm text-[#FFD700] px-2.5 py-1.5 rounded-full font-medium border border-[#FFD700]/30">
                          <Star className="w-3 h-3 fill-[#FFD700]" />
                          Popular
                        </span>
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-[#FFD700]/0 group-hover:bg-[#FFD700]/10 transition-colors duration-500" />

                    {/* View Button - Appears on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="px-5 py-2.5 bg-[#FFD700] text-black rounded-full font-semibold text-sm flex items-center gap-2 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        View Style
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-base md:text-lg font-bold text-white group-hover:text-[#FFD700] transition-colors duration-300 line-clamp-1">
                      {style.name}
                    </h3>
                    <p className="text-white/40 text-xs md:text-sm mt-1 line-clamp-2 min-h-[2.5rem]">
                      {style.description}
                    </p>

                    {/* Price & Duration */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                      <span className="text-[#FFD700] font-bold text-sm">
                        {formatPrice(style.price, style.priceMax)}
                      </span>
                      <span className="text-white/40 text-xs flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDuration(style.duration, style.durationMax)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
