"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ShoppingBag, Store, ShieldAlert, User, Menu, X } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#ede5dc] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo - Eternelle Gems */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-[#fbf8f3] border border-[#ecd8b0] p-[1px] shadow-xs flex items-center justify-center transition-transform group-hover:scale-105">
            <Sparkles className="w-4 h-4 text-[#a37d36]" />
          </div>
          <div>
            <span className="text-lg font-serif font-semibold tracking-[0.2em] text-stone-900 uppercase block leading-none">
              ETERNELLE GEMS
            </span>
            <span className="text-[9px] tracking-[0.28em] text-[#9c7936] font-medium uppercase mt-0.5 block">
              Haute Joaillerie & Ateliers
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.14em] font-medium text-stone-700">
          <Link href="/jewelry" className="hover:text-[#9c7936] transition-colors">
            Jewelry Catalog
          </Link>
          <Link href="/shops" className="hover:text-[#9c7936] transition-colors">
            Artisan Ateliers
          </Link>
          <Link href="/jewelry?category=Rings" className="hover:text-[#9c7936] transition-colors">
            Bridal & Rings
          </Link>
          <Link href="/jewelry?gemstoneType=Diamond" className="hover:text-[#9c7936] transition-colors">
            Certified Diamonds
          </Link>
        </nav>

        {/* Right Section: Role Switches & Cart */}
        <div className="flex items-center gap-3">
          {/* Role Quick Links Pill */}
          <div className="hidden lg:flex items-center bg-[#f5f0ea] border border-[#e8ded4] rounded-full p-1 text-[11px]">
            <Link
              href="/dashboard"
              className="px-3 py-1 rounded-full text-stone-700 hover:text-stone-950 hover:bg-white transition-all flex items-center gap-1.5"
            >
              <Store className="w-3 h-3 text-[#a37d36]" />
              Vendor Portal
            </Link>
            <Link
              href="/admin/vendors"
              className="px-3 py-1 rounded-full text-stone-700 hover:text-stone-950 hover:bg-white transition-all flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3 h-3 text-emerald-700" />
              Governance
            </Link>
          </div>

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative p-2.5 rounded-full bg-[#faf6f0] border border-[#e8ded4] text-stone-800 hover:border-[#b48c48] hover:bg-white transition-all shadow-2xs"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 text-stone-700" />
            <span className="absolute -top-1 -right-1 bg-stone-900 text-white font-medium rounded-full h-4 w-4 text-[10px] flex items-center justify-center">
              2
            </span>
          </Link>

          {/* User Account / Login */}
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-full gold-outline-btn shadow-2xs"
          >
            <User className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-stone-700 hover:text-stone-900"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#ede5dc] px-5 pt-3 pb-6 space-y-4 shadow-md">
          <nav className="flex flex-col space-y-3 text-xs tracking-wider uppercase font-medium">
            <Link
              href="/jewelry"
              onClick={() => setMobileMenuOpen(false)}
              className="text-stone-800 hover:text-[#a37d36]"
            >
              Jewelry Catalog
            </Link>
            <Link
              href="/shops"
              onClick={() => setMobileMenuOpen(false)}
              className="text-stone-800 hover:text-[#a37d36]"
            >
              Artisan Ateliers
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#9c7936] flex items-center gap-2"
            >
              <Store className="w-4 h-4" /> Vendor Dashboard
            </Link>
            <Link
              href="/admin/vendors"
              onClick={() => setMobileMenuOpen(false)}
              className="text-emerald-700 flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" /> Admin Governance
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
