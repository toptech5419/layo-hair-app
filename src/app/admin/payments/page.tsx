import {
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  MoreVertical,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { PaymentStatus } from "@prisma/client";

const PREVIEW_COUNT = 2;
const PER_PAGE = 10;

const STATUS_TABS = [
  { label: "All", value: "", dbValue: "" },
  { label: "Paid", value: "COMPLETED", dbValue: "COMPLETED" },
  { label: "Pending", value: "PENDING", dbValue: "PENDING" },
  { label: "Failed", value: "FAILED", dbValue: "FAILED" },
  { label: "Refunded", value: "REFUNDED", dbValue: "REFUNDED" },
];

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

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; view?: string }>;
}) {
  const params = await searchParams;
  const isFullView = params.view === "all" || !!params.page || !!params.status;
  const currentPage = Math.max(1, parseInt(params.page || "1"));
  const statusFilter = params.status || "";

  // Build where clause for filtered query
  const validStatuses = Object.values(PaymentStatus) as string[];
  const where = statusFilter && validStatuses.includes(statusFilter)
    ? { status: statusFilter as PaymentStatus }
    : {};

  // Fetch stats and payments based on view mode
  const [allPayments, filteredCount, payments, confirmedBookings] = await Promise.all([
    prisma.payment.groupBy({
      by: ["status"],
      _count: true,
      _sum: { amount: true },
    }),
    prisma.payment.count({ where }),
    prisma.payment.findMany({
      where,
      include: {
        booking: {
          include: {
            style: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: isFullView ? (currentPage - 1) * PER_PAGE : 0,
      take: isFullView ? PER_PAGE : PREVIEW_COUNT,
    }),
    prisma.booking.findMany({
      where: {
        status: { in: ["CONFIRMED", "COMPLETED"] },
      },
      include: {
        payments: {
          where: { status: "COMPLETED" },
        },
      },
    }),
  ]);

  // Calculate stats from groupBy
  const totalAll = allPayments.reduce((sum, p) => sum + p._count, 0);
  const totalReceived = Number(
    allPayments.find((p) => p.status === "COMPLETED")?._sum?.amount || 0
  );
  const pendingAmount = Number(
    allPayments.find((p) => p.status === "PENDING")?._sum?.amount || 0
  );

  const balanceDue = confirmedBookings.reduce((sum, booking) => {
    const totalPaid = booking.payments.reduce(
      (pSum, p) => pSum + Number(p.amount),
      0
    );
    const remaining = Number(booking.totalPrice) - totalPaid;
    return sum + (remaining > 0 ? remaining : 0);
  }, 0);

  const totalPages = Math.ceil(filteredCount / PER_PAGE);
  const startItem = (currentPage - 1) * PER_PAGE + 1;
  const endItem = Math.min(currentPage * PER_PAGE, filteredCount);

  function buildUrl(newStatus?: string, newPage?: number) {
    const p = new URLSearchParams();
    p.set("view", "all");
    const s = newStatus !== undefined ? newStatus : statusFilter;
    if (s) p.set("status", s);
    if (newPage && newPage > 1) p.set("page", newPage.toString());
    return `/admin/payments?${p.toString()}`;
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
                Payments
              </h1>
              <p className="text-white/50 text-sm mt-1">
                Track and manage all payments ({totalAll} transactions)
              </p>
            </div>
            <Link href={isFullView ? "/admin/payments?view=all" : "/admin/payments"}>
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
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
            <div className="bg-zinc-900 rounded-xl p-4 border border-white/[0.06]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-[#FFD700]/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-[#FFD700]" />
                </div>
                <span className="text-white/60 text-sm">Transactions</span>
              </div>
              <p className="text-2xl font-bold text-white">{totalAll}</p>
            </div>
          </div>

          {/* Status Filter Tabs - only in full view */}
          {isFullView && (
            <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
              {STATUS_TABS.map((tab) => {
                const isActive = statusFilter === tab.value;
                const count = tab.dbValue
                  ? allPayments.find((p) => p.status === tab.dbValue)?._count || 0
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

          {/* Payments List */}
          <div className="bg-zinc-900 rounded-xl border border-white/[0.06] overflow-hidden">
            {/* Section Header with View Toggle */}
            <div className="flex items-center justify-between p-3 border-b border-white/[0.06]">
              <h3 className="text-sm font-medium text-white/70">
                {isFullView ? "All Payments" : "Recent Payments"}
              </h3>
              {totalAll > PREVIEW_COUNT && (
                <Link
                  href={isFullView ? "/admin/payments" : "/admin/payments?view=all"}
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

            {payments.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-lg text-white/60 mb-2">
                  {statusFilter ? "No payments match this filter" : "No payments yet"}
                </h3>
                <p className="text-white/40 text-sm">
                  {statusFilter
                    ? "Try selecting a different status tab"
                    : "Payments will appear here when customers make bookings"}
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
                          REFERENCE
                        </th>
                        <th className="text-left p-3 text-white/50 text-xs font-medium">
                          CUSTOMER
                        </th>
                        <th className="text-left p-3 text-white/50 text-xs font-medium hidden md:table-cell">
                          STYLE
                        </th>
                        <th className="text-left p-3 text-white/50 text-xs font-medium">
                          TYPE
                        </th>
                        <th className="text-left p-3 text-white/50 text-xs font-medium">
                          AMOUNT
                        </th>
                        <th className="text-left p-3 text-white/50 text-xs font-medium">
                          STATUS
                        </th>
                        <th className="text-left p-3 text-white/50 text-xs font-medium hidden lg:table-cell">
                          DATE
                        </th>
                        <th className="text-right p-3 text-white/50 text-xs font-medium">
                          ACTIONS
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {payments.map((payment) => {
                        const statusConfig = getStatusConfig(payment.status);
                        const StatusIcon = statusConfig.Icon;
                        const isDeposit = payment.paymentType === "DEPOSIT";

                        return (
                          <tr
                            key={payment.id}
                            className="hover:bg-white/[0.03] transition-colors"
                          >
                            <td className="p-3">
                              <span className="text-[#FFD700] font-mono text-sm">
                                {payment.booking.bookingRef}
                              </span>
                            </td>
                            <td className="p-3">
                              <p className="text-white font-medium text-sm">
                                {payment.booking.guestName || "Guest"}
                              </p>
                              <p className="text-white/40 text-xs">
                                {payment.booking.guestEmail}
                              </p>
                            </td>
                            <td className="p-3 hidden md:table-cell">
                              <span className="text-white/60 text-sm">
                                {payment.booking.style.name}
                              </span>
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  isDeposit
                                    ? "bg-blue-500/10 text-blue-500"
                                    : "bg-green-500/10 text-green-500"
                                }`}
                              >
                                {isDeposit ? "Deposit" : "Full"}
                              </span>
                            </td>
                            <td className="p-3">
                              <p className="text-white font-semibold text-sm">
                                {formatCurrency(Number(payment.amount))}
                              </p>
                              {isDeposit && (
                                <p className="text-white/30 text-xs">
                                  of {formatCurrency(Number(payment.booking.totalPrice))}
                                </p>
                              )}
                            </td>
                            <td className="p-3">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}
                              >
                                <StatusIcon className="w-3 h-3" />
                                {statusConfig.label}
                              </span>
                            </td>
                            <td className="p-3 hidden lg:table-cell">
                              <p className="text-white/60 text-sm">
                                {formatDate(payment.createdAt)}
                              </p>
                              <p className="text-white/30 text-xs">
                                {formatTime(payment.createdAt)}
                              </p>
                            </td>
                            <td className="p-3 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-white/50 hover:text-white"
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

                {/* Mobile Card View */}
                <div className="sm:hidden divide-y divide-white/[0.04]">
                  {payments.map((payment) => {
                    const statusConfig = getStatusConfig(payment.status);
                    const StatusIcon = statusConfig.Icon;
                    const isDeposit = payment.paymentType === "DEPOSIT";

                    return (
                      <div key={payment.id} className="p-3.5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono text-[#FFD700]">
                            {payment.booking.bookingRef}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full ${statusConfig.bgColor} ${statusConfig.color}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig.label}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-white">
                          {payment.booking.guestName || "Guest"}
                        </p>
                        <p className="text-xs text-white/40 mb-2">{payment.booking.style.name}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className={`px-2 py-0.5 rounded-full font-medium ${
                            isDeposit ? "bg-blue-500/10 text-blue-500" : "bg-green-500/10 text-green-500"
                          }`}>
                            {isDeposit ? "30% Deposit" : "Full Payment"}
                          </span>
                          <span className="text-white font-semibold">
                            {formatCurrency(Number(payment.amount))}
                          </span>
                        </div>
                        {isDeposit && (
                          <p className="text-white/30 text-[10px] text-right mt-0.5">
                            of {formatCurrency(Number(payment.booking.totalPrice))}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-3 border-t border-white/[0.06]">
                  <p className="text-xs text-white/40">
                    {isFullView
                      ? `Showing ${startItem}–${endItem} of ${filteredCount} payment${filteredCount !== 1 ? "s" : ""}`
                      : `Showing ${payments.length} of ${totalAll} payments`}
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
