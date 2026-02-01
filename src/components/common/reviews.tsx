"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ThumbsUp, CheckCircle, Camera, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarRating } from "./star-rating";
import { Review, ReviewStats } from "@/types/review";

interface ReviewsProps {
  reviews: Review[];
  stats: ReviewStats;
  styleSlug: string;
  styleName: string;
}

export function Reviews({ reviews, stats, styleSlug, styleName }: ReviewsProps) {
  const [showAll, setShowAll] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  if (reviews.length === 0) {
    return (
      <div className="bg-zinc-900 rounded-2xl p-8 border border-[#FFD700]/10">
        <h3 className="text-xl font-semibold text-white mb-4">Customer Reviews</h3>
        <p className="text-white/60 mb-6">No reviews yet. Be the first to review this style!</p>
        <Button asChild className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
          <Link href={`/review?style=${styleSlug}`}>Write a Review</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="bg-zinc-900 rounded-2xl p-6 border border-[#FFD700]/10">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Average Rating */}
          <div className="text-center md:text-left md:border-r md:border-white/10 md:pr-6">
            <div className="text-5xl font-bold text-[#FFD700] mb-2">
              {stats.averageRating.toFixed(1)}
            </div>
            <StarRating rating={stats.averageRating} size="lg" />
            <p className="text-white/60 text-sm mt-2">
              Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.ratingDistribution[star as keyof typeof stats.ratingDistribution];
              const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;

              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-white/60 text-sm w-8">{star} star</span>
                  <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#FFD700] rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-white/40 text-sm w-8">{count}</span>
                </div>
              );
            })}
          </div>

          {/* Write Review CTA */}
          <div className="md:pl-6 md:border-l md:border-white/10">
            <Button asChild className="w-full md:w-auto bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
              <Link href={`/review?style=${styleSlug}`}>Write a Review</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">
          Reviews for {styleName}
        </h3>

        {displayedReviews.map((review) => (
          <div
            key={review.id}
            className="bg-zinc-900 rounded-xl p-6 border border-[#FFD700]/10"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {review.customerImage ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={review.customerImage}
                      alt={review.customerName}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#FFD700]/20 flex items-center justify-center">
                    <span className="text-[#FFD700] font-semibold">
                      {review.customerName.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{review.customerName}</span>
                    {review.verified && (
                      <span className="flex items-center gap-1 text-green-500 text-xs">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-white/40 text-sm">
                    {new Date(review.createdAt).toLocaleDateString("en-NG", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <StarRating rating={review.rating} size="sm" />
            </div>

            {/* Content */}
            <h4 className="text-white font-semibold mb-2">{review.title}</h4>
            <p className="text-white/70 leading-relaxed mb-4">{review.comment}</p>

            {/* Images */}
            {review.images && review.images.length > 0 && (
              <div className="flex gap-2 mb-4">
                {review.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className="relative w-20 h-20 rounded-lg overflow-hidden group"
                  >
                    <Image
                      src={image}
                      alt={`Review photo ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <Camera className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
              <button className="flex items-center gap-2 text-white/50 hover:text-[#FFD700] transition-colors text-sm">
                <ThumbsUp className="w-4 h-4" />
                Helpful ({review.helpful})
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Show More */}
      {reviews.length > 3 && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/10"
          >
            {showAll ? "Show Less" : `Show All ${reviews.length} Reviews`}
            <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showAll ? "rotate-180" : ""}`} />
          </Button>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-3xl max-h-[80vh]">
            <Image
              src={selectedImage}
              alt="Review photo"
              width={800}
              height={800}
              className="object-contain max-h-[80vh] rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
