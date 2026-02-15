import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { prisma } from "@/lib/prisma";
import StylesClient from "@/components/admin/StylesClient";

export default async function AdminStylesPage() {
  // Fetch styles from database with booking counts
  const styles = await prisma.style.findMany({
    include: {
      _count: {
        select: { bookings: true },
      },
    },
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
  });

  // Convert Decimal to number for client component
  const serializedStyles = styles.map((style) => ({
    ...style,
    price: Number(style.price),
    priceMax: style.priceMax ? Number(style.priceMax) : null,
    durationMax: style.durationMax ?? null,
  }));

  // Get unique categories for filter tabs
  const categories = ["All", ...new Set(styles.map((s) => s.category))];

  // Calculate stats
  const stats = {
    total: styles.length,
    active: styles.filter((s) => s.isActive).length,
    featured: styles.filter((s) => s.isFeatured).length,
    totalBookings: styles.reduce((sum, s) => sum + s._count.bookings, 0),
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
          <StylesClient
            styles={serializedStyles}
            stats={stats}
            categories={categories}
          />
        </div>
      </main>
    </div>
  );
}
