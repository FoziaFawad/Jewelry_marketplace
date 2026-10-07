"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Gem,
  PlusCircle,
  PackageCheck,
  Settings,
  Store,
  ArrowUpRight,
} from "lucide-react";

export function VendorNav() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/products", label: "My Products", icon: Gem },
    { href: "/dashboard/products/new", label: "Add Product", icon: PlusCircle },
    { href: "/dashboard/orders", label: "Orders", icon: PackageCheck },
    { href: "/dashboard/settings", label: "Shop Settings", icon: Settings },
  ];

  return (
    <div className="w-full border-b border-[#ede5dc] bg-white/95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-sm font-serif font-semibold tracking-wide text-stone-900">
              NAURATTAN HERITAGE JEWELERS
            </span>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#faf5ed] text-[#826229] border border-[#ecd8b0] font-medium">
              Seller Account
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1.5">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all",
                    isActive
                      ? "bg-[#faf5ed] text-[#826229] border border-[#ecd8b0] shadow-2xs font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-[#faf8f5]"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/shops/aurora-gems"
            target="_blank"
            className="text-xs text-[#826229] hover:text-[#5c441b] flex items-center gap-1 font-medium"
          >
            <Store className="w-3.5 h-3.5 text-[#9c7936]" />
            <span>View Public Shop</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
          <Link
            href="/"
            className="text-xs text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-full bg-[#faf6f0] border border-[#e8ded4] shadow-2xs"
          >
            Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
