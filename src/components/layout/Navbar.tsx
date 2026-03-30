import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { NavbarClient } from "./NavbarClient";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export async function Navbar() {
  const user = await getSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="h-8 w-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span>CharacterX</span>
          </Link>

          {/* Center nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/marketplace"
              className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors"
            >
              Browse Characters
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors"
            >
              How It Works
            </Link>
          </nav>

          {/* Right side */}
          <NavbarClient user={user} />
        </div>
      </div>
    </header>
  );
}
