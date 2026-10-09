"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Trash2, ExternalLink, AlertCircle, CheckCircle2, Store, RefreshCw } from "lucide-react";

interface Shop {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  status: "ACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED";
  stripeAccountId: string | null;
  owner?: {
    id: string;
    name: string | null;
    email: string;
  };
  _count?: {
    products: number;
  };
}

export default function AdminVendorsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/shops");
      const data = await res.json();
      if (data.success) {
        setShops(data.data || []);
      }
    } catch {
      setFeedback({ type: "error", message: "Failed to load boutique shops from database." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const toggleStatus = async (id: string, newStatus: "ACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED") => {
    try {
      const res = await fetch(`/api/shops/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setShops((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
        );
        setFeedback({ type: "success", message: `Shop status updated to ${newStatus}.` });
      }
    } catch {
      setFeedback({ type: "error", message: "Failed to update shop status." });
    }
  };

  const handleDeleteShop = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}" and all of its inventory?`)) {
      return;
    }

    try {
      setDeletingId(id);
      const res = await fetch(`/api/shops/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: "success", message: `Boutique "${name}" deleted from database.` });
        setShops((prev) => prev.filter((s) => s.id !== id));
      } else {
        setFeedback({ type: "error", message: data.error || "Failed to delete shop." });
      }
    } catch {
      setFeedback({ type: "error", message: "Error deleting shop." });
    } finally {
      setDeletingId(null);
    }
  };

  const handlePurgeMockData = async () => {
    if (!confirm("This will permanently delete all mock shops and mock products from Neon database. Do you wish to proceed?")) {
      return;
    }

    try {
      const res = await fetch("/api/admin/clear-mock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "mock_only" }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: "success", message: data.message });
        fetchShops();
      } else {
        setFeedback({ type: "error", message: data.error || "Failed to purge mock data." });
      }
    } catch {
      setFeedback({ type: "error", message: "Network error purging mock data." });
    }
  };

  const activeCount = shops.filter((s) => s.status === "ACTIVE").length;
  const pendingCount = shops.filter((s) => s.status === "PENDING_VERIFICATION").length;
  const suspendedCount = shops.filter((s) => s.status === "SUSPENDED").length;

  const hasMockShops = shops.some((s) =>
    ["shop_aurora_01", "shop_valerio_02", "shop_celestial_03", "shop_solitaire_04"].includes(s.id)
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ede5dc]">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            Seller Approvals & Boutique Management
          </h1>
          <p className="text-xs text-[#78716c] mt-1">
            Review live seller ateliers, manage approval statuses, or delete unwanted mock and inactive shops.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {hasMockShops && (
            <button
              onClick={handlePurgeMockData}
              className="px-4 py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete All Mock Shops & Products</span>
            </button>
          )}

          <Link
            href="/shops/new"
            className="gold-btn px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Create New Boutique</span>
          </Link>
        </div>
      </div>

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
          <button onClick={() => setFeedback(null)} className="text-stone-400 hover:text-stone-600">
            ×
          </button>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#ede5dc] shadow-xs text-xs">
          <span className="text-[#78716c] block">Active Ateliers</span>
          <span className="text-2xl font-serif font-bold text-emerald-700 mt-1 block">
            {activeCount} Active
          </span>
          <span className="text-[11px] text-[#a8a29e]">Currently selling on marketplace</span>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-[#ede5dc] shadow-xs text-xs">
          <span className="text-[#78716c] block">Pending Review</span>
          <span className="text-2xl font-serif font-bold text-[#b48c48] mt-1 block">
            {pendingCount} Pending
          </span>
          <span className="text-[11px] text-[#a8a29e]">Awaiting verification approval</span>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-[#ede5dc] shadow-xs text-xs">
          <span className="text-[#78716c] block">Suspended Boutiques</span>
          <span className="text-2xl font-serif font-bold text-stone-400 mt-1 block">
            {suspendedCount} Suspended
          </span>
          <span className="text-[11px] text-[#a8a29e]">Temporarily deactivated</span>
        </div>
      </div>

      {/* Vendors Table */}
      {loading ? (
        <div className="p-12 text-center text-xs text-stone-500">
          Loading boutique ateliers from database...
        </div>
      ) : shops.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-[#ede5dc] text-center space-y-3">
          <Store className="w-8 h-8 text-stone-400 mx-auto" />
          <h3 className="text-sm font-serif font-medium text-stone-900">No boutiques found</h3>
          <p className="text-xs text-stone-500">All shops have been deleted. You can create your own boutique atelier now.</p>
          <Link
            href="/shops/new"
            className="gold-btn px-4 py-2 rounded-full text-xs font-medium inline-flex items-center gap-1.5 mt-2"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Create Boutique</span>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white border border-[#ede5dc] shadow-xs">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-[#faf8f5] uppercase tracking-wider text-[11px] text-stone-500 border-b border-[#ede5dc]">
              <tr>
                <th className="py-3.5 px-4">Shop Name</th>
                <th className="py-3.5 px-4">Owner / Contact</th>
                <th className="py-3.5 px-4">Inventory</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ede5dc] font-medium">
              {shops.map((s) => (
                <tr key={s.id} className="hover:bg-[#faf8f5]/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={s.logoUrl || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=100&q=80"}
                        alt={s.name}
                        className="w-9 h-9 rounded-lg object-cover border border-[#ede5dc] shrink-0"
                      />
                      <div>
                        <span className="font-semibold text-stone-900 block">{s.name}</span>
                        <span className="text-[10px] text-[#78716c]">/{s.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-stone-700">
                    <span>{s.owner?.name || "Master Artisan"}</span>
                    <span className="text-[10px] text-[#a8a29e] block">{s.owner?.email || "—"}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#faf5ed] border border-[#ecd8b0] text-[10px] text-[#826229] font-medium">
                      {s._count?.products ?? 0} creations
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {s.status === "ACTIVE" ? (
                      <Badge variant="success" className="text-[10px]">
                        Verified Active
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
                      <Link
                        href={`/shops/${s.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg bg-[#faf8f5] hover:text-[#9c7936] text-stone-600 transition-colors border border-[#e8ded4]"
                        title="View Storefront"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      {s.status !== "ACTIVE" && (
                        <button
                          type="button"
                          onClick={() => toggleStatus(s.id, "ACTIVE")}
                          className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          Approve
                        </button>
                      )}
                      {s.status === "ACTIVE" && (
                        <button
                          type="button"
                          onClick={() => toggleStatus(s.id, "SUSPENDED")}
                          className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300 text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          Suspend
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={deletingId === s.id}
                        onClick={() => handleDeleteShop(s.id, s.name)}
                        className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-stone-500 hover:text-rose-600 transition-colors border border-[#e8ded4] hover:border-rose-200 cursor-pointer"
                        title="Delete Boutique"
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
      )}
    </div>
  );
}
