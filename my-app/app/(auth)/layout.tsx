import React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fbf9f6] text-stone-900 relative">
      {/* Top Header */}
      <header className="px-6 py-5 max-w-6xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-white border border-[#ecd8b0] flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4 text-[#a37d36]" />
          </div>
          <div>
            <span className="font-serif font-semibold tracking-wider text-stone-900 text-sm uppercase block">
              Éternelle Gems
            </span>
            <span className="text-[9px] tracking-widest text-[#a37d36] font-medium uppercase block">
              Jewelry Marketplace
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-500 bg-white px-3 py-1.5 rounded-full border border-stone-200 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure Login</span>
          </div>

          <Link
            href="/jewelry"
            className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 font-medium px-3 py-1.5 rounded-full hover:bg-stone-100 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Browse Jewelry</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        {children}
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-stone-200 bg-white/60 text-center">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-500">
          <span>Certified Fine Jewelry & Artisan Marketplace</span>
          <span>© 2026 Éternelle Gems. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
