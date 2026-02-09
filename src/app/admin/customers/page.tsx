import Link from "next/link";
import {
  Users,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  RefreshCw,
  UserCheck,
  UserX,
} from "lucide-react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

const PREVIEW_COUNT = 2;
const PER_PAGE = 10;

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);
}

interface UnifiedCustomer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  isRegistered: boolean;
  totalBookings: number;
  totalSpent: number;
  lastBookingDate: Date | null;
  joinedDate: Date;
}

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; page?: string }>;
}) {
  const params = await searchParams;
  const isFullView = params.view === "all" || !!params.page;
  const currentPage = Math.max(1, parseInt(params.page || "1"));

  // Fetch registered customers with their bookings and payments
  const registeredUsers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: {
      bookings: {
        include: { payments: true },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Fetch guest bookings (no registered account)
  const guestBookings = await prisma.booking.findMany({
    where: {
      customerId: null,
      guestEmail: { not: null },
    },
    include: { payments: true },
    orderBy: { createdAt: "desc" },
  });

  // Build unified customer list
  const customers: UnifiedCustomer[] = [];

  // Track registered emails to avoid duplicates
  const registeredEmails = new Set<string>();

  for (const user of registeredUsers) {
    registeredEmails.add(user.email.toLowerCase());

    const totalSpent = user.bookings.reduce((sum, b) => {
      const paid = b.payments
        .filter((p) => p.status === "COMPLETED")
        .reduce((s, p) => s + Number(p.amount), 0);
      return sum + paid;
    }, 0);

    customers.push({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isRegistered: true,
      totalBookings: user.bookings.length,
      totalSpent,
      lastBookingDate: user.bookings[0]?.createdAt || null,
      joinedDate: user.createdAt,
    });
  }

  // Group guest bookings by email
  const guestMap = new Map<string, (typeof guestBookings)[number][]>();

  for (const booking of guestBookings) {
    const email = booking.guestEmail!.toLowerCase();
    if (registeredEmails.has(email)) continue;
    if (!guestMap.has(email)) guestMap.set(email, []);
    guestMap.get(email)!.push(booking);
  }

  for (const [email, bookings] of guestMap) {
    const first = bookings[0];
    const totalSpent = bookings.reduce((sum, b) => {
      const paid = b.payments
        .filter((p) => p.status === "COMPLETED")
        .reduce((s, p) => s + Number(p.amount), 0);
      return sum + paid;
    }, 0);

    customers.push({
      id: `guest-${email}`,
      name: first.guestName || "Guest",
      email: first.guestEmail!,
      phone: first.guestPhone,
      isRegistered: false,
      totalBookings: bookings.length,
      totalSpent,
      lastBookingDate: bookings[0]?.createdAt || null,
      joinedDate: bookings[bookings.length - 1]?.createdAt || new Date(),
    });
  }

  // Sort by last booking date (most recent first)
  customers.sort((a, b) => {
    const aDate = a.lastBookingDate || a.joinedDate;
    const bDate = b.lastBookingDate || b.joinedDate;
    return bDate.getTime() - aDate.getTime();
  });

  // Stats
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const stats = {
    total: customers.length,
    newThisMonth: customers.filter((c) => c.joinedDate >= startOfMonth).length,
    repeat: customers.filter((c) => c.totalBookings > 1).length,
    avgSpend:
      customers.length > 0
        ? customers.reduce((sum, c) => sum + c.totalSpent, 0) /
          customers.length
        : 0,
  };

  // Pagination
  const totalCount = customers.length;
  const totalPages = Math.ceil(totalCount / PER_PAGE);
  const startItem = (currentPage - 1) * PER_PAGE + 1;
  const endItem = Math.min(currentPage * PER_PAGE, totalCount);

  const displayedCustomers = isFullView
    ? customers.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)
    : customers.slice(0, PREVIEW_COUNT);

  function buildUrl(newPage?: number) {
    const p = new URLSearchParams();
    p.set("view", "all");
    if (newPage && newPage > 1) p.set("page", newPage.toString());
    return `/admin/customers?${p.toString()}`;
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
                Customers
              </h1>
              <p className="text-white/50 text-sm mt-1">
                Track your customer base ({stats.total} total)
              </p>
            </div>
            <Link
              href={
                isFullView
                  ? "/admin/customers?view=all"
                  : "/admin/customers"
              }
            >
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
            <div className="bg-zinc-900 rounded-xl p-4 border border-green-500/20">
              <p className="text-green-500 text-sm">New This Month</p>
              <p className="text-2xl font-bold text-white">
                {stats.newThisMonth}
              </p>
            </div>
            <div className="bg-zinc-900 rounded-xl p-4 border border-[#FFD700]/20">
              <p className="text-[#FFD700] text-sm">Repeat</p>
              <p className="text-2xl font-bold text-white">{stats.repeat}</p>
            </div>
            <div className="bg-zinc-900 rounded-xl p-4 border border-blue-500/20">
              <p className="text-blue-500 text-sm">Avg Spend</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(stats.avgSpend)}
              </p>
            </div>
          </div>

          {/* Customers List */}
          <div className="bg-zinc-900 rounded-xl border border-white/[0.06] overflow-hidden">
            {/* Section Header with View Toggle */}
            <div className="flex items-center justify-between p-3 border-b border-white/[0.06]">
              <h3 className="text-sm font-medium text-white/70">
                {isFullView ? "All Customers" : "Recent Customers"}
              </h3>
              {totalCount > PREVIEW_COUNT && (
                <Link
                  href={
                    isFullView
                      ? "/admin/customers"
                      : "/admin/customers?view=all"
                  }
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

            {displayedCustomers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-lg text-white/60 mb-2">
                  No customers yet
                </h3>
                <p className="text-white/40 text-sm">
                  Customers will appear here once they make bookings
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
                          PHONE
                        </th>
                        <th className="text-left p-3 text-white/50 text-xs font-medium">
                          BOOKINGS
                        </th>
                        <th className="text-left p-3 text-white/50 text-xs font-medium">
                          TOTAL SPENT
                        </th>
                        <th className="text-left p-3 text-white/50 text-xs font-medium hidden lg:table-cell">
                          LAST BOOKING
                        </th>
                        <th className="text-left p-3 text-white/50 text-xs font-medium hidden md:table-cell">
                          TYPE
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {displayedCustomers.map((customer) => (
                        <tr
                          key={customer.id}
                          className="hover:bg-white/[0.03] transition-colors"
                        >
                          <td className="p-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-[#FFD700]/10 flex items-center justify-center flex-shrink-0">
                                <span className="text-[#FFD700] text-xs font-semibold">
                                  {customer.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <p className="text-white font-medium text-sm truncate">
                                  {customer.name}
                                </p>
                                <p className="text-white/40 text-xs truncate">
                                  {customer.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 hidden md:table-cell">
                            <span className="text-white/60 text-sm">
                              {customer.phone || "\u2014"}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="text-white text-sm font-medium">
                              {customer.totalBookings}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="text-white/60 text-sm">
                              {formatCurrency(customer.totalSpent)}
                            </span>
                          </td>
                          <td className="p-3 hidden lg:table-cell">
                            <span className="text-white/40 text-sm">
                              {customer.lastBookingDate
                                ? new Date(
                                    customer.lastBookingDate
                                  ).toLocaleDateString("en-GB", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })
                                : "\u2014"}
                            </span>
                          </td>
                          <td className="p-3 hidden md:table-cell">
                            {customer.isRegistered ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                                <UserCheck className="w-3 h-3" />
                                Registered
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-white/50">
                                <UserX className="w-3 h-3" />
                                Guest
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="sm:hidden divide-y divide-white/[0.04]">
                  {displayedCustomers.map((customer) => (
                    <div key={customer.id} className="p-3.5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-full bg-[#FFD700]/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-[#FFD700] text-xs font-semibold">
                              {customer.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {customer.name}
                            </p>
                            <p className="text-[10px] text-white/40 truncate">
                              {customer.email}
                            </p>
                          </div>
                        </div>
                        {customer.isRegistered ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-500/10 text-green-500 flex-shrink-0">
                            <UserCheck className="w-3 h-3" />
                            Registered
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-800 text-white/50 flex-shrink-0">
                            <UserX className="w-3 h-3" />
                            Guest
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs mb-1.5">
                        <span className="text-white/60">
                          <span className="text-white font-medium">
                            {customer.totalBookings}
                          </span>{" "}
                          booking{customer.totalBookings !== 1 ? "s" : ""}
                        </span>
                        <span className="text-white/20">&middot;</span>
                        <span className="text-white/60">
                          {formatCurrency(customer.totalSpent)} spent
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                        <span className="text-white/30 text-[10px]">
                          {customer.lastBookingDate
                            ? `Last: ${new Date(
                                customer.lastBookingDate
                              ).toLocaleDateString("en-GB", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}`
                            : "No bookings"}
                        </span>
                        {customer.phone && (
                          <span className="text-white/40 text-[10px]">
                            {customer.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-3 border-t border-white/[0.06]">
                  <p className="text-xs text-white/40">
                    {isFullView
                      ? `${startItem}\u2013${endItem} of ${totalCount} customers`
                      : `${displayedCustomers.length} of ${totalCount} customers`}
                  </p>
                  {isFullView && totalPages > 1 && (
                    <div className="flex items-center gap-1">
                      {currentPage > 1 ? (
                        <Link href={buildUrl(currentPage - 1)}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-white/50 hover:text-white"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                        </Link>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-white/20"
                          disabled
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                      )}
                      <span className="text-xs text-white/50 px-2">
                        {currentPage} / {totalPages}
                      </span>
                      {currentPage < totalPages ? (
                        <Link href={buildUrl(currentPage + 1)}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-white/50 hover:text-white"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-white/20"
                          disabled
                        >
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
