"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Star,
  Clock,
  Eye,
  EyeOff,
  RefreshCw,
  Scissors,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StyleActions } from "@/components/admin/style-actions";
import StyleForm from "./StyleForm";

interface Style {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  duration: number;
  category: string;
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
  _count: {
    bookings: number;
  };
}

interface StylesClientProps {
  styles: Style[];
  stats: {
    total: number;
    active: number;
    featured: number;
    totalBookings: number;
  };
  categories: string[];
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);
}

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export default function StylesClient({
  styles,
  stats,
  categories,
}: StylesClientProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingStyle, setEditingStyle] = useState<Style | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredStyles = styles.filter((style) => {
    const matchesSearch =
      style.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      style.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || style.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddNew = () => {
    setEditingStyle(null);
    setShowForm(true);
  };

  const handleEdit = (style: Style) => {
    setEditingStyle(style);
    setShowForm(true);
  };

  const handleSave = () => {
    router.refresh();
  };

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Styles</h1>
          <p className="text-white/60 mt-1">
            Manage your hairstyle catalog ({stats.total} styles)
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/styles">
            <Button
              variant="outline"
              className="border-[#FFD700]/30 text-[#FFD700]"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </Link>
          <Button
            onClick={handleAddNew}
            className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Style
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-zinc-900 rounded-xl border border-[#FFD700]/10 p-4">
          <p className="text-white/50 text-sm">Total Styles</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-zinc-900 rounded-xl border border-green-500/20 p-4">
          <p className="text-green-500 text-sm">Active</p>
          <p className="text-2xl font-bold text-white">{stats.active}</p>
        </div>
        <div className="bg-zinc-900 rounded-xl border border-[#FFD700]/20 p-4">
          <p className="text-[#FFD700] text-sm">Featured</p>
          <p className="text-2xl font-bold text-white">{stats.featured}</p>
        </div>
        <div className="bg-zinc-900 rounded-xl border border-blue-500/20 p-4">
          <p className="text-blue-500 text-sm">Total Bookings</p>
          <p className="text-2xl font-bold text-white">{stats.totalBookings}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-zinc-900 rounded-xl border border-[#FFD700]/10 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <Input
              placeholder="Search styles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                activeCategory === category
                  ? "bg-[#FFD700] text-black font-medium"
                  : "bg-zinc-800 text-white/70 hover:bg-zinc-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Styles Grid */}
      {filteredStyles.length === 0 ? (
        <div className="bg-zinc-900 rounded-xl border border-[#FFD700]/10 p-12 text-center">
          <Scissors className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-lg text-white/60 mb-2">
            {searchQuery || activeCategory !== "All"
              ? "No styles found"
              : "No styles yet"}
          </h3>
          <p className="text-white/40 text-sm mb-4">
            {searchQuery || activeCategory !== "All"
              ? "Try adjusting your search or filters"
              : "Add your first hairstyle to get started"}
          </p>
          {!searchQuery && activeCategory === "All" && (
            <Button
              onClick={handleAddNew}
              className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Style
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStyles.map((style) => (
            <div
              key={style.id}
              className={`bg-zinc-900 rounded-xl border transition-colors group ${
                style.isActive
                  ? "border-[#FFD700]/10 hover:border-[#FFD700]/30"
                  : "border-zinc-800 opacity-60"
              }`}
            >
              {/* Image */}
              <div className="aspect-video bg-zinc-800 rounded-t-xl relative overflow-hidden">
                {style.images && style.images.length > 0 && style.images[0] ? (
                  <Image
                    src={style.images[0]}
                    alt={style.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Scissors className="w-8 h-8 text-white/20" />
                  </div>
                )}
                {/* Edit Button on Hover */}
                <button
                  onClick={() => handleEdit(style)}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <span className="bg-[#FFD700] text-black px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                    <Pencil className="w-4 h-4" />
                    Edit Style
                  </span>
                </button>
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {style.isFeatured && (
                    <span className="inline-flex items-center gap-1 text-xs bg-[#FFD700] text-black px-2 py-1 rounded-full font-medium">
                      <Star className="w-3 h-3" />
                      Featured
                    </span>
                  )}
                  {!style.isActive && (
                    <span className="inline-flex items-center gap-1 text-xs bg-red-500/80 text-white px-2 py-1 rounded-full">
                      <EyeOff className="w-3 h-3" />
                      Hidden
                    </span>
                  )}
                </div>
                {/* Category */}
                <span className="absolute top-3 right-3 text-xs bg-black/50 text-white/80 px-2 py-1 rounded">
                  {style.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">
                    {style.name}
                  </h3>
                  <StyleActions
                    styleId={style.id}
                    styleName={style.name}
                    isActive={style.isActive}
                    isFeatured={style.isFeatured}
                    bookingCount={style._count.bookings}
                  />
                </div>

                <div className="flex items-center gap-4 text-sm text-white/60 mb-4">
                  <span className="text-[#FFD700] font-semibold">
                    {formatCurrency(Number(style.price))}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDuration(style.duration)}
                  </span>
                </div>

                {style.description && (
                  <p className="text-white/50 text-sm mb-4 line-clamp-2">
                    {style.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-sm text-white/50">
                    {style._count.bookings} booking
                    {style._count.bookings !== 1 ? "s" : ""}
                  </span>
                  <Link href={`/styles/${style.slug}`} target="_blank">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/60 hover:text-white"
                      title="View public page"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Style Form Modal */}
      {showForm && (
        <StyleForm
          style={
            editingStyle
              ? {
                  ...editingStyle,
                  description: editingStyle.description || "",
                  price: Number(editingStyle.price),
                }
              : undefined
          }
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
}
