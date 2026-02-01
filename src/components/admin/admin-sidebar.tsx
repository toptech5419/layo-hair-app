"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  Clock,
  Settings,
  LogOut,
  Menu,
  X,
  Users,
  Star,
  BarChart3,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    label: "Bookings",
    href: "/admin/bookings",
    icon: Calendar,
  },
  {
    label: "Payments",
    href: "/admin/payments",
    icon: CreditCard,
  },
  {
    label: "Styles",
    href: "/admin/styles",
    icon: Scissors,
  },
  {
    label: "Availability",
    href: "/admin/availability",
    icon: Clock,
  },
  {
    label: "Reviews",
    href: "/admin/reviews",
    icon: Star,
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

interface AdminSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-zinc-900 border-b border-[#FFD700]/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="text-xl font-bold text-white">
            LAYO <span className="text-[#FFD700]">HAIR</span>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white p-3 -m-1 rounded-lg hover:bg-white/10 active:bg-white/20"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 w-64 bg-zinc-900 border-r border-[#FFD700]/10 z-50 transition-transform lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-[#FFD700]/10">
            <Link href="/admin" className="text-2xl font-bold text-white">
              LAYO <span className="text-[#FFD700]">HAIR</span>
            </Link>
            <p className="text-white/40 text-sm mt-1">Admin Panel</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3.5 rounded-lg transition-colors min-h-[48px]",
                    isActive
                      ? "bg-[#FFD700] text-black font-medium"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-[#FFD700]/10">
            <div className="px-4 py-3">
              <p className="text-white font-medium truncate">
                {user.name || "Admin"}
              </p>
              <p className="text-white/50 text-sm truncate">{user.email}</p>
              <span className="inline-block mt-1 text-xs bg-[#FFD700]/10 text-[#FFD700] px-2 py-0.5 rounded">
                {user.role}
              </span>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-white/70 hover:text-white hover:bg-white/5 mt-2"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
