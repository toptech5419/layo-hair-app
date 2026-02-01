import Link from "next/link";
import {
  Calendar,
  Clock,
  TrendingUp,
  Users,
  Scissors,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Star,
  BarChart3,
  ArrowUpRight,
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

function formatDate(date: Date) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const bookingDate = new Date(date);

  if (bookingDate.toDateString() === today.toDateString()) {
    return "Today";
  } else if (bookingDate.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow";
  } else {
    return bookingDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
  }
}

function formatTime(time: string) {
  if (!time) return "TBD";
  if (time.includes("AM") || time.includes("PM")) return time;
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

function getStatusIcon(status: string) {
  switch (status) {
    case "CONFIRMED":
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    case "PENDING":
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    case "CANCELLED":
      return <XCircle className="w-4 h-4 text-red-500" />;
    case "COMPLETED":
      return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
    default:
      return <Clock className="w-4 h-4 text-white/50" />;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "CONFIRMED":
      return "bg-green-500/10 text-green-500";
    case "PENDING":
      return "bg-yellow-500/10 text-yellow-500";
    case "CANCELLED":
      return "bg-red-500/10 text-red-500";
    case "COMPLETED":
      return "bg-blue-500/10 text-blue-500";
    default:
      return "bg-white/10 text-white/50";
  }
}

export default async function AdminDashboardPage() {
  // Get today's date range
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Get this week's date range
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  // Get this month's date range
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  // Fetch stats from database
  const [
    todayBookings,
    weekBookings,
    monthPayments,
    totalCustomers,
    recentBookings,
  ] = await Promise.all([
    // Today's bookings
    prisma.booking.count({
      where: {
        date: {
          gte: today,
          lt: tomorrow,
        },
        status: { notIn: ["CANCELLED"] },
      },
    }),
    // This week's bookings
    prisma.booking.count({
      where: {
        date: {
          gte: weekStart,
          lt: weekEnd,
        },
        status: { notIn: ["CANCELLED"] },
      },
    }),
    // This month's payments (completed)
    prisma.payment.findMany({
      where: {
        status: "COMPLETED",
        createdAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      select: { amount: true },
    }),
    // Total unique customers (by email)
    prisma.booking.groupBy({
      by: ["guestEmail"],
      _count: true,
    }),
    // Recent bookings
    prisma.booking.findMany({
      include: {
        style: true,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const monthRevenue = monthPayments.reduce(
    (sum, p) => sum + Number(p.amount),
    0
  );

  const stats = {
    todayBookings,
    weekBookings,
    monthRevenue,
    totalCustomers: totalCustomers.length,
  };

  const user = {
    name: "Admin User",
    email: "admin@layohair.com",
    role: "ADMIN",
  };

  return (
    <div className="min-h-screen bg-black">
      <AdminSidebar user={user} />

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-white">
              Dashboard
            </h1>
            <p className="text-white/60 mt-1">
              Welcome back, Admin! Here&apos;s what&apos;s happening.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-zinc-900 rounded-xl border border-[#FFD700]/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-[#FFD700]/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#FFD700]" />
                </div>
                {stats.todayBookings > 0 && (
                  <div className="flex items-center gap-1 text-green-500 text-xs">
                    <ArrowUpRight className="w-3 h-3" />
                    Active
                  </div>
                )}
              </div>
              <p className="text-3xl font-bold text-white">
                {stats.todayBookings}
              </p>
              <p className="text-white/60 text-sm">Today&apos;s Bookings</p>
            </div>

            <div className="bg-zinc-900 rounded-xl border border-[#FFD700]/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-[#FFD700]/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#FFD700]" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">
                {stats.weekBookings}
              </p>
              <p className="text-white/60 text-sm">This Week</p>
            </div>

            <div className="bg-zinc-900 rounded-xl border border-[#FFD700]/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-[#FFD700]/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#FFD700]" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">
                {formatCurrency(stats.monthRevenue)}
              </p>
              <p className="text-white/60 text-sm">Month Revenue</p>
            </div>

            <div className="bg-zinc-900 rounded-xl border border-[#FFD700]/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-[#FFD700]/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#FFD700]" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">
                {stats.totalCustomers}
              </p>
              <p className="text-white/60 text-sm">Total Customers</p>
            </div>
          </div>

          {/* Quick Actions + Recent Bookings */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="bg-zinc-900 rounded-xl border border-[#FFD700]/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start border-[#FFD700]/20 text-white hover:bg-[#FFD700]/10 hover:text-[#FFD700]"
                >
                  <Link href="/admin/bookings">
                    <Calendar className="w-4 h-4 mr-3" />
                    View All Bookings
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start border-[#FFD700]/20 text-white hover:bg-[#FFD700]/10 hover:text-[#FFD700]"
                >
                  <Link href="/admin/styles">
                    <Scissors className="w-4 h-4 mr-3" />
                    Manage Styles
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start border-[#FFD700]/20 text-white hover:bg-[#FFD700]/10 hover:text-[#FFD700]"
                >
                  <Link href="/admin/payments">
                    <TrendingUp className="w-4 h-4 mr-3" />
                    View Payments
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start border-[#FFD700]/20 text-white hover:bg-[#FFD700]/10 hover:text-[#FFD700]"
                >
                  <Link href="/admin/availability">
                    <Clock className="w-4 h-4 mr-3" />
                    Set Availability
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start border-[#FFD700]/20 text-white hover:bg-[#FFD700]/10 hover:text-[#FFD700]"
                >
                  <Link href="/admin/reviews">
                    <Star className="w-4 h-4 mr-3" />
                    Manage Reviews
                  </Link>
                </Button>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="lg:col-span-2 bg-zinc-900 rounded-xl border border-[#FFD700]/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">
                  Recent Bookings
                </h2>
                <Link
                  href="/admin/bookings"
                  className="text-[#FFD700] text-sm hover:underline flex items-center gap-1"
                >
                  View all
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {recentBookings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-10 h-10 text-white/20 mx-auto mb-3" />
                  <p className="text-white/50">No bookings yet</p>
                  <p className="text-white/30 text-sm">
                    Bookings will appear here
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left text-white/40 text-xs font-medium pb-3">
                          REF
                        </th>
                        <th className="text-left text-white/40 text-xs font-medium pb-3">
                          CUSTOMER
                        </th>
                        <th className="text-left text-white/40 text-xs font-medium pb-3 hidden sm:table-cell">
                          STYLE
                        </th>
                        <th className="text-left text-white/40 text-xs font-medium pb-3">
                          WHEN
                        </th>
                        <th className="text-left text-white/40 text-xs font-medium pb-3">
                          STATUS
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {recentBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-white/5">
                          <td className="py-3 text-sm text-[#FFD700] font-mono">
                            {booking.bookingRef}
                          </td>
                          <td className="py-3 text-sm text-white">
                            {booking.guestName || "Guest"}
                          </td>
                          <td className="py-3 text-sm text-white/70 hidden sm:table-cell">
                            {booking.style.name}
                          </td>
                          <td className="py-3 text-sm text-white/70">
                            <div>{formatDate(booking.date)}</div>
                            <div className="text-xs text-white/40">
                              {formatTime(booking.startTime)}
                            </div>
                          </td>
                          <td className="py-3">
                            <span
                              className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${getStatusColor(
                                booking.status
                              )}`}
                            >
                              {getStatusIcon(booking.status)}
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
