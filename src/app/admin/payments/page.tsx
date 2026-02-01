import {
  Search,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  Download,
  MoreVertical,
  Eye,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(date: Date) {
  return new Date(date).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusConfig(status: string) {
  switch (status) {
    case "COMPLETED":
      return {
        label: "Paid",
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        Icon: CheckCircle,
      };
    case "PENDING":
      return {
        label: "Pending",
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/10",
        Icon: Clock,
      };
    case "REFUNDED":
      return {
        label: "Refunded",
        color: "text-red-500",
        bgColor: "bg-red-500/10",
        Icon: RefreshCw,
      };
    case "FAILED":
      return {
        label: "Failed",
        color: "text-red-500",
        bgColor: "bg-red-500/10",
        Icon: XCircle,
      };
    default:
      return {
        label: status,
        color: "text-white/50",
        bgColor: "bg-white/10",
        Icon: Clock,
      };
  }
}

export default async function AdminPaymentsPage() {
  // Fetch payments from database
  const payments = await prisma.payment.findMany({
    include: {
      booking: {
        include: {
          style: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Calculate stats
  const totalReceived = payments
    .filter((p) => p.status === "COMPLETED")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const pendingAmount = payments
    .filter((p) => p.status === "PENDING")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  // Calculate balance due from deposit bookings
  const confirmedBookings = await prisma.booking.findMany({
    where: {
      status: { in: ["CONFIRMED", "COMPLETED"] },
    },
    include: {
      payments: {
        where: { status: "COMPLETED" },
      },
    },
  });

  const balanceDue = confirmedBookings.reduce((sum, booking) => {
    const totalPaid = booking.payments.reduce(
      (pSum, p) => pSum + Number(p.amount),
      0
    );
    const remaining = Number(booking.totalPrice) - totalPaid;
    return sum + (remaining > 0 ? remaining : 0);
  }, 0);

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
                Payments
              </h1>
              <p className="text-white/60 mt-1">
                Track and manage all payments ({payments.length} transactions)
              </p>
            </div>
            <Link href="/admin/payments">
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
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-zinc-900 rounded-xl p-4 border border-green-500/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <span className="text-green-500 text-sm">Total Received</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(totalReceived)}
              </p>
            </div>
            <div className="bg-zinc-900 rounded-xl p-4 border border-yellow-500/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-yellow-500" />
                </div>
                <span className="text-yellow-500 text-sm">Pending</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(pendingAmount)}
              </p>
            </div>
            <div className="bg-zinc-900 rounded-xl p-4 border border-[#FFD700]/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-[#FFD700]/20 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-[#FFD700]" />
                </div>
                <span className="text-[#FFD700] text-sm">Balance Due</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(balanceDue)}
              </p>
              <p className="text-white/40 text-xs mt-1">From deposits</p>
            </div>
            <div className="bg-zinc-900 rounded-xl p-4 border border-[#FFD700]/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-[#FFD700]/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-[#FFD700]" />
                </div>
                <span className="text-white/60 text-sm">Transactions</span>
              </div>
              <p className="text-2xl font-bold text-white">{payments.length}</p>
            </div>
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
              <Button
                variant="outline"
                className="border-zinc-700 text-white hover:bg-zinc-800"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-zinc-900 rounded-xl border border-[#FFD700]/10 overflow-hidden">
            {payments.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-lg text-white/60 mb-2">No payments yet</h3>
                <p className="text-white/40 text-sm">
                  Payments will appear here when customers make bookings
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10 bg-zinc-800/50">
                        <th className="text-left p-4 text-white/60 text-xs font-medium">
                          REFERENCE
                        </th>
                        <th className="text-left p-4 text-white/60 text-xs font-medium">
                          CUSTOMER
                        </th>
                        <th className="text-left p-4 text-white/60 text-xs font-medium hidden md:table-cell">
                          STYLE
                        </th>
                        <th className="text-left p-4 text-white/60 text-xs font-medium">
                          TYPE
                        </th>
                        <th className="text-left p-4 text-white/60 text-xs font-medium">
                          AMOUNT
                        </th>
                        <th className="text-left p-4 text-white/60 text-xs font-medium">
                          STATUS
                        </th>
                        <th className="text-left p-4 text-white/60 text-xs font-medium hidden lg:table-cell">
                          DATE
                        </th>
                        <th className="text-right p-4 text-white/60 text-xs font-medium">
                          ACTIONS
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {payments.map((payment) => {
                        const statusConfig = getStatusConfig(payment.status);
                        const StatusIcon = statusConfig.Icon;
                        const isDeposit = payment.paymentType === "DEPOSIT";

                        return (
                          <tr
                            key={payment.id}
                            className="hover:bg-white/5 transition-colors"
                          >
                            <td className="p-4">
                              <span className="text-[#FFD700] font-mono text-sm">
                                {payment.booking.bookingRef}
                              </span>
                            </td>
                            <td className="p-4">
                              <p className="text-white font-medium text-sm">
                                {payment.booking.guestName || "Guest"}
                              </p>
                              <p className="text-white/50 text-xs">
                                {payment.booking.guestEmail}
                              </p>
                            </td>
                            <td className="p-4 hidden md:table-cell">
                              <span className="text-white/70 text-sm">
                                {payment.booking.style.name}
                              </span>
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  isDeposit
                                    ? "bg-blue-500/10 text-blue-500"
                                    : "bg-green-500/10 text-green-500"
                                }`}
                              >
                                {isDeposit ? "30% Deposit" : "Full Payment"}
                              </span>
                            </td>
                            <td className="p-4">
                              <p className="text-white font-semibold">
                                {formatCurrency(Number(payment.amount))}
                              </p>
                              {isDeposit && (
                                <p className="text-white/40 text-xs">
                                  of{" "}
                                  {formatCurrency(
                                    Number(payment.booking.totalPrice)
                                  )}
                                </p>
                              )}
                            </td>
                            <td className="p-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}
                              >
                                <StatusIcon className="w-3 h-3" />
                                {statusConfig.label}
                              </span>
                            </td>
                            <td className="p-4 hidden lg:table-cell">
                              <p className="text-white/70 text-sm">
                                {formatDate(payment.createdAt)}
                              </p>
                              <p className="text-white/40 text-xs">
                                {formatTime(payment.createdAt)}
                              </p>
                            </td>
                            <td className="p-4 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-white/60 hover:text-white"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
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
                    Showing {payments.length} payment
                    {payments.length !== 1 ? "s" : ""}
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
