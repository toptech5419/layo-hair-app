"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Star, Camera, X, Check, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const styles = [
  { id: "knotless-braids", name: "Knotless Braids", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&h=200&fit=crop" },
  { id: "fulani-braids", name: "Fulani Braids", image: "https://images.unsplash.com/photo-1595959183082-7b570b7e1daf?w=200&h=200&fit=crop" },
  { id: "boho-braids", name: "Short Boho Braids", image: "https://images.unsplash.com/photo-1594369908155-60ced2a37e59?w=200&h=200&fit=crop" },
  { id: "french-curls", name: "French Curls", image: "https://images.unsplash.com/photo-1534180477871-5d6cc81f3920?w=200&h=200&fit=crop" },
  { id: "cornrows", name: "Classic Cornrows", image: "https://images.unsplash.com/photo-1611077544695-e0e15a56077f?w=200&h=200&fit=crop" },
  { id: "goddess-locs", name: "Goddess Locs", image: "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=200&h=200&fit=crop" },
  { id: "passion-twists", name: "Passion Twists", image: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?w=200&h=200&fit=crop" },
  { id: "butterfly-locs", name: "Butterfly Locs", image: "https://images.unsplash.com/photo-1523263685509-57c1d050d19b?w=200&h=200&fit=crop" },
];

function ReviewForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedStyle = searchParams.get("style");

  const [step, setStep] = useState(preselectedStyle ? 2 : 1);
  const [selectedStyle, setSelectedStyle] = useState(preselectedStyle || "");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bookingRef, setBookingRef] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedStyleData = styles.find((s) => s.id === selectedStyle);

  const handleImageUpload = () => {
    // Simulate image upload with placeholder
    const placeholderImages = [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1595959183082-7b570b7e1daf?w=300&h=300&fit=crop",
    ];
    if (images.length < 3) {
      setImages([...images, placeholderImages[images.length % 2]]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmitted(true);
    setIsSubmitting(false);
  };

  const canSubmit = rating > 0 && title.trim() && comment.trim() && name.trim() && email.trim();

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-black">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Thank You!</h1>
            <p className="text-white/60 mb-8">
              Your review has been submitted and is pending approval. We appreciate your feedback!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
                <Link href={`/styles/${selectedStyle}`}>View Style</Link>
              </Button>
              <Button variant="outline" className="border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/10" onClick={() => router.back()}>
                Back
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Back Link */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-white/60 hover:text-[#FFD700] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Write a <span className="text-[#FFD700]">Review</span>
            </h1>
            <p className="text-white/60">
              Share your experience and help others find their perfect style
            </p>
          </div>

          {/* Step 1: Select Style */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">
                Which style did you get?
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {styles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => {
                      setSelectedStyle(style.id);
                      setStep(2);
                    }}
                    className="bg-zinc-900 rounded-xl p-3 border border-[#FFD700]/10 hover:border-[#FFD700]/30 transition-all text-left group"
                  >
                    <div className="aspect-square relative rounded-lg overflow-hidden mb-2">
                      <Image
                        src={style.image}
                        alt={style.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <p className="text-white text-sm font-medium truncate">
                      {style.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Write Review */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Selected Style */}
              {selectedStyleData && (
                <div className="bg-zinc-900 rounded-xl p-4 border border-[#FFD700]/10 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={selectedStyleData.image}
                      alt={selectedStyleData.name}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-white/50 text-sm">Reviewing</p>
                    <p className="text-white font-semibold">{selectedStyleData.name}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setStep(1)}
                    className="text-[#FFD700] hover:bg-[#FFD700]/10"
                  >
                    Change
                  </Button>
                </div>
              )}

              {/* Rating */}
              <div className="bg-zinc-900 rounded-xl p-6 border border-[#FFD700]/10">
                <label className="text-white font-semibold mb-4 block">
                  Your Rating *
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-10 h-10 ${
                          star <= (hoverRating || rating)
                            ? "text-[#FFD700] fill-[#FFD700]"
                            : "text-white/20"
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-white/60 mt-2 text-sm">
                    {rating === 5 && "Excellent!"}
                    {rating === 4 && "Very Good"}
                    {rating === 3 && "Good"}
                    {rating === 2 && "Fair"}
                    {rating === 1 && "Poor"}
                  </p>
                )}
              </div>

              {/* Review Content */}
              <div className="bg-zinc-900 rounded-xl p-6 border border-[#FFD700]/10 space-y-4">
                <div>
                  <label className="text-white font-semibold mb-2 block">
                    Review Title *
                  </label>
                  <Input
                    placeholder="Summarize your experience"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-white/40"
                  />
                </div>

                <div>
                  <label className="text-white font-semibold mb-2 block">
                    Your Review *
                  </label>
                  <textarea
                    placeholder="Tell us about your experience. How was the service? How long did the style last?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-md p-3 min-h-[150px] placeholder:text-white/40 focus:border-[#FFD700] focus:outline-none"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="text-white font-semibold mb-2 block">
                    Add Photos (Optional)
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {images.map((image, index) => (
                      <div key={index} className="relative w-20 h-20">
                        <Image
                          src={image}
                          alt={`Upload ${index + 1}`}
                          fill
                          className="object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ))}
                    {images.length < 3 && (
                      <button
                        onClick={handleImageUpload}
                        className="w-20 h-20 border-2 border-dashed border-zinc-700 rounded-lg flex flex-col items-center justify-center text-white/40 hover:border-[#FFD700]/50 hover:text-[#FFD700] transition-colors"
                      >
                        <Camera className="w-6 h-6" />
                        <span className="text-xs mt-1">Add</span>
                      </button>
                    )}
                  </div>
                  <p className="text-white/40 text-xs mt-2">
                    Add up to 3 photos of your style
                  </p>
                </div>
              </div>

              {/* Your Details */}
              <div className="bg-zinc-900 rounded-xl p-6 border border-[#FFD700]/10 space-y-4">
                <h3 className="text-white font-semibold">Your Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/70 text-sm mb-2 block">Name *</label>
                    <Input
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-white/40"
                    />
                  </div>
                  <div>
                    <label className="text-white/70 text-sm mb-2 block">Email *</label>
                    <Input
                      type="email"
                      placeholder="Your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-white/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/70 text-sm mb-2 block">
                    Booking Reference (Optional)
                  </label>
                  <Input
                    placeholder="e.g., LAYO-ABC123"
                    value={bookingRef}
                    onChange={(e) => setBookingRef(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-white/40"
                  />
                  <p className="text-white/40 text-xs mt-1">
                    Add your booking reference to get a verified badge
                  </p>
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="border-zinc-700 text-white hover:bg-zinc-800"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit || isSubmitting}
                  className="flex-1 bg-[#FFD700] text-black hover:bg-[#FFD700]/90 disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <span className="text-3xl font-bold text-[#FFD700] animate-pulse">LAYO</span>
            <span className="text-3xl font-light text-white animate-pulse">HAIR</span>
          </div>
          <div className="relative w-12 h-12 mx-auto">
            <div className="absolute inset-0 border-4 border-[#FFD700]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#FFD700] rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    }>
      <ReviewForm />
    </Suspense>
  );
}
