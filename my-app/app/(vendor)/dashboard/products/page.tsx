"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { formatCurrency, formatCarat } from "@/lib/utils";
import { MetalBadge } from "@/components/jewelry/MetalBadge";
import { PlusCircle, Edit3, Eye, Trash2, AlertCircle, CheckCircle2, Sparkles, Filter } from "lucide-react";

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  category: string;
  metalType: string;
  metalPurity: string | null;
  gemstoneType: string | null;
  caratWeight: number | null;
  certifiedBy: string | null;
  shopId: string;
  shop?: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function VendorProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("All");

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products?limit=200");
      const data = await res.json();
      if (data.success) {
        setProducts(data.data || []);
      }
    } catch {
      setFeedback({ type: "error", message: "Failed to load products from database." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      return;
    }

    try {
      setDeletingId(id);
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: "success", message: `"${title}" has been deleted from catalog.` });
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        setFeedback({ type: "error", message: data.error || "Failed to delete product." });
      }
    } catch {
      setFeedback({ type: "error", message: "Error deleting product." });
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearMockData = async () => {
    if (!confirm("This will delete all original seed mock products and mock shops from your database. Are you sure?")) {
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
        loadProducts();
      } else {
        setFeedback({ type: "error", message: data.error || "Failed to clear mock data." });
      }
    } catch {
      setFeedback({ type: "error", message: "Error clearing mock data." });
    }
  };

  const hasMockData = products.some((p) =>
    ["prod_01", "prod_02", "prod_03", "prod_04", "prod_05", "prod_06"].includes(p.id) ||
    p.shopId.startsWith("shop_")
  );

  const filteredProducts = categoryFilter === "All"
    ? products
    : products.filter((p) => p.category.toLowerCase() === categoryFilter.toLowerCase());

  const categories = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ede5dc]">
        <div>
          <h1 className="text-2xl font-serif font-normal text-stone-900">
            Fine Jewelry Inventory
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage your atelier catalog, metal hallmarks, carat specifications, and certifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasMockData && (
            <button
              onClick={handleClearMockData}
              className="px-4 py-2.5 rounded-full text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors shadow-2xs cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 inline mr-1" />
              Purge Mock Items
            </button>
          )}

          <Link
            href="/dashboard/products/new"
            className="gold-btn px-5 py-2.5 rounded-full text-xs font-medium flex items-center gap-2 self-start sm:self-auto shadow-2xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Creation</span>
          </Link>
        </div>
      </div>

      {/* Alerts */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
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

      {/* Filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-[#ede5dc] shadow-2xs">
        <div className="flex items-center gap-2 text-xs text-stone-600 font-medium">
          <Filter className="w-3.5 h-3.5 text-[#9c7936]" />
          <span>Category Filter:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg bg-[#faf8f5] border border-[#ede5dc] px-2.5 py-1 text-xs text-stone-800 focus:outline-none"
          >
            <option value="All">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <span className="text-[11px] text-stone-500">
          Showing <strong>{filteredProducts.length}</strong> creations
        </span>
      </div>

      {/* Inventory Table */}
      {loading ? (
        <div className="p-12 text-center text-xs text-stone-500">
          Loading fine jewelry pieces from Neon database...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-[#ede5dc] text-center space-y-3">
          <Sparkles className="w-8 h-8 text-[#9c7936] mx-auto" />
          <h3 className="text-sm font-serif font-medium text-stone-900">No creations found</h3>
          <p className="text-xs text-stone-500">
            {categoryFilter !== "All"
              ? "No jewelry matches the selected category filter."
              : "Your inventory is currently empty. Upload your first fine jewelry piece."}
          </p>
          <Link
            href="/dashboard/products/new"
            className="gold-btn px-4 py-2 rounded-full text-xs font-medium inline-flex items-center gap-2 mt-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Creation</span>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl bg-white border border-[#ede5dc] shadow-2xs">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-[#faf8f5] uppercase tracking-wider text-[11px] text-stone-500 border-b border-[#ede5dc]">
              <tr>
                <th className="py-4 px-5">Creation / Spec</th>
                <th className="py-4 px-5">Category</th>
                <th className="py-4 px-5">Metal & Hallmark</th>
                <th className="py-4 px-5">Gemstone / Carat</th>
                <th className="py-4 px-5">Price</th>
                <th className="py-4 px-5">In Stock</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ede5dc] font-medium">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-[#faf8f5]/60 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images[0] || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=150&q=80"}
                        alt={p.title}
                        className="w-10 h-10 rounded-xl object-cover border border-[#e8ded4] shrink-0"
                      />
                      <div>
                        <span className="font-serif font-medium text-stone-900 block max-w-xs truncate">
                          {p.title}
                        </span>
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="text-[#826229]">
                            {p.certifiedBy && p.certifiedBy !== "None"
                              ? `${p.certifiedBy} Certified`
                              : "Atelier Hallmarked"}
                          </span>
                          {p.shop && (
                            <span className="text-stone-400">• {p.shop.name}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5 whitespace-nowrap text-stone-600">
                    {p.category}
                  </td>
                  <td className="py-4 px-5 whitespace-nowrap">
                    <MetalBadge metalType={p.metalType} purity={p.metalPurity || undefined} />
                  </td>
                  <td className="py-4 px-5 whitespace-nowrap">
                    <span className="text-stone-800">{p.gemstoneType || "None"}</span>
                    {p.caratWeight && (
                      <span className="text-[11px] text-[#826229] block">
                        {formatCarat(p.caratWeight)}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-5 whitespace-nowrap font-semibold text-stone-900">
                    {formatCurrency(p.price)}
                  </td>
                  <td className="py-4 px-5 whitespace-nowrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#faf6f0] border border-[#e8ded4] text-[10px] text-stone-700">
                      {p.stock} units
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/jewelry/${p.id}`}
                        target="_blank"
                        className="p-1.5 rounded-lg bg-[#faf6f0] hover:text-[#9c7936] text-stone-600 transition-colors border border-[#e8ded4]"
                        title="View on Storefront"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/dashboard/products/${p.id}/edit`}
                        className="p-1.5 rounded-lg bg-[#faf6f0] hover:text-stone-950 text-stone-600 transition-colors border border-[#e8ded4]"
                        title="Edit Piece"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        type="button"
                        disabled={deletingId === p.id}
                        onClick={() => handleDelete(p.id, p.title)}
                        className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-stone-500 hover:text-rose-600 transition-colors border border-[#e8ded4] hover:border-rose-200 cursor-pointer"
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
      )}
    </div>
  );
}
