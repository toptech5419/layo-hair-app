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
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StyleActions } from "@/components/admin/style-actions";
import StyleForm from "./StyleForm";

// Preview: fits one screen at a glance
const TABLE_PREVIEW = 4;
const GRID_PREVIEW = 6;

// Full view: paginated
const TABLE_PER_PAGE = 10;
const GRID_PER_PAGE = 9;

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
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredStyles = styles.filter((style) => {
    const matchesSearch =
      style.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      style.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || style.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Preview vs full view logic
  const previewCount = viewMode === "grid" ? GRID_PREVIEW : TABLE_PREVIEW;
  const perPage = viewMode === "grid" ? GRID_PER_PAGE : TABLE_PER_PAGE;
  const hasMore = filteredStyles.length > previewCount;

  // Calculate displayed styles
  let displayedStyles: Style[];
  let totalPages = 1;
  let safePage = 1;
  let startItem = 1;
  let endItem = filteredStyles.length;

  if (!isExpanded) {
    // Preview mode: just show first N
    displayedStyles = filteredStyles.slice(0, previewCount);
    startItem = 1;
    endItem = displayedStyles.length;
  } else {
    // Expanded mode: paginated
    totalPages = Math.ceil(filteredStyles.length / perPage);
    safePage = Math.min(currentPage, Math.max(1, totalPages));
    const startIndex = (safePage - 1) * perPage;
    displayedStyles = filteredStyles.slice(startIndex, startIndex + perPage);
    startItem = startIndex + 1;
    endItem = Math.min(startIndex + perPage, filteredStyles.length);
  }

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

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handleViewChange = (mode: "table" | "grid") => {
    setViewMode(mode);
    setCurrentPage(1);
  };

  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
    setCurrentPage(1);
  };

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-white">Styles</h1>
          <p className="text-white/50 text-sm mt-1">
            Manage your hairstyle catalog ({stats.total} styles)
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/styles">
            <Button
              variant="outline"
              size="sm"
              className="border-white/[0.06] text-white/60 hover:text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </Link>
          <Button
            onClick={handleAddNew}
            size="sm"
            className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Style
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="bg-zinc-900 rounded-xl border border-white/[0.06] p-4">
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

      {/* Filters + View Toggle */}
      <div className="bg-zinc-900 rounded-xl border border-white/[0.06] p-3 mb-5">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              placeholder="Search styles..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 bg-zinc-800 border-zinc-700 text-white h-9 text-sm"
            />
          </div>
          {/* View Toggle */}
          <div className="flex bg-zinc-800 rounded-lg p-0.5">
            <button
              onClick={() => handleViewChange("table")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "table"
                  ? "bg-zinc-700 text-white"
                  : "text-white/40 hover:text-white/60"
              }`}
              title="Table view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleViewChange("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-zinc-700 text-white"
                  : "text-white/40 hover:text-white/60"
              }`}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
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

      {/* Content */}
      {filteredStyles.length === 0 ? (
        <div className="bg-zinc-900 rounded-xl border border-white/[0.06] p-12 text-center">
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
      ) : viewMode === "table" ? (
        /* ============ TABLE VIEW ============ */
        <div className="bg-zinc-900 rounded-xl border border-white/[0.06] overflow-hidden">
          {/* Section Header with View All / View Less */}
          <div className="flex items-center justify-between p-3 border-b border-white/[0.06]">
            <h3 className="text-sm font-medium text-white/70">
              {isExpanded ? "All Styles" : "Recent Styles"}
            </h3>
            {hasMore && (
              <button
                onClick={handleToggleExpand}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#FFD700] hover:text-[#FFD700]/80 transition-colors"
              >
                {isExpanded ? (
                  <>View Less</>
                ) : (
                  <>
                    View All
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06] bg-zinc-800/50">
                  <th className="text-left p-3 text-white/50 text-xs font-medium">
                    STYLE
                  </th>
                  <th className="text-left p-3 text-white/50 text-xs font-medium hidden md:table-cell">
                    CATEGORY
                  </th>
                  <th className="text-left p-3 text-white/50 text-xs font-medium">
                    PRICE
                  </th>
                  <th className="text-left p-3 text-white/50 text-xs font-medium hidden md:table-cell">
                    DURATION
                  </th>
                  <th className="text-left p-3 text-white/50 text-xs font-medium hidden lg:table-cell">
                    BOOKINGS
                  </th>
                  <th className="text-left p-3 text-white/50 text-xs font-medium">
                    STATUS
                  </th>
                  <th className="text-right p-3 text-white/50 text-xs font-medium">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {displayedStyles.map((style) => (
                  <tr
                    key={style.id}
                    className={`hover:bg-white/[0.03] transition-colors ${
                      !style.isActive ? "opacity-50" : ""
                    }`}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-zinc-800 relative overflow-hidden flex-shrink-0">
                          {style.images?.[0] ? (
                            <Image
                              src={style.images[0]}
                              alt={style.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Scissors className="w-4 h-4 text-white/20" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {style.name}
                          </p>
                          {style.isFeatured && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-[#FFD700]">
                              <Star className="w-2.5 h-2.5 fill-[#FFD700]" />
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 hidden md:table-cell">
                      <span className="text-xs text-white/50 bg-zinc-800 px-2 py-1 rounded">
                        {style.category}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-sm font-medium text-[#FFD700]">
                        {formatCurrency(style.price)}
                      </span>
                    </td>
                    <td className="p-3 hidden md:table-cell">
                      <span className="text-sm text-white/60 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDuration(style.duration)}
                      </span>
                    </td>
                    <td className="p-3 hidden lg:table-cell">
                      <span className="text-sm text-white/50">
                        {style._count.bookings}
                      </span>
                    </td>
                    <td className="p-3">
                      {style.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                          <Eye className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500">
                          <EyeOff className="w-3 h-3" />
                          Hidden
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(style)}
                          className="p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors"
                          title="Edit style"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <StyleActions
                          styleId={style.id}
                          styleName={style.name}
                          isActive={style.isActive}
                          isFeatured={style.isFeatured}
                          bookingCount={style._count.bookings}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="sm:hidden divide-y divide-white/[0.04]">
            {displayedStyles.map((style) => (
              <div
                key={style.id}
                className={`p-3.5 ${!style.isActive ? "opacity-50" : ""}`}
              >
                <div className="flex gap-3">
                  <div className="w-14 h-14 rounded-lg bg-zinc-800 relative overflow-hidden flex-shrink-0">
                    {style.images?.[0] ? (
                      <Image
                        src={style.images[0]}
                        alt={style.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Scissors className="w-5 h-5 text-white/20" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {style.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-[#FFD700] font-medium">
                            {formatCurrency(style.price)}
                          </span>
                          <span className="text-xs text-white/40 flex items-center gap-0.5">
                            <Clock className="w-3 h-3" />
                            {formatDuration(style.duration)}
                          </span>
                        </div>
                      </div>
                      {style.isActive ? (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-green-500/10 text-green-500 flex-shrink-0">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-red-500/10 text-red-500 flex-shrink-0">
                          Hidden
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.04]">
                      <div className="flex items-center gap-2 text-[10px] text-white/40">
                        <span>{style.category}</span>
                        <span>{style._count.bookings} bookings</span>
                        {style.isFeatured && (
                          <span className="text-[#FFD700] flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-[#FFD700]" />
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(style)}
                          className="p-1 rounded text-white/40 hover:text-white"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <StyleActions
                          styleId={style.id}
                          styleName={style.name}
                          isActive={style.isActive}
                          isFeatured={style.isFeatured}
                          bookingCount={style._count.bookings}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-3 border-t border-white/[0.06]">
            <p className="text-xs text-white/40">
              {isExpanded
                ? `${startItem}–${endItem} of ${filteredStyles.length} styles`
                : `${displayedStyles.length} of ${filteredStyles.length} styles`}
            </p>
            {isExpanded && totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safePage <= 1}
                  className="p-1.5 rounded-md text-white/50 hover:text-white disabled:text-white/20 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs text-white/50 px-2">
                  {safePage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage >= totalPages}
                  className="p-1.5 rounded-md text-white/50 hover:text-white disabled:text-white/20 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ============ GRID VIEW ============ */
        <div className="bg-zinc-900 rounded-xl border border-white/[0.06] overflow-hidden">
          {/* Section Header with View All / View Less */}
          <div className="flex items-center justify-between p-3 border-b border-white/[0.06]">
            <h3 className="text-sm font-medium text-white/70">
              {isExpanded ? "All Styles" : "Recent Styles"}
            </h3>
            {hasMore && (
              <button
                onClick={handleToggleExpand}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#FFD700] hover:text-[#FFD700]/80 transition-colors"
              >
                {isExpanded ? (
                  <>View Less</>
                ) : (
                  <>
                    View All
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}
          </div>

          {/* Grid Cards */}
          <div className="p-2 sm:p-3">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
              {displayedStyles.map((style) => (
                <div
                  key={style.id}
                  className={`bg-zinc-800/50 rounded-lg sm:rounded-xl border transition-colors group ${
                    style.isActive
                      ? "border-white/[0.06] hover:border-white/[0.12]"
                      : "border-zinc-800 opacity-60"
                  }`}
                >
                  {/* Image */}
                  <div className="aspect-square bg-zinc-800 rounded-t-lg sm:rounded-t-xl relative overflow-hidden">
                    {style.images && style.images.length > 0 && style.images[0] ? (
                      <Image
                        src={style.images[0]}
                        alt={style.name}
                        fill
                        className="object-cover object-top"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Scissors className="w-6 h-6 sm:w-8 sm:h-8 text-white/20" />
                      </div>
                    )}
                    {/* Edit Button on Hover */}
                    <button
                      onClick={() => handleEdit(style)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <span className="bg-[#FFD700] text-black px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5">
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </span>
                    </button>
                    {/* Badges */}
                    <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 flex gap-1">
                      {style.isFeatured && (
                        <span className="inline-flex items-center gap-0.5 text-[8px] sm:text-[10px] bg-[#FFD700] text-black px-1 sm:px-1.5 py-0.5 rounded-full font-medium">
                          <Star className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                          Featured
                        </span>
                      )}
                      {!style.isActive && (
                        <span className="inline-flex items-center gap-0.5 text-[8px] sm:text-[10px] bg-red-500/80 text-white px-1 sm:px-1.5 py-0.5 rounded-full">
                          <EyeOff className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                          Hidden
                        </span>
                      )}
                    </div>
                    {/* Category */}
                    <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 text-[8px] sm:text-[10px] bg-black/50 text-white/80 px-1 sm:px-1.5 py-0.5 rounded">
                      {style.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-2 sm:p-3">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-xs sm:text-sm font-semibold text-white truncate">
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

                    <div className="flex items-center gap-2 text-[10px] sm:text-xs text-white/60 mb-1 sm:mb-2">
                      <span className="text-[#FFD700] font-semibold">
                        {formatCurrency(Number(style.price))}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        {formatDuration(style.duration)}
                      </span>
                    </div>

                    {style.description && (
                      <p className="text-white/50 text-[10px] sm:text-xs mb-1 sm:mb-2 line-clamp-2 hidden sm:block">
                        {style.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-white/[0.06]">
                      <span className="text-[9px] sm:text-[10px] text-white/40">
                        {style._count.bookings} booking{style._count.bookings !== 1 ? "s" : ""}
                      </span>
                      <Link href={`/styles/${style.slug}`} target="_blank">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white/60 hover:text-white h-5 sm:h-6 text-[9px] sm:text-[10px] px-1.5 sm:px-2"
                          title="View public page"
                        >
                          <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5" />
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-3 border-t border-white/[0.06]">
            <p className="text-xs text-white/40">
              {isExpanded
                ? `${startItem}–${endItem} of ${filteredStyles.length} styles`
                : `${displayedStyles.length} of ${filteredStyles.length} styles`}
            </p>
            {isExpanded && totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safePage <= 1}
                  className="p-1.5 rounded-md text-white/50 hover:text-white disabled:text-white/20 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs text-white/50 px-2">
                  {safePage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage >= totalPages}
                  className="p-1.5 rounded-md text-white/50 hover:text-white disabled:text-white/20 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
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
