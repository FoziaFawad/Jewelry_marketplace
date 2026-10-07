import React from "react";
import { ShopCard } from "@/components/marketplace/ShopCard";
import { MOCK_SHOPS } from "@/lib/mock-data";
import { Store, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function ShopsDirectoryPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#ede5dc]">
        <div>
          <div className="flex items-center gap-2 text-[#9c7936] text-xs font-semibold uppercase tracking-wider mb-1.5">
            <Store className="w-4 h-4" />
            Verified Jewelry Sellers
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-normal text-stone-900">
            Featured Jewelry Houses
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-2xl leading-relaxed">
            Browse renowned jewelry houses and master goldsmith ateliers across Lahore, Karachi, and Islamabad. Each seller is verified for hallmark purity and certified gemstones.
          </p>
        </div>

        <Link
          href="/register?role=VENDOR"
          className="gold-btn px-5 py-2.5 rounded-full text-xs font-medium flex items-center gap-2 self-start md:self-auto shrink-0 shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Open a Jewelry Shop</span>
        </Link>
      </div>

      {/* Grid of Shops */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_SHOPS.map((shop) => (
          <ShopCard key={shop.id} shop={shop} />
        ))}
      </div>
    </div>
  );
}
