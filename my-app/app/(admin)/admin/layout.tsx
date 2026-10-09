"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  Percent,
  Store,
  ArrowLeft,
  Users,
  Gem,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-stone-900 font-sans antialiased">
      <header className="border-b border-[#ede5dc] bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#8a6828] flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-serif font-bold text-sm text-stone-900 tracking-wider">
                    ÉTERNERLLE
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-[#b48c48]/10 text-[#8a6828] font-bold tracking-widest uppercase">
                    GOVERNANCE
                  </span>
                </div>
                <p className="text-[10px] text-stone-500 font-medium">Marketplace Master Admin</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1.5">
              <Link
                href="/admin"
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all",
                  pathname === "/admin"
                    ? "bg-[#b48c48] text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-900 hover:bg-[#f5f0ea]"
                )}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </Link>
              <Link
                href="/admin/users"
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all",
                  pathname.startsWith("/admin/users")
                    ? "bg-[#b48c48] text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-900 hover:bg-[#f5f0ea]"
                )}
              >
                <Users className="w-3.5 h-3.5" />
                Users & Roles
              </Link>
              <Link
                href="/admin/products"
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all",
                  pathname.startsWith("/admin/products")
                    ? "bg-[#b48c48] text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-900 hover:bg-[#f5f0ea]"
                )}
              >
                <Gem className="w-3.5 h-3.5" />
                All Products
              </Link>
              <Link
                href="/admin/vendors"
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all",
                  pathname.startsWith("/admin/vendors")
                    ? "bg-[#b48c48] text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-900 hover:bg-[#f5f0ea]"
                )}
              >
                <Store className="w-3.5 h-3.5" />
                Ateliers & Shops
              </Link>
              <Link
                href="/admin/platform-fees"
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all",
                  pathname.startsWith("/admin/platform-fees")
                    ? "bg-[#b48c48] text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-900 hover:bg-[#f5f0ea]"
                )}
              >
                <Percent className="w-3.5 h-3.5" />
                Commissions
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-[#fcfaf7] border border-[#ede5dc] text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-medium text-stone-700">muhammadsohaib.19477@gmail.com</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#b48c48] text-white font-bold">
                ROOT ADMIN
              </span>
            </div>

            <Link
              href="/"
              className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#ede5dc] hover:bg-[#faf8f5] transition-colors shadow-2xs font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Boutique Store</span>
            </Link>
          </div>
        </div>

        {/* Mobile Sub-Navigation */}
        <div className="md:hidden flex items-center overflow-x-auto px-4 py-2 border-t border-[#ede5dc] gap-1.5 bg-[#faf8f5]/80">
          <Link
            href="/admin"
            className={cn(
              "px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap",
              pathname === "/admin"
                ? "bg-[#b48c48] text-white"
                : "text-stone-600 bg-white border border-[#ede5dc]"
            )}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/users"
            className={cn(
              "px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap",
              pathname.startsWith("/admin/users")
                ? "bg-[#b48c48] text-white"
                : "text-stone-600 bg-white border border-[#ede5dc]"
            )}
          >
            Users & Roles
          </Link>
          <Link
            href="/admin/products"
            className={cn(
              "px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap",
              pathname.startsWith("/admin/products")
                ? "bg-[#b48c48] text-white"
                : "text-stone-600 bg-white border border-[#ede5dc]"
            )}
          >
            All Products
          </Link>
          <Link
            href="/admin/vendors"
            className={cn(
              "px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap",
              pathname.startsWith("/admin/vendors")
                ? "bg-[#b48c48] text-white"
                : "text-stone-600 bg-white border border-[#ede5dc]"
            )}
          >
            Ateliers
          </Link>
          <Link
            href="/admin/platform-fees"
            className={cn(
              "px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap",
              pathname.startsWith("/admin/platform-fees")
                ? "bg-[#b48c48] text-white"
                : "text-stone-600 bg-white border border-[#ede5dc]"
            )}
          >
            Commissions
          </Link>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
