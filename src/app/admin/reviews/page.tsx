import Link from "next/link";
import {
  Star,
  CheckCircle,
  Clock,
  MessageSquare,
  RefreshCw,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { ReviewActions } from "@/components/admin/review-actions";

const PREVIEW_COUNT = 2;
const PER_PAGE = 10;

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; page?: string }>;
}) {
  const params = await searchParams;
  const isFullView = params.view === "all" || !!params.page;
  const currentPage = Math.max(1, parseInt(params.page || "1"));

  // Fetch all reviews for stats + paginated reviews for display
  const [totalCount, reviews] = await Promise.all([
    prisma.review.count(),
    prisma.review.findMany({
      include: {
        style: true,
        customer: true,
      },
      orderBy: { createdAt: "desc" },
      skip: isFullView ? (currentPage - 1) * PER_PAGE : 0,
      take: isFullView ? PER_PAGE : PREVIEW_COUNT,
    }),
  ]);

  // Fetch stats separately (always all reviews)
  const allReviews = await prisma.review.findMany({
    select: { rating: true, isApproved: true },
  });

  const stats = {
    total: allReviews.length,
    pending: allReviews.filter((r) => !r.isApproved).length,
    approved: allReviews.filter((r) => r.isApproved).length,
    avgRating:
      allReviews.length > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
        : 0,
  };

  const totalPages = Math.ceil(totalCount / PER_PAGE);
  const startItem = (currentPage - 1) * PER_PAGE + 1;
  const endItem = Math.min(currentPage * PER_PAGE, totalCount);

  function buildUrl(newPage?: number) {
    const p = new URLSearchParams();
    p.set("view", "all");
    if (newPage && newPage > 1) p.set("page", newPage.toString());
    return `/admin/reviews?${p.toString()}`;
  }

  const user = {
    name: "Admin User",
    email: "admin@layohair.com",
    role: "ADMIN",
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <AdminSidebar user={user} />

      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-4 lg:p-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-white">
                Reviews
              </h1>
              <p className="text-white/50 text-sm mt-1">
                Manage customer reviews ({stats.total} total)
              </p>
            </div>
            <Link href={isFullView ? "/admin/reviews?view=all" : "/admin/reviews"}>
              <Button
                variant="outline"
                size="sm"
                className="border-white/[0.06] text-white/60 hover:text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <div className="bg-zinc-900 rounded-xl p-4 border border-white/[0.06]">
              <p className="text-white/60 text-sm">Total</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="bg-zinc-900 rounded-xl p-4 border border-yellow-500/20">
              <p className="text-yellow-500 text-sm">Pending</p>
              <p className="text-2xl font-bold text-white">{stats.pending}</p>
            </div>
            <div className="bg-zinc-900 rounded-xl p-4 border border-green-500/20">
              <p className="text-green-500 text-sm">Approved</p>
              <p className="text-2xl font-bold text-white">{stats.approved}</p>
            </div>
            <div className="bg-zinc-900 rounded-xl p-4 border border-[#FFD700]/20">
              <p className="text-[#FFD700] text-sm">Avg Rating</p>
              <p className="text-2xl font-bold text-white flex items-center gap-1">
                {stats.avgRating.toFixed(1)}
                <Star className="w-5 h-5 text-[#FFD700] fill-[#FFD700]" />
              </p>
            </div>
          </div>

          {/* Reviews List */}
          <div className="bg-zinc-900 rounded-xl border border-white/[0.06] overflow-hidden">
            {/* Section Header with View Toggle */}
            <div className="flex items-center justify-between p-3 border-b border-white/[0.06]">
              <h3 className="text-sm font-medium text-white/70">
                {isFullView ? "All Reviews" : "Recent Reviews"}
              </h3>
              {totalCount > PREVIEW_COUNT && (
                <Link
                  href={isFullView ? "/admin/reviews" : "/admin/reviews?view=all"}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#FFD700] hover:text-[#FFD700]/80 transition-colors"
                >
                  {isFullView ? (
                    <>View Less</>
                  ) : (
                    <>
                      View All
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </Link>
              )}
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-lg text-white/60 mb-2">No reviews yet</h3>
                <p className="text-white/40 text-sm">
                  Customer reviews will appear here
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/[0.06] bg-zinc-800/50">
                        <th className="text-left p-3 text-white/50 text-xs font-medium">
                          CUSTOMER
                        </th>
                        <th className="text-left p-3 text-white/50 text-xs font-medium hidden md:table-cell">
                          STYLE
                        </th>
                        <th className="text-left p-3 text-white/50 text-xs font-medium">
                          RATING
                        </th>
                        <th className="text-left p-3 text-white/50 text-xs font-medium hidden lg:table-cell">
                          REVIEW
                        </th>
                        <th className="text-left p-3 text-white/50 text-xs font-medium">
                          STATUS
                        </th>
                        <th className="text-left p-3 text-white/50 text-xs font-medium hidden md:table-cell">
                          DATE
                        </th>
                        <th className="text-right p-3 text-white/50 text-xs font-medium">
                          ACTIONS
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {reviews.map((review) => {
                        const customerName = review.customer?.name || "Anonymous";

                        return (
                          <tr
                            key={review.id}
                            className="hover:bg-white/[0.03] transition-colors"
                          >
                            <td className="p-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-[#FFD700]/10 flex items-center justify-center flex-shrink-0">
                                  <span className="text-[#FFD700] text-xs font-semibold">
                                    {customerName.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <p className="text-white font-medium text-sm">
                                  {customerName}
                                </p>
                              </div>
                            </td>
                            <td className="p-3 hidden md:table-cell">
                              <span className="text-white/60 text-sm">
                                {review.style?.name || "N/A"}
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3.5 h-3.5 ${
                                      i < review.rating
                                        ? "text-[#FFD700] fill-[#FFD700]"
                                        : "text-white/10"
                                    }`}
                                  />
                                ))}
                              </div>
                            </td>
                            <td className="p-3 hidden lg:table-cell max-w-xs">
                              <p className="text-white/40 text-xs truncate">
                                {review.comment || "No comment"}
                              </p>
                            </td>
                            <td className="p-3">
                              {review.isApproved ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                                  <CheckCircle className="w-3 h-3" />
                                  Approved
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500">
                                  <Clock className="w-3 h-3" />
                                  Pending
                                </span>
                              )}
                            </td>
                            <td className="p-3 hidden md:table-cell">
                              <span className="text-white/40 text-sm">
                                {new Date(review.createdAt).toLocaleDateString(
                                  "en-GB",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <ReviewActions
                                reviewId={review.id}
                                customerName={customerName}
                                isApproved={review.isApproved}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="sm:hidden divide-y divide-white/[0.04]">
                  {reviews.map((review) => {
                    const customerName = review.customer?.name || "Anonymous";

                    return (
                      <div key={review.id} className="p-3.5">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#FFD700]/10 flex items-center justify-center">
                              <span className="text-[#FFD700] text-xs font-semibold">
                                {customerName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-white">
                              {customerName}
                            </p>
                          </div>
                          {review.isApproved ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-500/10 text-green-500">
                              <CheckCircle className="w-3 h-3" />
                              Approved
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-yellow-500/10 text-yellow-500">
                              <Clock className="w-3 h-3" />
                              Pending
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-0.5 mb-1.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < review.rating
                                  ? "text-[#FFD700] fill-[#FFD700]"
                                  : "text-white/10"
                              }`}
                            />
                          ))}
                          <span className="text-white/40 text-xs ml-1.5">
                            {review.style?.name || "N/A"}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-white/40 text-xs line-clamp-2 mb-2">
                            {review.comment}
                          </p>
                        )}
                        <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                          <span className="text-white/30 text-[10px]">
                            {new Date(review.createdAt).toLocaleDateString("en-GB", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <ReviewActions
                            reviewId={review.id}
                            customerName={customerName}
                            isApproved={review.isApproved}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-3 border-t border-white/[0.06]">
                  <p className="text-xs text-white/40">
                    {isFullView
                      ? `${startItem}–${endItem} of ${totalCount} reviews`
                      : `${reviews.length} of ${totalCount} reviews`}
                  </p>
                  {isFullView && totalPages > 1 && (
                    <div className="flex items-center gap-1">
                      {currentPage > 1 ? (
                        <Link href={buildUrl(currentPage - 1)}>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-white/50 hover:text-white">
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                        </Link>
                      ) : (
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-white/20" disabled>
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                      )}
                      <span className="text-xs text-white/50 px-2">
                        {currentPage} / {totalPages}
                      </span>
                      {currentPage < totalPages ? (
                        <Link href={buildUrl(currentPage + 1)}>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-white/50 hover:text-white">
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      ) : (
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-white/20" disabled>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
