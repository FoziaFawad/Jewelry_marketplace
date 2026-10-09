"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  Store,
  Gem,
  DollarSign,
  Percent,
  Search,
  ExternalLink,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Plus,
  ArrowRight,
  TrendingUp,
  Activity,
  SlidersHorizontal,
  X,
  UserPlus,
} from "lucide-react";

interface AdminStats {
  users: {
    total: number;
    admins: number;
    vendors: number;
    buyers: number;
  };
  shops: {
    total: number;
    active: number;
    pending: number;
    suspended: number;
  };
  products: {
    total: number;
    active: number;
    banned: number;
  };
  financials: {
    totalOrders: number;
    grossVolume: number;
    platformCommission: number;
  };
  recentUsers: any[];
  recentProducts: any[];
  recentShops: any[];
}

export default function MainAdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "users" | "shops">("overview");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Products Tab State
  const [products, setProducts] = useState<any[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [productStatusFilter, setProductStatusFilter] = useState("ALL");
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [editProductForm, setEditProductForm] = useState<any>({});
  const [banningProduct, setBanningProduct] = useState<any | null>(null);
  const [banReason, setBanReason] = useState("");
  const [processingBan, setProcessingBan] = useState(false);

  // Users Tab State
  const [users, setUsers] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  // Shops Tab State
  const [shops, setShops] = useState<any[]>([]);

  // Initial Load
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, productsRes, usersRes, shopsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/products"),
        fetch("/api/admin/users"),
        fetch("/api/shops"),
      ]);

      const [statsData, productsData, usersData, shopsData] = await Promise.all([
        statsRes.json(),
        productsRes.json(),
        usersRes.json(),
        shopsRes.json(),
      ]);

      if (statsData.success) setStats(statsData.data);
      if (productsData.success) setProducts(productsData.data || []);
      if (usersData.success) setUsers(usersData.data || []);
      if (shopsData.success) setShops(shopsData.data || []);
    } catch {
      setFeedback({ type: "error", message: "Network error loading dashboard telemetry" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Fast Ban Toggle
  const handleBanToggle = async (p: any) => {
    if (!p.isBanned) {
      setBanningProduct(p);
      setBanReason("Administrative policy or verification violation");
    } else {
      try {
        const res = await fetch(`/api/admin/products/${p.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isBanned: false }),
        });
        const data = await res.json();
        if (data.success) {
          setProducts((prev) =>
            prev.map((item) => (item.id === p.id ? { ...item, isBanned: false, banReason: null } : item))
          );
          setFeedback({ type: "success", message: `"${p.title}" unbanned and restored to marketplace.` });
          if (stats) {
            setStats({
              ...stats,
              products: {
                ...stats.products,
                active: stats.products.active + 1,
                banned: Math.max(0, stats.products.banned - 1),
              },
            });
          }
        }
      } catch {
        setFeedback({ type: "error", message: "Error unbanning product" });
      }
    }
  };

  // Confirm Ban Action
  const confirmBanProduct = async () => {
    if (!banningProduct) return;
    try {
      setProcessingBan(true);
      const res = await fetch(`/api/admin/products/${banningProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isBanned: true,
          banReason: banReason.trim() || "Administrative suspension",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((item) =>
            item.id === banningProduct.id
              ? { ...item, isBanned: true, banReason: banReason.trim() }
              : item
          )
        );
        setFeedback({
          type: "success",
          message: `"${banningProduct.title}" banned and removed from buyer catalog.`,
        });
        setBanningProduct(null);
        if (stats) {
          setStats({
            ...stats,
            products: {
              ...stats.products,
              active: Math.max(0, stats.products.active - 1),
              banned: stats.products.banned + 1,
            },
          });
        }
      }
    } catch {
      setFeedback({ type: "error", message: "Error banning product" });
    } finally {
      setProcessingBan(false);
    }
  };

  // Open Edit Product Modal
  const openEditProduct = (p: any) => {
    setEditingProduct(p);
    setEditProductForm({
      title: p.title,
      price: p.price.toString(),
      stock: (p.stock ?? 1).toString(),
      category: p.category || "Rings",
      metalType: p.metalType || "Yellow Gold",
      metalPurity: p.metalPurity || "18K",
      gemstoneType: p.gemstoneType || "None",
      caratWeight: p.caratWeight ? p.caratWeight.toString() : "",
      certifiedBy: p.certifiedBy || "",
      description: p.description || "",
      images: Array.isArray(p.images) ? p.images.join("\n") : "",
      isBanned: p.isBanned || false,
      banReason: p.banReason || "",
    });
  };

  // Save Edit Product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      setSavingProduct(true);
      const imageList = editProductForm.images
        .split("\n")
        .map((u: string) => u.trim())
        .filter((u: string) => u.length > 0);

      const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editProductForm.title,
          price: parseFloat(editProductForm.price),
          stock: parseInt(editProductForm.stock, 10),
          category: editProductForm.category,
          metalType: editProductForm.metalType,
          metalPurity: editProductForm.metalPurity || null,
          gemstoneType: editProductForm.gemstoneType === "None" ? null : editProductForm.gemstoneType,
          caratWeight: editProductForm.caratWeight ? parseFloat(editProductForm.caratWeight) : null,
          certifiedBy: editProductForm.certifiedBy || null,
          description: editProductForm.description,
          images: imageList.length > 0 ? imageList : editingProduct.images,
          isBanned: editProductForm.isBanned,
          banReason: editProductForm.isBanned ? editProductForm.banReason : null,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? data.data : p))
        );
        setFeedback({ type: "success", message: `Updated piece "${editProductForm.title}".` });
        setEditingProduct(null);
      } else {
        setFeedback({ type: "error", message: data.error || "Failed to update piece." });
      }
    } catch {
      setFeedback({ type: "error", message: "Network error saving product." });
    } finally {
      setSavingProduct(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string, title: string) => {
    if (!confirm(`Permanently delete "${title}" from the database?`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setFeedback({ type: "success", message: `"${title}" deleted successfully.` });
        if (stats) {
          setStats({
            ...stats,
            products: {
              ...stats.products,
              total: Math.max(0, stats.products.total - 1),
            },
          });
        }
      }
    } catch {
      setFeedback({ type: "error", message: "Error deleting piece." });
    }
  };

  // Change User Role
  const handleRoleChange = async (userId: string, newRole: "BUYER" | "VENDOR" | "ADMIN", email: string) => {
    try {
      setUpdatingUserId(userId);
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        setFeedback({
          type: "success",
          message: `Role power updated: ${email} is now ${newRole}!`,
        });
      } else {
        setFeedback({ type: "error", message: data.error || "Failed to change user role." });
      }
    } catch {
      setFeedback({ type: "error", message: "Error updating role." });
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Toggle Shop Status
  const handleShopStatusToggle = async (shopId: string, nextStatus: "ACTIVE" | "SUSPENDED") => {
    try {
      const res = await fetch(`/api/shops/${shopId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setShops((prev) =>
          prev.map((s) => (s.id === shopId ? { ...s, status: nextStatus } : s))
        );
        setFeedback({ type: "success", message: `Boutique atelier status updated to ${nextStatus}.` });
      }
    } catch {
      setFeedback({ type: "error", message: "Error updating boutique status." });
    }
  };

  // Filtered lists
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !productSearch.trim() ||
      p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.shop?.name?.toLowerCase().includes(productSearch.toLowerCase());

    const matchesStatus =
      productStatusFilter === "ALL" ||
      (productStatusFilter === "ACTIVE" && !p.isBanned) ||
      (productStatusFilter === "BANNED" && p.isBanned);

    return matchesSearch && matchesStatus;
  });

  const filteredUsers = users.filter((u) => {
    return (
      !userSearch.trim() ||
      (u.name && u.name.toLowerCase().includes(userSearch.toLowerCase())) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
    );
  });

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#ede5dc]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
              Master Admin Command Center
            </h1>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#b48c48] text-white font-bold tracking-wider uppercase shadow-2xs">
              Live Governance
            </span>
          </div>
          <p className="text-xs text-[#78716c] mt-1">
            Authenticated as <strong className="text-stone-900">muhammadsohaib.19477@gmail.com</strong>. Full authority over users, roles, boutique shops, and jewelry moderation.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchDashboardData}
            className="px-3.5 py-2 rounded-full bg-white hover:bg-[#f5f0ea] border border-[#ede5dc] text-xs font-semibold text-stone-700 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync DB Telemetry</span>
          </button>

          <Link
            href="/admin/products"
            className="gold-btn px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
          >
            <Gem className="w-3.5 h-3.5" />
            <span>Moderate All Products</span>
          </Link>
        </div>
      </div>

      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-3 shadow-xs ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-stone-400 hover:text-stone-600 font-bold">
            ×
          </button>
        </div>
      )}

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Volume */}
        <div className="p-5 rounded-2xl bg-white border border-[#ede5dc] shadow-xs text-xs space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-[#78716c]">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Gross Marketplace GMV</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <span className="text-2xl font-serif font-bold text-stone-900 block pt-1">
            {formatCurrency(stats?.financials?.grossVolume ?? 2455000)}
          </span>
          <div className="flex items-center gap-1.5 text-[11px] text-[#8a6828] font-semibold pt-1">
            <Percent className="w-3 h-3 text-[#b48c48]" />
            <span>Platform Take (10%): {formatCurrency(stats?.financials?.platformCommission ?? 245500)}</span>
          </div>
        </div>

        {/* Jewelry Inventory & Bans */}
        <div className="p-5 rounded-2xl bg-white border border-[#ede5dc] shadow-xs text-xs space-y-1">
          <div className="flex items-center justify-between text-[#78716c]">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Jewelry Pieces</span>
            <div className="w-8 h-8 rounded-full bg-[#faf5ed] flex items-center justify-center border border-[#ecd8b0]">
              <Gem className="w-4 h-4 text-[#b48c48]" />
            </div>
          </div>
          <span className="text-2xl font-serif font-bold text-stone-900 block pt-1">
            {stats?.products?.total ?? products.length} Total Pieces
          </span>
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-emerald-700 font-semibold">{stats?.products?.active ?? 0} Live & Active</span>
            <span className="text-rose-600 font-semibold">{stats?.products?.banned ?? 0} Banned / Hidden</span>
          </div>
        </div>

        {/* Boutiques & Shops */}
        <div className="p-5 rounded-2xl bg-white border border-[#ede5dc] shadow-xs text-xs space-y-1">
          <div className="flex items-center justify-between text-[#78716c]">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Artisan Boutiques</span>
            <div className="w-8 h-8 rounded-full bg-[#f5f0ea] flex items-center justify-center border border-[#ede5dc]">
              <Store className="w-4 h-4 text-[#8a6828]" />
            </div>
          </div>
          <span className="text-2xl font-serif font-bold text-stone-900 block pt-1">
            {stats?.shops?.total ?? shops.length} Ateliers
          </span>
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-emerald-700 font-semibold">{stats?.shops?.active ?? 0} Approved</span>
            <span className="text-amber-700 font-semibold">{stats?.shops?.pending ?? 0} Pending Review</span>
          </div>
        </div>

        {/* User Accounts & Admins */}
        <div className="p-5 rounded-2xl bg-white border border-[#ede5dc] shadow-xs text-xs space-y-1">
          <div className="flex items-center justify-between text-[#78716c]">
            <span className="font-semibold uppercase tracking-wider text-[10px]">User Accounts</span>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200">
              <Users className="w-4 h-4 text-slate-700" />
            </div>
          </div>
          <span className="text-2xl font-serif font-bold text-stone-900 block pt-1">
            {stats?.users?.total ?? users.length} Accounts
          </span>
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-[#8a6828] font-semibold">{stats?.users?.admins ?? 0} Admins</span>
            <span className="text-stone-500 font-semibold">{stats?.users?.vendors ?? 0} Sellers • {stats?.users?.buyers ?? 0} Buyers</span>
          </div>
        </div>
      </div>

      {/* Moderation Alert Banner (if pending shops or banned products exist) */}
      {(stats?.shops?.pending || 0) > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-amber-800">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-amber-950 block">
                {stats?.shops?.pending} Artisan Atelier{stats?.shops?.pending === 1 ? "" : "s"} Awaiting Verification
              </span>
              <span className="text-amber-800 text-[11px]">
                Review credentials and verify boutique ateliers to allow their fine jewelry catalog to go live.
              </span>
            </div>
          </div>
          <Link
            href="/admin/vendors"
            className="px-4 py-1.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs whitespace-nowrap shadow-xs"
          >
            Review Ateliers
          </Link>
        </div>
      )}

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#ede5dc] pb-2">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "overview"
              ? "bg-[#b48c48] text-white shadow-xs"
              : "text-stone-600 hover:text-stone-900 hover:bg-[#f5f0ea]"
          }`}
        >
          Command Center Overview
        </button>

        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "products"
              ? "bg-[#b48c48] text-white shadow-xs"
              : "text-stone-600 hover:text-stone-900 hover:bg-[#f5f0ea]"
          }`}
        >
          <Gem className="w-3.5 h-3.5" />
          <span>Manage All Products ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "users"
              ? "bg-[#b48c48] text-white shadow-xs"
              : "text-stone-600 hover:text-stone-900 hover:bg-[#f5f0ea]"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>User Role Governance ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("shops")}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "shops"
              ? "bg-[#b48c48] text-white shadow-xs"
              : "text-stone-600 hover:text-stone-900 hover:bg-[#f5f0ea]"
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>Boutiques & Ateliers ({shops.length})</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Products Moderation Desk */}
          <div className="p-6 rounded-3xl bg-white border border-[#ede5dc] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#ede5dc]">
              <div>
                <h3 className="text-base font-serif font-bold text-stone-900">
                  Recently Uploaded Jewelry
                </h3>
                <p className="text-xs text-stone-500">Live inventory added by seller accounts</p>
              </div>
              <Link
                href="/admin/products"
                className="text-xs font-semibold text-[#b48c48] hover:text-[#8a6828] flex items-center gap-1"
              >
                <span>View all ({products.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-[#ede5dc]">
              {products.slice(0, 5).map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.images?.[0] || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=100&q=80"}
                      alt={p.title}
                      className="w-10 h-10 rounded-xl object-cover border border-[#ede5dc] shrink-0"
                    />
                    <div className="max-w-[180px] sm:max-w-[240px]">
                      <span className="font-semibold text-stone-900 block truncate text-xs">{p.title}</span>
                      <span className="text-[10px] text-stone-500 block">
                        {p.shop?.name} • {formatCurrency(Number(p.price))}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {p.isBanned ? (
                      <Badge variant="ruby" className="text-[10px]">
                        Banned
                      </Badge>
                    ) : (
                      <Badge variant="success" className="text-[10px]">
                        Active
                      </Badge>
                    )}

                    <button
                      type="button"
                      onClick={() => handleBanToggle(p)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors cursor-pointer ${
                        p.isBanned
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-rose-50 text-rose-800 border border-rose-200"
                      }`}
                    >
                      {p.isBanned ? "Unban" : "Ban"}
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditProduct(p)}
                      className="p-1 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200 cursor-pointer"
                      title="Edit"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Role Power Desk */}
          <div className="p-6 rounded-3xl bg-white border border-[#ede5dc] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#ede5dc]">
              <div>
                <h3 className="text-base font-serif font-bold text-stone-900">
                  User Permissions & Elevate Roles
                </h3>
                <p className="text-xs text-stone-500">Promote any account to Admin, Vendor, or Buyer</p>
              </div>
              <Link
                href="/admin/users"
                className="text-xs font-semibold text-[#b48c48] hover:text-[#8a6828] flex items-center gap-1"
              >
                <span>All Users ({users.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-[#ede5dc]">
              {users.slice(0, 5).map((u) => {
                const isMaster = u.email.toLowerCase() === "muhammadsohaib.19477@gmail.com";
                return (
                  <div key={u.id} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-stone-900 text-xs">{u.name || "Collector"}</span>
                        {isMaster && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#b48c48] text-white font-bold">
                            ROOT ADMIN
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-stone-500 block font-mono">{u.email}</span>
                    </div>

                    <div>
                      {isMaster ? (
                        <Badge variant="gold" className="text-[10px] font-bold">
                          ROOT ADMIN
                        </Badge>
                      ) : (
                        <select
                          value={u.role}
                          onChange={(e) =>
                            handleRoleChange(
                              u.id,
                              e.target.value as "BUYER" | "VENDOR" | "ADMIN",
                              u.email
                            )
                          }
                          className="px-2.5 py-1 rounded-xl text-[11px] font-semibold border bg-white border-stone-200 focus:outline-hidden cursor-pointer"
                        >
                          <option value="BUYER">BUYER</option>
                          <option value="VENDOR">VENDOR</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ALL PRODUCTS MANAGEMENT */}
      {activeTab === "products" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-[#ede5dc] shadow-xs">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search products by title, category, atelier..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#faf8f5] border border-[#ede5dc] text-xs text-stone-900 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={productStatusFilter}
                onChange={(e) => setProductStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#ede5dc] text-xs text-stone-800 font-medium focus:outline-hidden"
              >
                <option value="ALL">All Statuses ({products.length})</option>
                <option value="ACTIVE">Active Only</option>
                <option value="BANNED">Banned Only</option>
              </select>

              <Link
                href="/dashboard/products/new"
                className="gold-btn px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap"
              >
                + New Product
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl bg-white border border-[#ede5dc] shadow-xs">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-[#faf8f5] uppercase tracking-wider text-[11px] text-stone-500 border-b border-[#ede5dc]">
                <tr>
                  <th className="py-3.5 px-4">Jewelry Creation</th>
                  <th className="py-3.5 px-4">Atelier Shop</th>
                  <th className="py-3.5 px-4">Specs & Category</th>
                  <th className="py-3.5 px-4">Price / Stock</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ede5dc] font-medium">
                {filteredProducts.map((p) => (
                  <tr
                    key={p.id}
                    className={`transition-colors ${
                      p.isBanned ? "bg-rose-50/30 hover:bg-rose-50/50" : "hover:bg-[#faf8f5]/60"
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0] || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=100&q=80"}
                          alt={p.title}
                          className="w-10 h-10 rounded-xl object-cover border border-[#ede5dc] shrink-0"
                        />
                        <div className="max-w-[200px]">
                          <span className="font-semibold text-stone-900 block truncate">{p.title}</span>
                          <span className="text-[10px] text-stone-400">/{p.slug}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-stone-800 block">{p.shop?.name}</span>
                      <span className="text-[10px] text-stone-400 block">{p.shop?.owner?.email}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant="gold" className="text-[10px] mb-0.5">
                        {p.category}
                      </Badge>
                      <span className="text-[11px] text-stone-600 block">
                        {p.metalType} {p.metalPurity ? `• ${p.metalPurity}` : ""}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-bold text-stone-900 block">{formatCurrency(Number(p.price))}</span>
                      <span className="text-[10px] text-stone-500">{p.stock} units</span>
                    </td>

                    <td className="py-3.5 px-4">
                      {p.isBanned ? (
                        <div>
                          <Badge variant="ruby" className="text-[10px]">
                            BANNED
                          </Badge>
                          {p.banReason && (
                            <span className="text-[10px] text-rose-700 block truncate max-w-[120px]">
                              {p.banReason}
                            </span>
                          )}
                        </div>
                      ) : (
                        <Badge variant="success" className="text-[10px]">
                          ACTIVE
                        </Badge>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/jewelry/${p.slug || p.id}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-[#faf8f5] text-stone-600 hover:text-stone-900 border border-[#ede5dc]"
                          title="View on Storefront"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => openEditProduct(p)}
                          className="p-1.5 rounded-lg bg-white hover:bg-stone-50 text-stone-600 border border-[#ede5dc] cursor-pointer"
                          title="Edit Piece"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleBanToggle(p)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors cursor-pointer ${
                            p.isBanned
                              ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-300"
                              : "bg-rose-50 text-rose-800 hover:bg-rose-100 border-rose-300"
                          }`}
                        >
                          {p.isBanned ? "Unban" : "Ban"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p.id, p.title)}
                          className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-stone-500 hover:text-rose-600 border border-[#ede5dc] cursor-pointer"
                          title="Delete Piece"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: USERS & ROLES */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-[#ede5dc] shadow-xs">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search users by name or email..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#faf8f5] border border-[#ede5dc] text-xs text-stone-900 focus:outline-hidden"
              />
            </div>
            <Link
              href="/admin/users"
              className="gold-btn px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap"
            >
              Advanced Users Desk
            </Link>
          </div>

          <div className="overflow-x-auto rounded-2xl bg-white border border-[#ede5dc] shadow-xs">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-[#faf8f5] uppercase tracking-wider text-[11px] text-stone-500 border-b border-[#ede5dc]">
                <tr>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Power to Elevate Role</th>
                  <th className="py-3.5 px-4">Associated Atelier</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ede5dc] font-medium">
                {filteredUsers.map((u) => {
                  const isMaster = u.email.toLowerCase() === "muhammadsohaib.19477@gmail.com";
                  return (
                    <tr key={u.id} className="hover:bg-[#faf8f5]/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-stone-900 block">{u.name || "Collector"}</span>
                        <span className="text-[10px] text-stone-500 font-mono">{u.email}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        {isMaster ? (
                          <Badge variant="gold" className="text-[10px] font-bold">
                            ROOT ADMIN
                          </Badge>
                        ) : (
                          <select
                            value={u.role}
                            onChange={(e) =>
                              handleRoleChange(
                                u.id,
                                e.target.value as "BUYER" | "VENDOR" | "ADMIN",
                                u.email
                              )
                            }
                            className="px-3 py-1 rounded-xl text-xs font-semibold border bg-white border-stone-200 focus:outline-hidden cursor-pointer"
                          >
                            <option value="BUYER">BUYER</option>
                            <option value="VENDOR">VENDOR</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {u.shop ? (
                          <span className="font-medium text-stone-800">{u.shop.name}</span>
                        ) : (
                          <span className="text-stone-400 italic text-[11px]">None</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {u.isBanned ? (
                          <Badge variant="ruby" className="text-[10px]">
                            Suspended
                          </Badge>
                        ) : (
                          <Badge variant="success" className="text-[10px]">
                            Active
                          </Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: BOUTIQUES & SHOPS */}
      {activeTab === "shops" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-[#ede5dc] shadow-xs">
            <span className="text-xs font-semibold text-stone-700">
              Total Boutique Ateliers: {shops.length}
            </span>
            <Link
              href="/admin/vendors"
              className="gold-btn px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap"
            >
              Full Atelier Directory
            </Link>
          </div>

          <div className="overflow-x-auto rounded-2xl bg-white border border-[#ede5dc] shadow-xs">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-[#faf8f5] uppercase tracking-wider text-[11px] text-stone-500 border-b border-[#ede5dc]">
                <tr>
                  <th className="py-3.5 px-4">Atelier Name</th>
                  <th className="py-3.5 px-4">Artisan Owner</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ede5dc] font-medium">
                {shops.map((s) => (
                  <tr key={s.id} className="hover:bg-[#faf8f5]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-stone-900 block">{s.name}</span>
                      <span className="text-[10px] text-stone-400">/{s.slug}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-stone-800">{s.owner?.name || "Master Artisan"}</span>
                      <span className="text-[10px] text-stone-400 block">{s.owner?.email || "—"}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      {s.status === "ACTIVE" ? (
                        <Badge variant="success" className="text-[10px]">
                          Active
                        </Badge>
                      ) : s.status === "PENDING_VERIFICATION" ? (
                        <Badge variant="warning" className="text-[10px]">
                          Pending Review
                        </Badge>
                      ) : (
                        <Badge variant="ruby" className="text-[10px]">
                          Suspended
                        </Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {s.status !== "ACTIVE" && (
                          <button
                            type="button"
                            onClick={() => handleShopStatusToggle(s.id, "ACTIVE")}
                            className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-[11px] font-semibold cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                        {s.status === "ACTIVE" && (
                          <button
                            type="button"
                            onClick={() => handleShopStatusToggle(s.id, "SUSPENDED")}
                            className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-[11px] font-semibold cursor-pointer"
                          >
                            Suspend
                          </button>
                        )}
                        <Link
                          href={`/shops/${s.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-[#faf8f5] text-stone-600 border border-[#ede5dc]"
                          title="View Storefront"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#ede5dc] max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#ede5dc]">
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  Edit Fine Jewelry Creation
                </h3>
                <p className="text-xs text-stone-500">
                  Shop Atelier: <strong className="text-stone-800">{editingProduct.shop?.name}</strong>
                </p>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Jewelry Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editProductForm.title}
                    onChange={(e) => setEditProductForm({ ...editProductForm, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ede5dc] text-xs bg-[#faf8f5] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Price (PKR / USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editProductForm.price}
                    onChange={(e) => setEditProductForm({ ...editProductForm, price: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ede5dc] text-xs bg-[#faf8f5] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Available Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editProductForm.stock}
                    onChange={(e) => setEditProductForm({ ...editProductForm, stock: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ede5dc] text-xs bg-[#faf8f5] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Category
                  </label>
                  <select
                    value={editProductForm.category}
                    onChange={(e) => setEditProductForm({ ...editProductForm, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ede5dc] text-xs bg-[#faf8f5] focus:outline-hidden"
                  >
                    <option value="Rings">Rings</option>
                    <option value="Necklaces">Necklaces</option>
                    <option value="Earrings">Earrings</option>
                    <option value="Bracelets">Bracelets</option>
                    <option value="Pendants">Pendants</option>
                    <option value="High Jewelry">High Jewelry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Metal Type
                  </label>
                  <select
                    value={editProductForm.metalType}
                    onChange={(e) => setEditProductForm({ ...editProductForm, metalType: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ede5dc] text-xs bg-[#faf8f5] focus:outline-hidden"
                  >
                    <option value="Yellow Gold">Yellow Gold</option>
                    <option value="White Gold">White Gold</option>
                    <option value="Rose Gold">Rose Gold</option>
                    <option value="Platinum">Platinum</option>
                    <option value="Sterling Silver">Sterling Silver</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={editProductForm.description}
                    onChange={(e) => setEditProductForm({ ...editProductForm, description: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ede5dc] text-xs bg-[#faf8f5] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#ede5dc]">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-full border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProduct}
                  className="gold-btn px-6 py-2 rounded-full text-xs font-semibold shadow-xs cursor-pointer"
                >
                  {savingProduct ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ban Reason Dialog */}
      {banningProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-rose-200 max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-stone-900">
                  Ban & Delist Product
                </h3>
                <p className="text-xs text-stone-500">{banningProduct.title}</p>
              </div>
            </div>

            <p className="text-xs text-stone-600">
              This product will be immediately delisted and hidden from buyer searches, category views, and the boutique storefront.
            </p>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Reason for Ban / Delisting:
              </label>
              <textarea
                rows={3}
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Reason for suspension..."
                className="w-full px-3 py-2 rounded-xl border border-rose-200 bg-rose-50/30 text-xs text-stone-900 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setBanningProduct(null)}
                className="px-4 py-2 rounded-full border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={processingBan}
                onClick={confirmBanProduct}
                className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                {processingBan ? "Delisting..." : "Confirm & Ban"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
