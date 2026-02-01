import {
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";
import { BookingActions } from "@/components/admin/booking-actions";

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

export default async function AdminBookingsPage() {
  // Fetch bookings from database
  const bookings = await prisma.booking.findMany({
    include: {
      style: true,
      payments: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Calculate stats
  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "PENDING").length,
    confirmed: bookings.filter((b) => b.status === "CONFIRMED").length,
    completed: bookings.filter((b) => b.status === "COMPLETED").length,
    cancelled: bookings.filter((b) => b.status === "CANCELLED").length,
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
                Bookings
              </h1>
              <p className="text-white/60 mt-1">
                Manage and track all appointments ({stats.total} total)
              </p>
            </div>
            <Link href="/admin/bookings">
              <Button variant="outline" className="border-[#FFD700]/30 text-[#FFD700]">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {[
              { label: "Total", value: stats.total, color: "text-white" },
              { label: "Pending", value: stats.pending, color: "text-yellow-500" },
              { label: "Confirmed", value: stats.confirmed, color: "text-green-500" },
              { label: "Completed", value: stats.completed, color: "text-blue-500" },
              { label: "Cancelled", value: stats.cancelled, color: "text-red-500" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-zinc-900 rounded-xl border border-[#FFD700]/10 p-4"
              >
                <p className="text-white/50 text-sm">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-zinc-900 rounded-xl border border-[#FFD700]/10 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  placeholder="Search by name, email, or reference..."
                  className="pl-10 bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-zinc-700 text-white hover:bg-zinc-800"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                <Button
                  variant="outline"
                  className="border-zinc-700 text-white hover:bg-zinc-800"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Date Range
                </Button>
              </div>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-zinc-900 rounded-xl border border-[#FFD700]/10 overflow-hidden">
            {bookings.length === 0 ? (
              <div className="p-12 text-center">
                <Calendar className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-lg text-white/60 mb-2">No bookings yet</h3>
                <p className="text-white/40 text-sm">
                  Bookings will appear here once customers make appointments
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10 bg-zinc-800/50">
                        <th className="text-left text-white/60 text-xs font-medium p-4">
                          REFERENCE
                        </th>
                        <th className="text-left text-white/60 text-xs font-medium p-4">
                          CUSTOMER
                        </th>
                        <th className="text-left text-white/60 text-xs font-medium p-4 hidden md:table-cell">
                          STYLE
                        </th>
                        <th className="text-left text-white/60 text-xs font-medium p-4">
                          DATE & TIME
                        </th>
                        <th className="text-left text-white/60 text-xs font-medium p-4 hidden lg:table-cell">
                          PRICE
                        </th>
                        <th className="text-left text-white/60 text-xs font-medium p-4 hidden lg:table-cell">
                          PAID
                        </th>
                        <th className="text-left text-white/60 text-xs font-medium p-4">
                          STATUS
                        </th>
                        <th className="text-right text-white/60 text-xs font-medium p-4">
                          ACTIONS
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {bookings.map((booking) => {
                        const totalPaid = booking.payments
                          .filter((p) => p.status === "COMPLETED")
                          .reduce((sum, p) => sum + Number(p.amount), 0);

                        return (
                          <tr
                            key={booking.id}
                            className="hover:bg-white/5 transition-colors"
                          >
                            <td className="p-4">
                              <span className="text-sm font-mono text-[#FFD700]">
                                {booking.bookingRef}
                              </span>
                            </td>
                            <td className="p-4">
                              <div>
                                <p className="text-sm font-medium text-white">
                                  {booking.guestName || "Guest"}
                                </p>
                                <p className="text-xs text-white/50">
                                  {booking.guestEmail}
                                </p>
                              </div>
                            </td>
                            <td className="p-4 hidden md:table-cell">
                              <span className="text-sm text-white/70">
                                {booking.style.name}
                              </span>
                            </td>
                            <td className="p-4">
                              <div>
                                <p className="text-sm text-white">
                                  {formatDate(booking.date)}
                                </p>
                                <p className="text-xs text-white/50">
                                  {formatTime(booking.startTime)}
                                </p>
                              </div>
                            </td>
                            <td className="p-4 hidden lg:table-cell">
                              <span className="text-sm text-white/70">
                                {formatCurrency(Number(booking.totalPrice))}
                              </span>
                            </td>
                            <td className="p-4 hidden lg:table-cell">
                              <span className={`text-sm ${totalPaid >= Number(booking.totalPrice) ? "text-green-500" : "text-yellow-500"}`}>
                                {formatCurrency(totalPaid)}
                              </span>
                            </td>
                            <td className="p-4">
                              <span
                                className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${getStatusColor(
                                  booking.status
                                )}`}
                              >
                                {getStatusIcon(booking.status)}
                                {booking.status}
                              </span>
                            </td>
                            <td className="p-4 text-right">
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

                {/* Pagination */}
                <div className="flex items-center justify-between p-4 border-t border-white/10">
                  <p className="text-sm text-white/50">
                    Showing {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
