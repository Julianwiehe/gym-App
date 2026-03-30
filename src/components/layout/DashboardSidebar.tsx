"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, User, Images, BookOpen,
  Building2, Search, DollarSign, ShieldCheck,
  Users, BarChart3, AlertTriangle,
} from "lucide-react";

type Role = "CHARACTER" | "COMPANY" | "ADMIN";

const characterLinks = [
  { href: "/dashboard/character", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/character/profile", label: "Edit Profile", icon: User },
  { href: "/dashboard/character/portfolio", label: "Portfolio", icon: Images },
  { href: "/dashboard/character/bookings", label: "Bookings", icon: BookOpen },
];

const companyLinks = [
  { href: "/dashboard/company", label: "Overview", icon: LayoutDashboard },
  { href: "/marketplace", label: "Find Characters", icon: Search },
  { href: "/dashboard/company/bookings", label: "My Bookings", icon: BookOpen },
  { href: "/dashboard/company/profile", label: "Company Profile", icon: Building2 },
];

const adminLinks = [
  { href: "/admin", label: "Analytics", icon: BarChart3 },
  { href: "/admin/characters", label: "Approve Characters", icon: ShieldCheck },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/bookings", label: "Bookings", icon: BookOpen },
  { href: "/admin/disputes", label: "Disputes", icon: AlertTriangle },
];

export function DashboardSidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const links =
    role === "CHARACTER" ? characterLinks :
    role === "COMPANY" ? companyLinks :
    adminLinks;

  return (
    <aside className="w-60 shrink-0 border-r bg-slate-50 min-h-[calc(100vh-4rem)]">
      <nav className="p-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/dashboard/character" || href === "/dashboard/company" || href === "/admin"
            ? pathname === href
            : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-violet-100 text-violet-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
