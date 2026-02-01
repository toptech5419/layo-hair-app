"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, Search, Filter, Star, Scissors } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Style {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  duration: number;
  description: string;
  image: string;
  isFeatured: boolean;
}

interface StylesFilterProps {
  styles: Style[];
  categories: string[];
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(price);
}

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
}

export function StylesFilter({
  styles,
  categories,
}: StylesFilterProps) {
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

  return (
    <>
      {/* Filters */}
      <section className="py-6 bg-zinc-950 border-b border-[#FFD700]/10 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <Input
                placeholder="Search styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-zinc-900 border-zinc-800 text-white placeholder:text-white/40"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-3 sm:py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all min-h-[44px] ${
                    selectedCategory === category
                      ? "bg-[#FFD700] text-black"
                      : "bg-zinc-900 text-white/70 hover:bg-zinc-800 hover:text-white active:bg-zinc-700"
                  }`}
                >
                  {category === "All" ? "All Styles" : category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredStyles.length === 0 ? (
            <div className="text-center py-16">
              <Filter className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <h3 className="text-xl text-white/60">No styles found</h3>
              <p className="text-white/40 mt-2">
                Try adjusting your search or filter
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredStyles.map((style) => (
                <Link
                  key={style.id}
                  href={`/styles/${style.slug}`}
                  className="group bg-zinc-900 rounded-xl overflow-hidden border border-[#FFD700]/10 hover:border-[#FFD700]/30 transition-all duration-300"
                >
                  <div className="aspect-[3/4] relative overflow-hidden">
                    {style.image ? (
                      <Image
                        src={style.image}
                        alt={style.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-zinc-800">
                        <Scissors className="w-12 h-12 text-white/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <span className="absolute top-3 left-3 text-xs bg-[#FFD700]/90 text-black px-2 py-1 rounded-full font-medium">
                      {style.category}
                    </span>
                    {style.isFeatured && (
                      <span className="absolute top-3 right-3 text-xs bg-black/70 text-[#FFD700] px-2 py-1 rounded-full font-medium flex items-center gap-1">
                        <Star className="w-3 h-3 fill-[#FFD700]" />
                        Featured
                      </span>
                    )}
                    <div className="absolute inset-0 bg-[#FFD700]/0 group-hover:bg-[#FFD700]/10 transition-colors" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white group-hover:text-[#FFD700] transition-colors">
                      {style.name}
                    </h3>
                    <p className="text-white/50 text-sm mt-1 line-clamp-2">
                      {style.description}
                    </p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                      <span className="text-[#FFD700] font-bold">
                        {formatPrice(style.price)}
                      </span>
                      <span className="text-white/50 text-sm flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDuration(style.duration)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center mt-8 text-white/40 text-sm">
            Showing {filteredStyles.length} of {styles.length} styles
          </div>
        </div>
      </section>
    </>
  );
}
