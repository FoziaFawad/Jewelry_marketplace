"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MOCK_ORDERS, MOCK_PRODUCTS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  Package,
  Clock,
  Truck,
  CheckCircle2,
  Heart,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  FileText,
  User,
  MapPin,
  Eye,
  LogOut,
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function BuyerDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "wishlist" | "profile">("orders");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          // Fallback user if in demo mode
          setUser({
            id: "usr_buyer_demo",
            name: "Ayla Zahra",
            email: "ayla.collector@eternelle.com",
            role: "BUYER",
          });
        }
        setLoading(false);
      })
      .catch(() => {
        setUser({
          id: "usr_buyer_demo",
          name: "Ayla Zahra",
          email: "ayla.collector@eternelle.com",
          role: "BUYER",
        });
        setLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    }
  };

  const wishlistItems = MOCK_PRODUCTS.slice(0, 3);
  const orders = MOCK_ORDERS;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 animate-in fade-in duration-300">
      {/* Collector Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-[#1e1b18] text-white p-7 sm:p-10 border border-stone-800 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-[#b48c48]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-[#c5a059]/40 text-[#dfc38a] text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#dfc38a]" />
              <span>Verified Haute Horlogerie & Gem Collector</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-normal text-stone-100 tracking-tight">
              Welcome back, {user?.name || "Collector"}
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 max-w-xl">
              Manage your bespoke jewelry vault, track insured white-glove shipments, and view third-party laboratory certificates (GIA / IGI).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/jewelry"
              className="gold-btn px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Browse New Pieces</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 text-xs font-medium flex items-center gap-1.5 border border-white/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 font-medium">
              Vault Collection Value
            </span>
            <div className="text-xl sm:text-2xl font-serif text-[#dfc38a] mt-1 font-semibold">
              PKR 1,205,000
            </div>
            <span className="text-[10px] text-stone-400">Insured Replacement Value</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 font-medium">
              Active Orders
            </span>
            <div className="text-xl sm:text-2xl font-serif text-white mt-1 font-semibold">
              {orders.length} in Transit
            </div>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
              <Truck className="w-3 h-3" /> Live Tracking Active
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 font-medium">
              Curated Wishlist
            </span>
            <div className="text-xl sm:text-2xl font-serif text-white mt-1 font-semibold">
              {wishlistItems.length} Pieces
            </div>
            <span className="text-[10px] text-stone-400">Saved from 2 Ateliers</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 font-medium">
              GIA Certificates
            </span>
            <div className="text-xl sm:text-2xl font-serif text-white mt-1 font-semibold">
              3 Verified
            </div>
            <span className="text-[10px] text-[#dfc38a] flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3 h-3" /> 100% Authenticated
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-3 border-b border-[#ede5dc] pb-2">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
            activeTab === "orders"
              ? "bg-[#b48c48] text-white shadow-xs"
              : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
          }`}
        >
          My Orders & Vault ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab("wishlist")}
          className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
            activeTab === "wishlist"
              ? "bg-[#b48c48] text-white shadow-xs"
              : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
          }`}
        >
          Saved Wishlist ({wishlistItems.length})
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
            activeTab === "profile"
              ? "bg-[#b48c48] text-white shadow-xs"
              : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
          }`}
        >
          Delivery & Security
        </button>
      </div>

      {/* TAB 1: Orders */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif font-semibold text-stone-900">
              Active Orders & Shipment Tracking
            </h2>
            <span className="text-xs text-stone-500">
              White-glove armored transit with live updates
            </span>
          </div>

          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-[#ede5dc] p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow space-y-6"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f3ece3]">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono font-bold text-stone-900">
                        Order #{order.id.toUpperCase()}
                      </span>
                      <Badge variant="gold" className="text-[10px] uppercase font-semibold">
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-stone-400 mt-1">
                      Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[11px] uppercase tracking-wider text-stone-400 block">
                      Total Invoice
                    </span>
                    <span className="text-lg font-serif font-bold text-stone-900">
                      PKR {order.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Sub-Orders / Items */}
                <div className="space-y-4">
                  {order.subOrders.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-4 sm:p-5 rounded-2xl bg-[#fdfbf7] border border-[#f0e7dc] flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-[#ede5dc]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={sub.items[0]?.product.images[0] || "/placeholder.jpg"}
                            alt={sub.items[0]?.product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs uppercase tracking-wider font-semibold text-[#826229]">
                            {sub.shop?.name}
                          </p>
                          <h3 className="text-sm font-serif font-medium text-stone-900">
                            {sub.items[0]?.product.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-stone-500">
                            <span>Qty: {sub.items[0]?.quantity}</span>
                            <span>•</span>
                            <span className="font-semibold text-stone-900">
                              PKR {sub.items[0]?.priceAtSale.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Tracking / Action */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 lg:self-center">
                        {sub.trackingNumber && (
                          <div className="px-3.5 py-2 rounded-xl bg-white border border-[#ede5dc] text-xs">
                            <span className="text-[10px] uppercase text-stone-400 block font-medium">
                              Courier Tracking
                            </span>
                            <span className="font-mono font-semibold text-stone-800">
                              {sub.trackingNumber}
                            </span>
                          </div>
                        )}
                        <Link
                          href={`/jewelry/${sub.items[0]?.productId}`}
                          className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#faf5ed] text-[#826229] hover:bg-[#f3e7d5] transition-colors text-center"
                        >
                          View Piece
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress Timeline */}
                <div className="pt-2">
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="space-y-1.5">
                      <div className="w-6 h-6 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] font-medium text-stone-900 block">Payment Escrow</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="w-6 h-6 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] font-medium text-stone-900 block">Hallmarked</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="w-6 h-6 mx-auto rounded-full bg-[#b48c48] text-white flex items-center justify-center animate-pulse">
                        <Truck className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] font-semibold text-[#826229] block">In Transit</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="w-6 h-6 mx-auto rounded-full bg-stone-200 text-stone-500 flex items-center justify-center">
                        <Package className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] text-stone-400 block">Vault Delivery</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Wishlist */}
      {activeTab === "wishlist" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif font-semibold text-stone-900">
              Curated Collector Wishlist
            </h2>
            <Link
              href="/jewelry"
              className="text-xs text-[#826229] font-medium hover:underline flex items-center gap-1"
            >
              <span>Explore More Pieces</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-3xl border border-[#ede5dc] overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between"
              >
                <div className="relative aspect-square overflow-hidden bg-stone-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={prod.images[0]}
                    alt={prod.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-rose-600 shadow-xs">
                    <Heart className="w-4 h-4 fill-rose-600" />
                  </div>
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-medium uppercase tracking-wider">
                    {prod.metalPurity} {prod.metalType}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#826229] block">
                      {prod.shop?.name}
                    </span>
                    <h3 className="text-sm font-serif font-medium text-stone-900 line-clamp-1 mt-0.5">
                      {prod.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#f3ece3]">
                    <span className="text-base font-serif font-bold text-stone-900">
                      PKR {prod.price.toLocaleString()}
                    </span>
                    <Link
                      href={`/jewelry/${prod.id}`}
                      className="gold-btn px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1"
                    >
                      <span>View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Delivery & Profile Security */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vault Delivery Address */}
          <div className="p-7 rounded-3xl bg-white border border-[#ede5dc] shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#b48c48]" />
              <h3 className="text-base font-serif font-semibold text-stone-900">
                Primary Insured Vault Address
              </h3>
            </div>
            <p className="text-xs text-stone-500">
              Armored deliveries will only be handed over to registered recipients with valid national CNIC or passport identification.
            </p>
            <div className="p-4 rounded-2xl bg-[#faf7f2] border border-[#ede5dc] space-y-1 text-xs">
              <p className="font-semibold text-stone-900">{user?.name || "Ayla Zahra"}</p>
              <p className="text-stone-600">House 44, Sector F-7/2</p>
              <p className="text-stone-600">Islamabad, 44000, Pakistan</p>
              <p className="text-stone-500 pt-1">Phone: +92 300 8594012</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl text-xs">
              Update Vault Address
            </Button>
          </div>

          {/* Security & Authenticity Credentials */}
          <div className="p-7 rounded-3xl bg-white border border-[#ede5dc] shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="text-base font-serif font-semibold text-stone-900">
                Collector Credentials & Verification
              </h3>
            </div>
            <p className="text-xs text-stone-500">
              Your Éternelle credentials authenticate laboratory-guaranteed jewelry transfers.
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                <span className="font-medium">Email Authentication:</span>
                <span className="flex items-center gap-1 font-semibold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified ({user?.email})
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-800">
                <span className="font-medium">Account Designation:</span>
                <span className="font-semibold uppercase tracking-wider text-[#826229]">
                  Fine Jewelry Buyer
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-800">
                <span className="font-medium">Escrow Protection:</span>
                <span className="font-semibold text-stone-700">100% Guaranteed</span>
              </div>
            </div>

            <Link
              href="/shops"
              className="inline-flex items-center gap-1.5 text-xs text-[#826229] font-semibold hover:underline"
            >
              <span>Explore Verified Artisan Houses</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
