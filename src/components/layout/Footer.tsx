import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-3">
              <div className="h-7 w-7 rounded-lg bg-violet-600 flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              CharacterX
            </Link>
            <p className="text-sm text-slate-500">
              The marketplace for AI Characters. Book virtual influencers for your brand.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="/marketplace" className="hover:text-violet-600">Browse Characters</Link></li>
              <li><Link href="/register" className="hover:text-violet-600">Join as Character</Link></li>
              <li><Link href="/register" className="hover:text-violet-600">Join as Company</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="/#how-it-works" className="hover:text-violet-600">How It Works</Link></li>
              <li><Link href="/login" className="hover:text-violet-600">Sign In</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><span className="cursor-default">Privacy Policy</span></li>
              <li><span className="cursor-default">Terms of Service</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} CharacterX. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
