import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  Calendar,
  Clock,
  Users,
  Star,
  CheckCircle,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);
}

export default async function AnalyticsPage() {
  // Get date ranges
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

  // Fetch all stats in parallel
  const [
    todayBookings,
    weekBookings,
    monthPayments,
    lastMonthPayments,
    totalCustomers,
    reviews,
    bookingsByStatus,
    popularStyles,
    recentBookings,
  ] = await Promise.all([
    // Today's bookings
    prisma.booking.count({
      where: {
        date: { gte: today, lt: tomorrow },
        status: { notIn: ["CANCELLED"] },
      },
    }),
    // This week's bookings
    prisma.booking.count({
      where: {
        date: { gte: weekStart, lt: weekEnd },
        status: { notIn: ["CANCELLED"] },
      },
    }),
    // This month's payments
    prisma.payment.findMany({
      where: {
        status: "COMPLETED",
        createdAt: { gte: monthStart, lte: monthEnd },
      },
      select: { amount: true },
    }),
    // Last month's payments
    prisma.payment.findMany({
      where: {
        status: "COMPLETED",
        createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
      },
      select: { amount: true },
    }),
    // Total unique customers
    prisma.booking.groupBy({
      by: ["guestEmail"],
      _count: true,
    }),
    // Reviews for average rating
    prisma.review.findMany({
      where: { isApproved: true },
      select: { rating: true },
    }),
    // Bookings by status
    prisma.booking.groupBy({
      by: ["status"],
      _count: true,
    }),
    // Popular styles
    prisma.booking.groupBy({
      by: ["styleId"],
      _count: true,
      orderBy: { _count: { styleId: "desc" } },
      take: 5,
    }),
    // Recent bookings for activity
    prisma.booking.findMany({
      include: { style: true, payments: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  // Calculate derived stats
  const monthRevenue = monthPayments.reduce(
    (sum: number, p) => sum + Number(p.amount),
    0
  );
  const lastMonthRevenue = lastMonthPayments.reduce(
    (sum: number, p) => sum + Number(p.amount),
    0
  );
  const revenueGrowth =
    lastMonthRevenue > 0
      ? ((monthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : 0;

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum: number, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const totalBookings = bookingsByStatus.reduce((sum: number, b) => sum + b._count, 0);
  const completedBookings =
    bookingsByStatus.find((b) => b.status === "COMPLETED")?._count || 0;
  const completionRate =
    totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0;

  // Get style names for popular styles
  const styleIds = popularStyles.map((s) => s.styleId);
  const styles = await prisma.style.findMany({
    where: { id: { in: styleIds } },
    select: { id: true, name: true },
  });

  const popularStylesWithNames = popularStyles.map((ps) => ({
    name: styles.find((s) => s.id === ps.styleId)?.name || "Unknown",
    bookings: ps._count,
    percentage:
      totalBookings > 0 ? Math.round((ps._count / totalBookings) * 100) : 0,
  }));

  // Map booking status data
  const statusColors: Record<string, string> = {
    PENDING: "#EAB308",
    CONFIRMED: "#22C55E",
    COMPLETED: "#3B82F6",
    CANCELLED: "#EF4444",
    NO_SHOW: "#6B7280",
  };

  const bookingStatusData = bookingsByStatus.map((b) => ({
    status: b.status,
    count: b._count,
    color: statusColors[b.status] || "#9CA3AF",
  }));

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
                Analytics
              </h1>
              <p className="text-white/50 text-sm mt-1">
                Track your business performance
              </p>
            </div>
            <Link href="/admin/analytics">
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

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
            <StatCard
              title="Today's Bookings"
              value={todayBookings.toString()}
              icon={<Calendar className="w-5 h-5" />}
            />
            <StatCard
              title="Week Bookings"
              value={weekBookings.toString()}
              icon={<Clock className="w-5 h-5" />}
            />
            <StatCard
              title="Month Revenue"
              value={formatCurrency(monthRevenue)}
              trend={revenueGrowth}
              icon={<TrendingUp className="w-5 h-5" />}
              compact
            />
            <StatCard
              title="Total Customers"
              value={totalCustomers.length.toString()}
              icon={<Users className="w-5 h-5" />}
            />
            <StatCard
              title="Avg Rating"
              value={avgRating.toFixed(1)}
              icon={<Star className="w-5 h-5" />}
            />
            <StatCard
              title="Completion Rate"
              value={`${completionRate.toFixed(0)}%`}
              icon={<CheckCircle className="w-5 h-5" />}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Popular Styles */}
            <div className="bg-zinc-900 rounded-xl border border-white/[0.06] p-4">
              <h3 className="text-sm font-semibold text-white mb-1">
                Popular Styles
              </h3>
              <p className="text-white/40 text-xs mb-3">
                Most booked styles
              </p>

              {popularStylesWithNames.length === 0 ? (
                <p className="text-white/40 text-center py-8">No data yet</p>
              ) : (
                <div className="space-y-4">
                  {popularStylesWithNames.map((style, index) => (
                    <div key={style.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white/70 text-sm">
                          {style.name}
                        </span>
                        <span className="text-white/50 text-sm">
                          {style.bookings} ({style.percentage}%)
                        </span>
                      </div>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#FFD700] rounded-full"
                          style={{
                            width: `${style.percentage}%`,
                            opacity: 1 - index * 0.15,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Booking Status */}
            <div className="bg-zinc-900 rounded-xl border border-white/[0.06] p-4">
              <h3 className="text-sm font-semibold text-white mb-3">
                Booking Status
              </h3>

              {bookingStatusData.length === 0 ? (
                <p className="text-white/40 text-center py-8">No data yet</p>
              ) : (
                <>
                  <div className="flex justify-center mb-6">
                    <div className="relative w-32 h-32">
                      <svg
                        className="w-full h-full transform -rotate-90"
                        viewBox="0 0 100 100"
                      >
                        {bookingStatusData.reduce(
                          (acc, status, index) => {
                            const percentage =
                              totalBookings > 0
                                ? (status.count / totalBookings) * 100
                                : 0;
                            const strokeDasharray = `${percentage} ${100 - percentage}`;
                            const strokeDashoffset = -acc.offset;

                            acc.elements.push(
                              <circle
                                key={status.status}
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                stroke={status.color}
                                strokeWidth="20"
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                              />
                            );

                            acc.offset += percentage;
                            return acc;
                          },
                          { elements: [] as React.ReactElement[], offset: 0 }
                        ).elements}
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                          {totalBookings}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {bookingStatusData.map((status) => (
                      <div key={status.status} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: status.color }}
                        />
                        <span className="text-white/70 text-xs">
                          {status.status}: {status.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-zinc-900 rounded-xl border border-white/[0.06] p-4">
              <h3 className="text-sm font-semibold text-white mb-3">
                Recent Activity
              </h3>

              {recentBookings.length === 0 ? (
                <p className="text-white/40 text-center py-8">No activity yet</p>
              ) : (
                <div className="space-y-4">
                  {recentBookings.map((booking) => {
                    const hasPaid = booking.payments.some(
                      (p) => p.status === "COMPLETED"
                    );
                    return (
                      <div
                        key={booking.id}
                        className="flex items-start gap-3 pb-4 border-b border-white/5 last:border-0 last:pb-0"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            hasPaid
                              ? "bg-green-500/20 text-green-500"
                              : "bg-yellow-500/20 text-yellow-500"
                          }`}
                        >
                          {hasPaid ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium">
                            {booking.guestName || "Guest"}
                          </p>
                          <p className="text-white/50 text-xs truncate">
                            {booking.style.name}
                          </p>
                        </div>
                        <span className="text-white/40 text-xs whitespace-nowrap">
                          {new Date(booking.createdAt).toLocaleDateString(
                            "en-GB",
                            { month: "short", day: "numeric" }
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  trend,
  icon,
  compact = false,
}: {
  title: string;
  value: string;
  trend?: number;
  icon: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div className="bg-zinc-900 rounded-xl border border-white/[0.06] p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="w-8 h-8 bg-[#FFD700]/10 rounded-lg flex items-center justify-center text-[#FFD700]">
          {icon}
        </div>
        {trend !== undefined && trend !== 0 && (
          <div
            className={`flex items-center gap-0.5 text-xs ${
              trend > 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            <ArrowUpRight
              className={`w-3 h-3 ${trend < 0 ? "rotate-90" : ""}`}
            />
            {Math.abs(trend).toFixed(0)}%
          </div>
        )}
      </div>
      <p className={`font-bold text-white ${compact ? "text-lg" : "text-2xl"}`}>
        {value}
      </p>
      <p className="text-white/50 text-xs mt-1">{title}</p>
    </div>
  );
}
