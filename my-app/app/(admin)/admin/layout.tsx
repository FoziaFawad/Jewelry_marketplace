"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Percent, Store, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-stone-900">
      <header className="border-b border-[#ede5dc] bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#f5f0ea] flex items-center justify-center border border-[#ede5dc]">
                <ShieldCheck className="w-4 h-4 text-[#b48c48]" />
              </div>
              <span className="font-serif font-bold text-sm text-stone-900 tracking-wider">
                ETERNERLLE GEMS • GOVERNANCE
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#b48c48]/10 text-[#8a6828] border border-[#b48c48]/25 font-semibold">
                Super Admin
              </span>
            </div>

            <nav className="hidden sm:flex items-center gap-2">
              <Link
                href="/admin/vendors"
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all",
                  pathname.startsWith("/admin/vendors")
                    ? "bg-[#b48c48] text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-900 hover:bg-[#f5f0ea]"
                )}
              >
                <Store className="w-3.5 h-3.5" />
                Atelier Verifications & KYC
              </Link>
              <Link
                href="/admin/platform-fees"
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all",
                  pathname.startsWith("/admin/platform-fees")
                    ? "bg-[#b48c48] text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-900 hover:bg-[#f5f0ea]"
                )}
              >
                <Percent className="w-3.5 h-3.5" />
                Commission & Fee Ledger
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#ede5dc] hover:bg-[#faf8f5] transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Exit to Boutique
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
