import Link from "next/link";
import {
  Calendar,
  Clock,
  TrendingUp,
  Users,
  ArrowRight,
  AlertCircle,
  ArrowUpRight,
  Scissors,
} from "lucide-react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
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

  if (bookingDate.toDateString() === today.toDateString()) return "Today";
  if (bookingDate.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return bookingDate.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
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

function getStatusColor(status: string) {
  switch (status) {
    case "CONFIRMED": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "PENDING": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "CANCELLED": return "bg-red-500/10 text-red-400 border-red-500/20";
    case "COMPLETED": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    default: return "bg-white/5 text-zinc-400 border-white/10";
  }
}

function getStatusDot(status: string) {
  switch (status) {
    case "CONFIRMED": return "bg-emerald-400";
    case "PENDING": return "bg-amber-400";
    case "CANCELLED": return "bg-red-400";
    case "COMPLETED": return "bg-blue-400";
    default: return "bg-zinc-400";
  }
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getTodayFormatted() {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function AdminDashboardPage() {
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

  // Last month for comparison
  const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

  // Last 7 days for chart
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const [
    todayBookings,
    weekBookings,
    monthPayments,
    lastMonthPayments,
    totalCustomers,
    pendingBookings,
    todaySchedule,
    recentBookings,
    last7DaysBookings,
  ] = await Promise.all([
    prisma.booking.count({
      where: { date: { gte: today, lt: tomorrow }, status: { notIn: ["CANCELLED"] } },
    }),
    prisma.booking.count({
      where: { date: { gte: weekStart, lt: weekEnd }, status: { notIn: ["CANCELLED"] } },
    }),
    prisma.payment.findMany({
      where: { status: "COMPLETED", createdAt: { gte: monthStart, lte: monthEnd } },
      select: { amount: true },
    }),
    prisma.payment.findMany({
      where: { status: "COMPLETED", createdAt: { gte: lastMonthStart, lte: lastMonthEnd } },
      select: { amount: true },
    }),
    prisma.booking.groupBy({ by: ["guestEmail"], _count: true }),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.findMany({
      where: { date: { gte: today, lt: tomorrow }, status: { notIn: ["CANCELLED"] } },
      include: { style: true },
      orderBy: { startTime: "asc" },
    }),
    prisma.booking.findMany({
      include: { style: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.booking.findMany({
      where: { date: { gte: sevenDaysAgo, lt: tomorrow }, status: { notIn: ["CANCELLED"] } },
      select: { date: true },
    }),
  ]);

  const monthRevenue = monthPayments.reduce((sum, p) => sum + Number(p.amount), 0);
  const lastMonthRevenue = lastMonthPayments.reduce((sum, p) => sum + Number(p.amount), 0);
  const revenueGrowth = lastMonthRevenue > 0
    ? ((monthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
    : 0;

  // Build 7-day chart data
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sevenDaysAgo);
    d.setDate(d.getDate() + i);
    const dayStr = d.toDateString();
    const count = last7DaysBookings.filter(
      (b) => new Date(b.date).toDateString() === dayStr
    ).length;
    return {
      label: d.toLocaleDateString("en-GB", { weekday: "short" }),
      count,
      isToday: d.toDateString() === new Date().toDateString(),
    };
  });
  const maxCount = Math.max(...chartData.map((d) => d.count), 1);

  const user = {
    name: "Admin User",
    email: "admin@layohair.com",
    role: "ADMIN",
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <AdminSidebar user={user} />

      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-4 lg:p-6 max-w-6xl">
          {/* Greeting */}
          <div className="mb-6">
            <h1 className="text-xl lg:text-2xl font-bold text-white">
              {getGreeting()}, Admin
            </h1>
            <p className="text-zinc-500 text-sm mt-0.5">{getTodayFormatted()}</p>
          </div>

          {/* Pending Alert */}
          {pendingBookings > 0 && (
            <Link
              href="/admin/bookings"
              className="flex items-center justify-between p-3 mb-5 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/15 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-amber-300 text-sm font-medium">
                  {pendingBookings} pending booking{pendingBookings !== 1 ? "s" : ""} to confirm
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-400/50 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
            </Link>
          )}

          {/* Stat Cards - 2x2 on mobile, 4 cols on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="bg-zinc-900 rounded-xl border border-white/[0.06] p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-zinc-400" />
                </div>
                {todayBookings > 0 && (
                  <span className="text-emerald-400 text-[10px] font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    Active
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-white">{todayBookings}</p>
              <p className="text-zinc-500 text-xs mt-0.5">Today</p>
            </div>

            <div className="bg-zinc-900 rounded-xl border border-white/[0.06] p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-zinc-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{weekBookings}</p>
              <p className="text-zinc-500 text-xs mt-0.5">This Week</p>
            </div>

            <div className="bg-zinc-900 rounded-xl border border-white/[0.06] p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-zinc-400" />
                </div>
                {revenueGrowth !== 0 && (
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                    revenueGrowth > 0
                      ? "text-emerald-400 bg-emerald-500/10"
                      : "text-red-400 bg-red-500/10"
                  }`}>
                    <ArrowUpRight className={`w-2.5 h-2.5 ${revenueGrowth < 0 ? "rotate-90" : ""}`} />
                    {Math.abs(revenueGrowth).toFixed(0)}%
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-white">{formatCurrency(monthRevenue)}</p>
              <p className="text-zinc-500 text-xs mt-0.5">Revenue</p>
            </div>

            <div className="bg-zinc-900 rounded-xl border border-white/[0.06] p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-zinc-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{totalCustomers.length}</p>
              <p className="text-zinc-500 text-xs mt-0.5">Customers</p>
            </div>
          </div>

          {/* Main Grid: Today's Schedule + 7-Day Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
            {/* Today's Schedule */}
            <div className="lg:col-span-3 bg-zinc-900 rounded-xl border border-white/[0.06] p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-white">Today&apos;s Schedule</h2>
                <Link
                  href="/admin/bookings"
                  className="text-zinc-500 text-xs hover:text-[#FFD700] transition-colors flex items-center gap-1"
                >
                  All bookings <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {todaySchedule.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                  <p className="text-zinc-600 text-sm">No appointments today</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {todaySchedule.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
                    >
                      <div className="text-center min-w-[52px]">
                        <p className="text-white font-semibold text-sm">
                          {formatTime(booking.startTime)}
                        </p>
                      </div>
                      <div className="w-px h-8 bg-white/[0.06]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                          {booking.guestName || "Guest"}
                        </p>
                        <p className="text-zinc-500 text-xs truncate">
                          {booking.style.name}
                        </p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-full border ${getStatusColor(booking.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(booking.status)}`} />
                        {booking.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 7-Day Chart */}
            <div className="lg:col-span-2 bg-zinc-900 rounded-xl border border-white/[0.06] p-4">
              <h2 className="text-sm font-semibold text-white mb-4">Last 7 Days</h2>
              <div className="flex items-end gap-2 h-32">
                {chartData.map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-zinc-500 text-[10px] font-medium">
                      {day.count > 0 ? day.count : ""}
                    </span>
                    <div className="w-full relative" style={{ height: "80px" }}>
                      <div
                        className={`absolute bottom-0 w-full rounded-t transition-all ${
                          day.isToday ? "bg-[#FFD700]" : "bg-zinc-700"
                        }`}
                        style={{
                          height: `${Math.max((day.count / maxCount) * 100, 4)}%`,
                          minHeight: "3px",
                        }}
                      />
                    </div>
                    <span className={`text-[10px] ${day.isToday ? "text-[#FFD700] font-semibold" : "text-zinc-600"}`}>
                      {day.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-zinc-900 rounded-xl border border-white/[0.06] p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">Recent Bookings</h2>
              <Link
                href="/admin/bookings"
                className="text-zinc-500 text-xs hover:text-[#FFD700] transition-colors flex items-center gap-1"
              >
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {recentBookings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                <p className="text-zinc-600 text-sm">No bookings yet</p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/[0.06]">
                        <th className="text-left text-zinc-500 text-[10px] font-medium uppercase tracking-wider pb-2">Ref</th>
                        <th className="text-left text-zinc-500 text-[10px] font-medium uppercase tracking-wider pb-2">Customer</th>
                        <th className="text-left text-zinc-500 text-[10px] font-medium uppercase tracking-wider pb-2">Style</th>
                        <th className="text-left text-zinc-500 text-[10px] font-medium uppercase tracking-wider pb-2">When</th>
                        <th className="text-left text-zinc-500 text-[10px] font-medium uppercase tracking-wider pb-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {recentBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-2.5 text-xs text-[#FFD700] font-mono">{booking.bookingRef}</td>
                          <td className="py-2.5 text-sm text-white">{booking.guestName || "Guest"}</td>
                          <td className="py-2.5 text-sm text-zinc-400">{booking.style.name}</td>
                          <td className="py-2.5">
                            <p className="text-sm text-zinc-300">{formatDate(booking.date)}</p>
                            <p className="text-[10px] text-zinc-600">{formatTime(booking.startTime)}</p>
                          </td>
                          <td className="py-2.5">
                            <span className={`inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-full border ${getStatusColor(booking.status)}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(booking.status)}`} />
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card List */}
                <div className="sm:hidden space-y-2">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="p-3 rounded-lg bg-zinc-800/50">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-white text-sm font-medium">{booking.guestName || "Guest"}</span>
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-full border ${getStatusColor(booking.status)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(booking.status)}`} />
                          {booking.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-500 text-xs">
                        <Scissors className="w-3 h-3" />
                        <span>{booking.style.name}</span>
                        <span className="text-zinc-700">·</span>
                        <span>{formatDate(booking.date)}, {formatTime(booking.startTime)}</span>
                      </div>
                      <p className="text-[10px] text-zinc-600 font-mono mt-1">{booking.bookingRef}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
