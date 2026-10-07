import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#faf8f5] text-stone-900">
      <header className="p-6">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white border border-[#ecd8b0] flex items-center justify-center shadow-2xs">
            <Sparkles className="w-4 h-4 text-[#a37d36]" />
          </div>
          <span className="font-serif font-semibold tracking-[0.2em] text-stone-900 text-sm uppercase">
            ETERNELLE GEMS
          </span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>
      <footer className="p-6 text-center text-xs text-stone-500">
        © 2026 Eternelle Gems Haute Joaillerie Marketplace
      </footer>
    </div>
  );
}
