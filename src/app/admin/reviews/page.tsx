import Link from "next/link";
import {
  Search,
  Star,
  CheckCircle,
  Clock,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";
import { ReviewActions } from "@/components/admin/review-actions";

export default async function AdminReviewsPage() {
  // Fetch reviews from database
  const reviews = await prisma.review.findMany({
    include: {
      style: true,
      customer: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Calculate stats
  const stats = {
    total: reviews.length,
    pending: reviews.filter((r) => !r.isApproved).length,
    approved: reviews.filter((r) => r.isApproved).length,
    avgRating:
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0,
  };

  const user = {
    name: "Admin User",
    email: "admin@layohair.com",
    role: "ADMIN",
  };

  return (
    <div className="min-h-screen bg-black">
      <AdminSidebar user={user} />

      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">
                Reviews
              </h1>
              <p className="text-white/60 mt-1">
                Manage customer reviews ({stats.total} total)
              </p>
            </div>
            <Link href="/admin/reviews">
              <Button
                variant="outline"
                className="border-[#FFD700]/30 text-[#FFD700]"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-zinc-900 rounded-xl p-4 border border-[#FFD700]/10">
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

          {/* Filters */}
          <div className="bg-zinc-900 rounded-xl border border-[#FFD700]/10 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  placeholder="Search reviews..."
                  className="pl-10 bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
            </div>
          </div>

          {/* Reviews Table */}
          <div className="bg-zinc-900 rounded-xl border border-[#FFD700]/10 overflow-hidden">
            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-lg text-white/60 mb-2">No reviews yet</h3>
                <p className="text-white/40 text-sm">
                  Customer reviews will appear here
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10 bg-zinc-800/50">
                      <th className="text-left p-4 text-white/60 text-xs font-medium">
                        CUSTOMER
                      </th>
                      <th className="text-left p-4 text-white/60 text-xs font-medium hidden md:table-cell">
                        STYLE
                      </th>
                      <th className="text-left p-4 text-white/60 text-xs font-medium">
                        RATING
                      </th>
                      <th className="text-left p-4 text-white/60 text-xs font-medium hidden lg:table-cell">
                        REVIEW
                      </th>
                      <th className="text-left p-4 text-white/60 text-xs font-medium">
                        STATUS
                      </th>
                      <th className="text-left p-4 text-white/60 text-xs font-medium hidden md:table-cell">
                        DATE
                      </th>
                      <th className="text-right p-4 text-white/60 text-xs font-medium">
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {reviews.map((review) => {
                      const customerName = review.customer?.name || "Anonymous";

                      return (
                        <tr
                          key={review.id}
                          className="hover:bg-white/5 transition-colors"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#FFD700]/20 flex items-center justify-center">
                                <span className="text-[#FFD700] text-sm font-semibold">
                                  {customerName.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="text-white font-medium text-sm">
                                  {customerName}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 hidden md:table-cell">
                            <span className="text-white/70 text-sm">
                              {review.style?.name || "N/A"}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? "text-[#FFD700] fill-[#FFD700]"
                                      : "text-white/20"
                                  }`}
                                />
                              ))}
                            </div>
                          </td>
                          <td className="p-4 hidden lg:table-cell max-w-xs">
                            <p className="text-white/50 text-xs truncate">
                              {review.comment || "No comment"}
                            </p>
                          </td>
                          <td className="p-4">
                            {review.isApproved ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                                <CheckCircle className="w-3 h-3" />
                                Approved
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500">
                                <Clock className="w-3 h-3" />
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="p-4 hidden md:table-cell">
                            <span className="text-white/50 text-sm">
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
                          <td className="p-4 text-right">
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
            )}

            {/* Pagination */}
            {reviews.length > 0 && (
              <div className="flex items-center justify-between p-4 border-t border-white/10">
                <p className="text-sm text-white/50">
                  Showing {reviews.length} review
                  {reviews.length !== 1 ? "s" : ""}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
