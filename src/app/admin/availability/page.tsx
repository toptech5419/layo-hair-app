import { RefreshCw } from "lucide-react";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { AvailabilityForm } from "@/components/admin/availability-form";

export default async function AdminAvailabilityPage() {
  // Fetch availability from database
  const availability = await prisma.availability.findMany({
    orderBy: { dayOfWeek: "asc" },
  });

  // Fetch blocked dates from database
  const blockedDates = await prisma.blockedDate.findMany({
    where: {
      date: { gte: new Date() }, // Only show future blocked dates
    },
    orderBy: { date: "asc" },
  });

  // Transform availability data for the form
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const scheduleData = daysOfWeek.map((day, index) => {
    const slot = availability.find((a) => a.dayOfWeek === index);
    return {
      day,
      dayOfWeek: index,
      isOpen: slot?.isAvailable ?? (index !== 0), // Default: closed on Sunday
      start: slot?.startTime ?? "09:00",
      end: slot?.endTime ?? "18:00",
    };
  });

  const blockedData = blockedDates.map((b) => ({
    id: b.id,
    date: b.date.toISOString().split("T")[0],
    reason: b.reason || "",
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
                Availability
              </h1>
              <p className="text-white/50 text-sm mt-1">
                Set your working hours and block specific dates
              </p>
            </div>
            <Link href="/admin/availability">
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

          {/* Client-side form for managing availability */}
          <AvailabilityForm
            initialSchedule={scheduleData}
            initialBlocked={blockedData}
          />
        </div>
      </main>
    </div>
  );
}
