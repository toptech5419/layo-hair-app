import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, Check, ArrowRight, Scissors } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BackButton } from "@/components/common/back-button";
import { Button } from "@/components/ui/button";
import { Reviews } from "@/components/common/reviews";
import { StarRating } from "@/components/common/star-rating";
import { getReviewsByStyle, getReviewStats } from "@/data/reviews";
import { prisma } from "@/lib/prisma";

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
    return mins === 0 ? `${hours} hours` : `${hours}h ${mins}m`;
  };
  if (maxMinutes && maxMinutes > minutes) return `${fmt(minutes)} - ${fmt(maxMinutes)}`;
  return fmt(minutes);
}

export default async function StyleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch style from database
  const style = await prisma.style.findUnique({
    where: { slug },
  });

  if (!style || !style.isActive) {
    notFound();
  }

  // Fetch related styles from same category
  const relatedStyles = await prisma.style.findMany({
    where: {
      category: style.category,
      isActive: true,
      id: { not: style.id },
    },
    take: 3,
  });

  // Get reviews for this style (from local data for now)
  const reviews = getReviewsByStyle(style.slug);
  const reviewStats = getReviewStats(style.slug);

  // Parse features from description or use defaults
  const defaultFeatures = [
    "Professional styling",
    "High-quality products",
    "Long-lasting results",
    "Aftercare advice included",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <BackButton
            label="Back to Styles"
            className="text-white/60 hover:text-[#FFD700] flex items-center gap-2 text-sm"
          />
        </div>

        {/* Style Detail */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image */}
            <div className="aspect-[3/4] relative rounded-2xl overflow-hidden bg-zinc-800">
              {style.images?.[0] ? (
                <Image
                  src={style.images?.[0]}
                  alt={style.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Scissors className="w-16 h-16 text-white/20" />
                </div>
              )}
              <span className="absolute top-4 left-4 text-sm bg-[#FFD700] text-black px-3 py-1 rounded-full font-medium">
                {style.category}
              </span>
            </div>

            {/* Details */}
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {style.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-[#FFD700]">
                  {formatPrice(Number(style.price), style.priceMax ? Number(style.priceMax) : null)}
                </span>
                <span className="text-white/60 flex items-center gap-2">
                  <Clock className="w-5 h-5" /> {formatDuration(style.duration, style.durationMax)}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <StarRating rating={reviewStats.averageRating} size="md" />
                <span className="text-white/60 ml-2">
                  {reviewStats.averageRating > 0
                    ? `${reviewStats.averageRating.toFixed(1)} (${reviewStats.totalReviews} review${reviewStats.totalReviews !== 1 ? "s" : ""})`
                    : "No reviews yet"}
                </span>
              </div>

              <p className="text-white/70 text-lg mb-8 leading-relaxed">
                {style.description || `Beautiful ${style.name} style, expertly crafted by our talented stylists.`}
              </p>

              {/* Features */}
              <div className="mb-8">
                <h3 className="text-white font-semibold mb-4">
                  What&apos;s Included
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {defaultFeatures.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 text-white/70"
                    >
                      <Check className="w-5 h-5 text-[#FFD700] flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90 text-lg font-semibold"
                >
                  <Link href={`/book?style=${style.slug}`}>
                    Book This Style <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700]/10"
                >
                  <Link href="/styles">Browse Other Styles</Link>
                </Button>
              </div>

              {/* Info */}
              <div className="mt-8 p-4 bg-zinc-900 rounded-xl border border-[#FFD700]/10">
                <p className="text-white/60 text-sm">
                  <span className="text-[#FFD700]">Note:</span> Prices may vary
                  based on hair length and thickness. A consultation will
                  confirm your final price.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-16 bg-zinc-950">
          <div className="container mx-auto px-4">
            <Reviews
              reviews={reviews}
              stats={reviewStats}
              styleSlug={style.slug}
              styleName={style.name}
            />
          </div>
        </section>

        {/* Related Styles */}
        {relatedStyles.length > 0 && (
          <section className="py-16 bg-zinc-950">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-white mb-8">
                More <span className="text-[#FFD700]">{style.category}</span>{" "}
                Styles
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedStyles.map((related) => (
                  <Link
                    key={related.id}
                    href={`/styles/${related.slug}`}
                    className="group bg-zinc-900 rounded-xl overflow-hidden border border-[#FFD700]/10 hover:border-[#FFD700]/30 transition-all"
                  >
                    <div className="aspect-[4/3] relative overflow-hidden bg-zinc-800">
                      {related.images?.[0] ? (
                        <Image
                          src={related.images?.[0]}
                          alt={related.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Scissors className="w-8 h-8 text-white/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white group-hover:text-[#FFD700] transition-colors">
                        {related.name}
                      </h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[#FFD700] font-bold text-sm">
                          {formatPrice(Number(related.price), related.priceMax ? Number(related.priceMax) : null)}
                        </span>
                        <span className="text-white/50 text-xs">
                          {formatDuration(related.duration, related.durationMax)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
