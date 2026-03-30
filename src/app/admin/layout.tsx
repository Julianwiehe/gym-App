import { requireRole } from "@/lib/auth/guards";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Navbar } from "@/components/layout/Navbar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole("ADMIN");
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <DashboardSidebar role="ADMIN" />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
