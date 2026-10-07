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
              <p className="text-xs font-semibold text-stone-900">GIA & IGI Verified</p>
              <p className="text-[11px] text-stone-500">100% Certified Gemstones</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Lock className="w-6 h-6 text-[#a37d36] shrink-0" />
            <div>
              <p className="text-xs font-semibold text-stone-900">Escrow & Split Payouts</p>
              <p className="text-[11px] text-stone-500">Secured with Stripe Connect</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-[#a37d36] shrink-0" />
            <div>
              <p className="text-xs font-semibold text-stone-900">Artisan Hallmarks</p>
              <p className="text-[11px] text-stone-500">18K, 24K & 950 Platinum</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Globe className="w-6 h-6 text-[#a37d36] shrink-0" />
            <div>
              <p className="text-xs font-semibold text-stone-900">Insured Global Courier</p>
              <p className="text-[11px] text-stone-500">Armored delivery & tracking</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#a37d36]" />
            <span className="text-base font-serif font-semibold text-stone-900 tracking-[0.2em] uppercase">
              ETERNELLE GEMS
            </span>
          </div>
          <p className="text-xs text-stone-600 max-w-sm leading-relaxed">
            The premier multi-vendor destination for fine jewelry, certified diamonds, and independent master goldsmiths across Geneva, Milan, Antwerp, and New York. Faithful to the principles of fine craftsmanship.
          </p>
          <p className="text-xs text-[#8c672b] font-medium">
            Protected by Stripe Connect marketplace splits & automated escrow.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-3">
            Curated Jewelry
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/jewelry?category=Rings" className="hover:text-stone-950">Solitaire & Bridal Rings</Link></li>
            <li><Link href="/jewelry?category=Necklaces" className="hover:text-stone-950">Fine Necklaces & Chokers</Link></li>
            <li><Link href="/jewelry?category=Bracelets" className="hover:text-stone-950">Tennis Bracelets</Link></li>
            <li><Link href="/jewelry?category=Earrings" className="hover:text-stone-950">Precious Earrings</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-3">
            Vendor Ateliers
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/shops" className="hover:text-stone-950">Atelier Directory</Link></li>
            <li><Link href="/dashboard" className="hover:text-stone-950">Vendor Portal Login</Link></li>
            <li><Link href="/dashboard/products/new" className="hover:text-stone-950">List Fine Jewelry</Link></li>
            <li><Link href="/register?role=VENDOR" className="hover:text-stone-950">Apply as an Atelier</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-3">
            Governance & Trust
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/admin/vendors" className="hover:text-stone-950">KYC Verification</Link></li>
            <li><Link href="/admin/platform-fees" className="hover:text-stone-950">Platform Split Fees</Link></li>
            <li><span className="text-stone-500">Conflict-Free Kimberley Process</span></li>
            <li><span className="text-stone-500">GIA / IGI Certification Standards</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#e8ded4] py-6 text-center text-xs text-stone-500">
        © 2026 Eternelle Gems Multi-Vendor Haute Joaillerie Marketplace. All rights reserved.
      </div>
    </footer>
  );
}
