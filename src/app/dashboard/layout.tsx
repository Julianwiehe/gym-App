import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Navbar } from "@/components/layout/Navbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  if (session.role === "CHARACTER") {
    redirect("/dashboard/character");
  }
  if (session.role === "COMPANY") {
    redirect("/dashboard/company");
  }
  if (session.role === "ADMIN") {
    redirect("/admin");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <DashboardSidebar role={session.role} />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
