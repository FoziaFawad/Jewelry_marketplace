import React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, Lock, Award, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#f5f0ea] border-t border-[#e8ded4] mt-20 text-stone-600">
      {/* Trust Badges Bar */}
      <div className="border-b border-[#e8ded4] bg-white/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#a37d36] shrink-0" />
            <div>
              <p className="text-xs font-semibold text-stone-900">Certified Diamonds & Gems</p>
              <p className="text-[11px] text-stone-500">100% Genuine Gemstones</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Lock className="w-6 h-6 text-[#a37d36] shrink-0" />
            <div>
              <p className="text-xs font-semibold text-stone-900">Secure Payments</p>
              <p className="text-[11px] text-stone-500">Safe checkout with Stripe</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-[#a37d36] shrink-0" />
            <div>
              <p className="text-xs font-semibold text-stone-900">Precious Metals</p>
              <p className="text-[11px] text-stone-500">14K, 18K Gold & Pure Platinum</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Globe className="w-6 h-6 text-[#a37d36] shrink-0" />
            <div>
              <p className="text-xs font-semibold text-stone-900">Insured Shipping</p>
              <p className="text-[11px] text-stone-500">Fast delivery with tracking</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-2 space-y-3.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#a37d36]" />
            <span className="text-base font-serif font-semibold text-stone-900 tracking-wider uppercase">
              Éternelle Gems
            </span>
          </div>
          <p className="text-xs text-stone-600 max-w-sm leading-relaxed">
            The multi-vendor marketplace for certified fine jewelry, engagement rings, and independent designers. Shop directly from verified jewelers with confidence.
          </p>
          <p className="text-xs text-[#8c672b] font-medium">
            Protected by Stripe payments & buyer protection guarantee.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-3">
            Shop Jewelry
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/jewelry?category=Rings" className="hover:text-stone-950">Rings & Solitaires</Link></li>
            <li><Link href="/jewelry?category=Necklaces" className="hover:text-stone-950">Necklaces & Pendants</Link></li>
            <li><Link href="/jewelry?category=Bracelets" className="hover:text-stone-950">Tennis Bracelets</Link></li>
            <li><Link href="/jewelry?category=Earrings" className="hover:text-stone-950">Earrings & Studs</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-3">
            Sell With Us
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/shops" className="hover:text-stone-950">Browse Shops</Link></li>
            <li><Link href="/dashboard" className="hover:text-stone-950">Seller Dashboard</Link></li>
            <li><Link href="/dashboard/products/new" className="hover:text-stone-950">Add a New Product</Link></li>
            <li><Link href="/register?role=VENDOR" className="hover:text-stone-950">Open a Jewelry Shop</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-3">
            Trust & Support
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/admin/vendors" className="hover:text-stone-950">Verified Sellers</Link></li>
            <li><Link href="/admin/platform-fees" className="hover:text-stone-950">Pricing & Fees</Link></li>
            <li><span className="text-stone-500">100% Conflict-Free Sourcing</span></li>
            <li><span className="text-stone-500">GIA / IGI Quality Standards</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#e8ded4] py-6 text-center text-xs text-stone-500">
        © 2026 Éternelle Gems Jewelry Marketplace. All rights reserved.
      </div>
    </footer>
  );
}
