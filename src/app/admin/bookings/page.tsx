import {
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";
import { BookingActions } from "@/components/admin/booking-actions";

const PREVIEW_COUNT = 2;
const PER_PAGE = 10;

const STATUS_TABS = [
  { label: "All", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-GB", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
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
      return <CheckCircle2 className="w-4 h-4" />;
    case "PENDING":
      return <AlertCircle className="w-4 h-4" />;
    case "CANCELLED":
      return <XCircle className="w-4 h-4" />;
    case "COMPLETED":
      return <CheckCircle2 className="w-4 h-4" />;
    case "NO_SHOW":
      return <XCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "CONFIRMED":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    case "PENDING":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "CANCELLED":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    case "COMPLETED":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "NO_SHOW":
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    default:
      return "bg-white/10 text-white/50 border-white/10";
  }
}

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; view?: string }>;
}) {
  const params = await searchParams;
  const isFullView = params.view === "all" || !!params.page || !!params.status;
  const currentPage = Math.max(1, parseInt(params.page || "1"));
  const statusFilter = params.status || "";

  // Build where clause for filtered query
  const validStatuses = Object.values(BookingStatus) as string[];
  const where = statusFilter && validStatuses.includes(statusFilter)
    ? { status: statusFilter as BookingStatus }
    : {};

  // Fetch stats (always needed) and bookings based on view mode
  const [allBookings, filteredCount, bookings] = await Promise.all([
    prisma.booking.groupBy({
      by: ["status"],
      _count: true,
    }),
    prisma.booking.count({ where }),
    prisma.booking.findMany({
      where,
      include: {
        style: true,
        payments: true,
      },
      orderBy: { createdAt: "desc" },
      skip: isFullView ? (currentPage - 1) * PER_PAGE : 0,
      take: isFullView ? PER_PAGE : PREVIEW_COUNT,
    }),
  ]);

  // Calculate stats from groupBy
  const totalAll = allBookings.reduce((sum, b) => sum + b._count, 0);
  const stats = {
    total: totalAll,
    pending: allBookings.find((b) => b.status === "PENDING")?._count || 0,
    confirmed: allBookings.find((b) => b.status === "CONFIRMED")?._count || 0,
    completed: allBookings.find((b) => b.status === "COMPLETED")?._count || 0,
    cancelled: allBookings.find((b) => b.status === "CANCELLED")?._count || 0,
  };

  const totalPages = Math.ceil(filteredCount / PER_PAGE);
  const startItem = (currentPage - 1) * PER_PAGE + 1;
  const endItem = Math.min(currentPage * PER_PAGE, filteredCount);

  function buildUrl(newStatus?: string, newPage?: number) {
    const p = new URLSearchParams();
    p.set("view", "all");
    const s = newStatus !== undefined ? newStatus : statusFilter;
    if (s) p.set("status", s);
    if (newPage && newPage > 1) p.set("page", newPage.toString());
    return `/admin/bookings?${p.toString()}`;
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
                Bookings
              </h1>
              <p className="text-white/50 text-sm mt-1">
                Manage and track all appointments ({stats.total} total)
              </p>
            </div>
            <Link href={isFullView ? "/admin/bookings?view=all" : "/admin/bookings"}>
              <Button variant="outline" size="sm" className="border-white/[0.06] text-white/60 hover:text-white">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
            {[
              { label: "Total", value: stats.total, color: "text-white" },
              { label: "Pending", value: stats.pending, color: "text-yellow-500" },
              { label: "Confirmed", value: stats.confirmed, color: "text-green-500" },
              { label: "Completed", value: stats.completed, color: "text-blue-500" },
              { label: "Cancelled", value: stats.cancelled, color: "text-red-500" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-zinc-900 rounded-xl border border-white/[0.06] p-4"
              >
                <p className="text-white/50 text-sm">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Status Filter Tabs - only in full view */}
          {isFullView && (
            <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
              {STATUS_TABS.map((tab) => {
                const isActive = statusFilter === tab.value;
                const count = tab.value
                  ? allBookings.find((b) => b.status === tab.value)?._count || 0
                  : totalAll;
                return (
                  <Link
                    key={tab.value}
                    href={buildUrl(tab.value, 1)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                      isActive
                        ? "bg-[#FFD700] text-black font-medium"
                        : "bg-zinc-900 text-white/60 hover:bg-zinc-800 border border-white/[0.06]"
                    }`}
                  >
                    {tab.label}
                    <span className={`text-xs ${isActive ? "text-black/60" : "text-white/30"}`}>
                      {count}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Bookings List */}
          <div className="bg-zinc-900 rounded-xl border border-white/[0.06] overflow-hidden">
            {/* Section Header with View Toggle */}
            <div className="flex items-center justify-between p-3 border-b border-white/[0.06]">
              <h3 className="text-sm font-medium text-white/70">
                {isFullView ? "All Bookings" : "Recent Bookings"}
              </h3>
              {totalAll > PREVIEW_COUNT && (
                <Link
                  href={isFullView ? "/admin/bookings" : "/admin/bookings?view=all"}
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

            {bookings.length === 0 ? (
              <div className="p-12 text-center">
                <Calendar className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-lg text-white/60 mb-2">
                  {statusFilter ? "No bookings match this filter" : "No bookings yet"}
                </h3>
                <p className="text-white/40 text-sm">
                  {statusFilter
                    ? "Try selecting a different status tab"
                    : "Bookings will appear here once customers make appointments"}
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/[0.06] bg-zinc-800/50">
                        <th className="text-left text-white/50 text-xs font-medium p-3">
                          REFERENCE
                        </th>
                        <th className="text-left text-white/50 text-xs font-medium p-3">
                          CUSTOMER
                        </th>
                        <th className="text-left text-white/50 text-xs font-medium p-3 hidden md:table-cell">
                          STYLE
                        </th>
                        <th className="text-left text-white/50 text-xs font-medium p-3">
                          DATE & TIME
                        </th>
                        <th className="text-left text-white/50 text-xs font-medium p-3 hidden lg:table-cell">
                          PRICE
                        </th>
                        <th className="text-left text-white/50 text-xs font-medium p-3 hidden lg:table-cell">
                          PAID
                        </th>
                        <th className="text-left text-white/50 text-xs font-medium p-3">
                          STATUS
                        </th>
                        <th className="text-right text-white/50 text-xs font-medium p-3">
                          ACTIONS
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {bookings.map((booking) => {
                        const totalPaid = booking.payments
                          .filter((p) => p.status === "COMPLETED")
                          .reduce((sum, p) => sum + Number(p.amount), 0);

                        return (
                          <tr
                            key={booking.id}
                            className="hover:bg-white/[0.03] transition-colors"
                          >
                            <td className="p-3">
                              <span className="text-sm font-mono text-[#FFD700]">
                                {booking.bookingRef}
                              </span>
                            </td>
                            <td className="p-3">
                              <p className="text-sm font-medium text-white">
                                {booking.guestName || "Guest"}
                              </p>
                              <p className="text-xs text-white/40">
                                {booking.guestEmail}
                              </p>
                            </td>
                            <td className="p-3 hidden md:table-cell">
                              <span className="text-sm text-white/60">
                                {booking.style.name}
                              </span>
                            </td>
                            <td className="p-3">
                              <p className="text-sm text-white">
                                {formatDate(booking.date)}
                              </p>
                              <p className="text-xs text-white/40">
                                {formatTime(booking.startTime)}
                              </p>
                            </td>
                            <td className="p-3 hidden lg:table-cell">
                              <span className="text-sm text-white/60">
                                {formatCurrency(Number(booking.totalPrice))}
                              </span>
                            </td>
                            <td className="p-3 hidden lg:table-cell">
                              <span className={`text-sm ${totalPaid >= Number(booking.totalPrice) ? "text-green-500" : "text-yellow-500"}`}>
                                {formatCurrency(totalPaid)}
                              </span>
                            </td>
                            <td className="p-3">
                              <span
                                className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full border ${getStatusColor(
                                  booking.status
                                )}`}
                              >
                                {getStatusIcon(booking.status)}
                                {booking.status}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <BookingActions
                                bookingId={booking.id}
                                bookingRef={booking.bookingRef}
                                currentStatus={booking.status}
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
                  {bookings.map((booking) => {
                    const totalPaid = booking.payments
                      .filter((p) => p.status === "COMPLETED")
                      .reduce((sum, p) => sum + Number(p.amount), 0);

                    return (
                      <div key={booking.id} className="p-3.5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono text-[#FFD700]">
                            {booking.bookingRef}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {getStatusIcon(booking.status)}
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-white">
                          {booking.guestName || "Guest"}
                        </p>
                        <p className="text-xs text-white/40 mb-2">{booking.style.name}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/50">
                            {formatDate(booking.date)} · {formatTime(booking.startTime)}
                          </span>
                          <span className="text-white/60 font-medium">
                            {formatCurrency(Number(booking.totalPrice))}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.04]">
                          <span className={`text-xs ${totalPaid >= Number(booking.totalPrice) ? "text-green-500" : "text-yellow-500"}`}>
                            Paid: {formatCurrency(totalPaid)}
                          </span>
                          <BookingActions
                            bookingId={booking.id}
                            bookingRef={booking.bookingRef}
                            currentStatus={booking.status}
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
                      ? `Showing ${startItem}–${endItem} of ${filteredCount} booking${filteredCount !== 1 ? "s" : ""}`
                      : `Showing ${bookings.length} of ${totalAll} bookings`}
                  </p>
                  {isFullView && totalPages > 1 && (
                    <div className="flex items-center gap-1">
                      {currentPage > 1 ? (
                        <Link href={buildUrl(undefined, currentPage - 1)}>
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
                        <Link href={buildUrl(undefined, currentPage + 1)}>
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
