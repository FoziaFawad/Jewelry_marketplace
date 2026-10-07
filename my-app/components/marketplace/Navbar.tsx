"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ShoppingBag,
  Store,
  ShieldCheck,
  User,
  Menu,
  X,
  LogOut,
  ChevronDown,
} from "lucide-react";

interface UserSession {
  id: string;
  name: string;
  email: string;
  role: "BUYER" | "VENDOR" | "ADMIN";
  shopId?: string | null;
  shopSlug?: string | null;
  shopName?: string | null;
}

export function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);

  // Check authenticated session
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
      })
      .catch(() => setCurrentUser(null));
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setCurrentUser(null);
      setUserDropdownOpen(false);
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#ede5dc] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo - Eternelle Gems */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-[#fbf8f3] border border-[#ecd8b0] p-[1px] shadow-xs flex items-center justify-center transition-transform group-hover:scale-105">
            <Sparkles className="w-4 h-4 text-[#a37d36]" />
          </div>
          <div>
            <span className="text-lg font-serif font-semibold tracking-wide text-stone-900 uppercase block leading-none">
              Éternelle Gems
            </span>
            <span className="text-[10px] tracking-wider text-[#9c7936] font-medium uppercase mt-0.5 block">
              Fine Jewelry Marketplace
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs uppercase tracking-wider font-medium text-stone-700">
          <Link href="/jewelry" className="hover:text-[#9c7936] transition-colors">
            All Jewelry
          </Link>
          <Link href="/jewelry?category=Necklaces" className="hover:text-[#9c7936] transition-colors">
            Bridal Sets
          </Link>
          <Link href="/jewelry?category=Bracelets" className="hover:text-[#9c7936] transition-colors">
            Bangles & Kangan
          </Link>
          <Link href="/jewelry?category=Rings" className="hover:text-[#9c7936] transition-colors">
            Solitaire Rings
          </Link>
          <Link href="/shops" className="hover:text-[#9c7936] transition-colors">
            Jewelry Houses
          </Link>
        </nav>

        {/* Right Action Icons & Auth */}
        <div className="flex items-center gap-3">
          {/* Quick RBAC Links */}
          <div className="hidden lg:flex items-center gap-1.5 mr-1 border-r border-[#ede5dc] pr-3 text-[11px] font-medium uppercase tracking-wider">
            <Link
              href="/dashboard"
              className="px-2.5 py-1 rounded-full text-[#9c7936] hover:bg-[#faf5ed] transition-colors flex items-center gap-1"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Seller Dashboard</span>
            </Link>
            <Link
              href="/admin/vendors"
              className="px-2.5 py-1 rounded-full text-emerald-800 hover:bg-emerald-50 transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
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

          {/* User Account / Login State */}
          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-[#fbf9f6] border border-[#e5d5be] hover:border-[#b48c48] transition-all shadow-2xs cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-[#b48c48] text-white flex items-center justify-center text-[10px] font-bold uppercase">
                  {currentUser.name ? currentUser.name.slice(0, 1) : "U"}
                </div>
                <div className="text-left hidden sm:block">
                  <span className="block text-stone-900 font-semibold leading-tight text-[11px] max-w-[100px] truncate">
                    {currentUser.name}
                  </span>
                  <span className="block text-[9px] uppercase tracking-wider text-[#9c7936] leading-none">
                    {currentUser.role}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-stone-500" />
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#ede5dc] shadow-xl py-2 z-50 animate-in fade-in">
                  <div className="px-4 py-2 border-b border-[#f0e7db]">
                    <p className="text-xs font-semibold text-stone-900 truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-[11px] text-stone-500 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider bg-[#faf5ed] border border-[#ecd8b0] text-[#826229]">
                      {currentUser.role} Account
                    </span>
                  </div>

                  <div className="py-1 text-xs text-stone-700">
                    {currentUser.role === "VENDOR" && (
                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-[#faf5ed] hover:text-[#826229]"
                      >
                        <Store className="w-3.5 h-3.5" />
                        <span>Vendor Dashboard</span>
                      </Link>
                    )}

                    {currentUser.role === "ADMIN" && (
                      <Link
                        href="/admin/vendors"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-emerald-50 hover:text-emerald-900"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Admin Governance</span>
                      </Link>
                    )}

                    <Link
                      href="/jewelry"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-[#faf8f5]"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Browse Collections</span>
                    </Link>
                  </div>

                  <div className="border-t border-[#f0e7db] pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 text-left cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-full gold-outline-btn shadow-2xs"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          )}

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
              All Jewelry
            </Link>
            <Link
              href="/shops"
              onClick={() => setMobileMenuOpen(false)}
              className="text-stone-800 hover:text-[#a37d36]"
            >
              Jewelry Shops
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#9c7936] flex items-center gap-2"
            >
              <Store className="w-4 h-4" /> Seller Dashboard
            </Link>
            <Link
              href="/admin/vendors"
              onClick={() => setMobileMenuOpen(false)}
              className="text-emerald-700 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> Admin Portal
            </Link>

            {currentUser ? (
              <button
                onClick={handleLogout}
                className="text-rose-600 flex items-center gap-2 pt-2 text-left cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Sign Out ({currentUser.name})
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-stone-900 font-semibold flex items-center gap-2 pt-2"
              >
                <User className="w-4 h-4" /> Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
