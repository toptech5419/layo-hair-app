"use client";

import { useState } from "react";
import { X, Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUpload from "./ImageUpload";

interface StyleFormProps {
  style?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    duration: number;
    category: string;
    images: string[];
    isActive: boolean;
    isFeatured: boolean;
  };
  onClose: () => void;
  onSave: () => void;
}

const CATEGORIES = [
  { value: "BRAIDS", label: "Braids" },
  { value: "CORNROWS", label: "Cornrows" },
  { value: "TWISTS", label: "Twists" },
  { value: "LOCS", label: "Locs" },
  { value: "NATURAL", label: "Natural" },
  { value: "WEAVES", label: "Weaves" },
  { value: "WIGS", label: "Wigs" },
  { value: "TREATMENTS", label: "Treatments" },
  { value: "OTHER", label: "Other" },
];

export default function StyleForm({ style, onClose, onSave }: StyleFormProps) {
  const isEditing = !!style;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: style?.name || "",
    slug: style?.slug || "",
    description: style?.description || "",
    price: style?.price ? String(style.price) : "",
    duration: style?.duration ? String(style.duration) : "",
    category: style?.category || "BRAIDS",
    images: style?.images || [""],
    isActive: style?.isActive ?? true,
    isFeatured: style?.isFeatured ?? false,
  });

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    }));
  };

  const handleImageChange = (index: number, url: string) => {
    const newImages = [...formData.images];
    newImages[index] = url;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const addImageSlot = () => {
    if (formData.images.length < 5) {
      setFormData((prev) => ({ ...prev, images: [...prev.images, ""] }));
    }
  };

  const removeImageSlot = (index: number) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, images: newImages }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Filter out empty image URLs
      const images = formData.images.filter((img) => img.trim() !== "");

      const payload = {
        ...formData,
        images,
        price: parseFloat(formData.price) || 0,
        duration: parseInt(formData.duration) || 0,
      };

      const url = isEditing
        ? `/api/admin/styles/${style.id}`
        : "/api/admin/styles";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save style");
      }

      onSave();
      onClose();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-2xl border border-[#FFD700]/20 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? "Edit Style" : "Add New Style"}
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Images Section */}
            <div>
              <label className="block text-sm font-medium text-white mb-3">
                Style Images
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <ImageUpload
                      value={image}
                      onChange={(url) => handleImageChange(index, url)}
                      onRemove={() => handleImageChange(index, "")}
                      folder="layo-hair/styles"
                    />
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImageSlot(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 text-xs bg-[#FFD700] text-black px-2 py-0.5 rounded font-medium">
                        Main
                      </span>
                    )}
                  </div>
                ))}
                {formData.images.length < 5 && (
                  <button
                    type="button"
                    onClick={addImageSlot}
                    className="aspect-[4/5] rounded-xl border-2 border-dashed border-zinc-700 hover:border-zinc-500 flex flex-col items-center justify-center text-zinc-500 hover:text-zinc-400 transition-colors"
                  >
                    <Plus className="w-6 h-6 mb-1" />
                    <span className="text-xs">Add More</span>
                  </button>
                )}
              </div>
              <p className="text-xs text-zinc-500 mt-2">
                Upload up to 5 images. The first image will be the main display image.
              </p>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Style Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g., Knotless Box Braids"
                  className="bg-zinc-800 border-zinc-700 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  URL Slug
                </label>
                <Input
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  placeholder="knotless-box-braids"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
                <p className="text-xs text-zinc-500 mt-1">
                  Auto-generated from name
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Describe this hairstyle..."
                rows={3}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 focus:border-[#FFD700]"
              />
            </div>

            {/* Price, Duration, Category */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Price (£) *
                </label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      price: e.target.value,
                    }))
                  }
                  placeholder="e.g., 120"
                  min="0"
                  step="0.01"
                  className="bg-zinc-800 border-zinc-700 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Duration (minutes) *
                </label>
                <Input
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      duration: e.target.value,
                    }))
                  }
                  placeholder="e.g., 180"
                  min="15"
                  step="15"
                  className="bg-zinc-800 border-zinc-700 text-white"
                  required
                />
                <p className="text-xs text-zinc-500 mt-1">
                  {formData.duration ? `${Math.floor(Number(formData.duration) / 60)}h ${Number(formData.duration) % 60}m` : "0h 0m"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className="w-full h-10 px-4 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 focus:border-[#FFD700]"
                  required
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-12 h-6 rounded-full transition-colors ${
                      formData.isActive ? "bg-green-500" : "bg-zinc-700"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                        formData.isActive ? "translate-x-6" : "translate-x-0.5"
                      } mt-0.5`}
                    />
                  </div>
                </div>
                <span className="text-white">Active (visible to customers)</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isFeatured: e.target.checked,
                      }))
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-12 h-6 rounded-full transition-colors ${
                      formData.isFeatured ? "bg-[#FFD700]" : "bg-zinc-700"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                        formData.isFeatured ? "translate-x-6" : "translate-x-0.5"
                      } mt-0.5`}
                    />
                  </div>
                </div>
                <span className="text-white">Featured (show on homepage)</span>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400">{error}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10 bg-zinc-900">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-zinc-700 text-white hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Create Style"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
