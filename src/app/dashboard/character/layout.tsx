import { requireRole } from "@/lib/auth/guards";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Navbar } from "@/components/layout/Navbar";

export default async function CharacterDashboardLayout({ children }: { children: React.ReactNode }) {
  await requireRole("CHARACTER");
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <DashboardSidebar role="CHARACTER" />
        <main className="flex-1 p-8 max-w-5xl">{children}</main>
      </div>
    </div>
  );
}
