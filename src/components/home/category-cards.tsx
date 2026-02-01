"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Scissors } from "lucide-react";

interface CategoryData {
  name: string;
  slug: string;
  image: string;
  description: string;
}

const categoryMeta: Record<string, { description: string }> = {
  BRAIDS: { description: "Knotless, Box, Fulani & more" },
  CORNROWS: { description: "Classic & creative patterns" },
  TWISTS: { description: "Passion, Senegalese & more" },
  LOCS: { description: "Faux, Goddess, Butterfly" },
  NATURAL: { description: "Natural hair styling" },
  WEAVES: { description: "Sew-ins & weaves" },
  WIGS: { description: "Custom wigs" },
  TREATMENTS: { description: "Hair treatments" },
};

export function CategoryCards() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/styles");
        const styles = await res.json();

        // Group by category and get first image from each
        const categoryMap = new Map<string, CategoryData>();

        styles.forEach((style: any) => {
          if (!categoryMap.has(style.category) && style.images?.length > 0) {
            categoryMap.set(style.category, {
              name: style.category.charAt(0) + style.category.slice(1).toLowerCase(),
              slug: style.category.toLowerCase(),
              image: style.images[0],
              description: categoryMeta[style.category]?.description || "View styles",
            });
          }
        });

        // Get only main 4 categories: BRAIDS, CORNROWS, TWISTS, LOCS
        const mainCategories = ["BRAIDS", "CORNROWS", "TWISTS", "LOCS"];
        const sortedCategories = mainCategories
          .filter((cat) => categoryMap.has(cat))
          .map((cat) => categoryMap.get(cat)!);

        setCategories(sortedCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Our <span className="text-[#FFD700]">Services</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] bg-zinc-800 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-zinc-950">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Our <span className="text-[#FFD700]">Services</span>
          </h2>
          <p className="text-white/60 mt-3 max-w-lg mx-auto">
            Expert styling for every occasion
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/styles?category=${category.slug}`}
              className="group relative"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                    <Scissors className="w-12 h-12 text-zinc-600" />
                  </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-[#FFD700] transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-white/60 text-sm mt-1">
                    {category.description}
                  </p>
                  <div className="flex items-center gap-1 text-[#FFD700] text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Border on hover */}
                <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-[#FFD700]/50 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
