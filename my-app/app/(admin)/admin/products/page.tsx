"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import {
  Gem,
  Search,
  Filter,
  ShieldAlert,
  ShieldCheck,
  Edit3,
  Trash2,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  X,
  Store,
  RefreshCw,
  Plus,
  Eye,
  SlidersHorizontal,
} from "lucide-react";

interface AdminProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number | string;
  stock: number;
  images: string[];
  category: string;
  metalType: string;
  metalPurity: string | null;
  gemstoneType: string | null;
  caratWeight: number | null;
  certifiedBy: string | null;
  isBanned: boolean;
  banReason: string | null;
  createdAt: string;
  shop: {
    id: string;
    name: string;
    slug: string;
    status: string;
    logoUrl: string | null;
    owner?: {
      id: string;
      name: string | null;
      email: string;
    };
  };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "BANNED">("ALL");
  const [shopFilter, setShopFilter] = useState("ALL");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    price: "",
    stock: "1",
    category: "Rings",
    metalType: "Yellow Gold",
    metalPurity: "18K",
    gemstoneType: "Diamond",
    caratWeight: "",
    certifiedBy: "",
    images: "",
    description: "",
    isBanned: false,
    banReason: "",
  });

  // Ban Modal State
  const [banningProduct, setBanningProduct] = useState<AdminProduct | null>(null);
  const [customBanReason, setCustomBanReason] = useState("");
  const [processingBan, setProcessingBan] = useState(false);

  // Delete State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (categoryFilter !== "ALL") params.set("category", categoryFilter);
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (shopFilter !== "ALL") params.set("shopId", shopFilter);

      const res = await fetch(`/api/admin/products?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data || []);
      } else {
        setFeedback({ type: "error", message: data.error || "Failed to load products" });
      }
    } catch {
      setFeedback({ type: "error", message: "Network error loading marketplace inventory" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter, statusFilter, shopFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  // Open Edit Modal
  const openEditModal = (p: AdminProduct) => {
    setEditingProduct(p);
    setEditForm({
      title: p.title,
      price: p.price.toString(),
      stock: (p.stock ?? 1).toString(),
      category: p.category || "Rings",
      metalType: p.metalType || "Yellow Gold",
      metalPurity: p.metalPurity || "18K",
      gemstoneType: p.gemstoneType || "None",
      caratWeight: p.caratWeight ? p.caratWeight.toString() : "",
      certifiedBy: p.certifiedBy || "",
      images: Array.isArray(p.images) ? p.images.join("\n") : "",
      description: p.description || "",
      isBanned: p.isBanned || false,
      banReason: p.banReason || "",
    });
  };

  // Submit Edit Form
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      setSavingEdit(true);
      const imageList = editForm.images
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => url.length > 0);

      const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editForm.title,
          price: parseFloat(editForm.price),
          stock: parseInt(editForm.stock, 10),
          category: editForm.category,
          metalType: editForm.metalType,
          metalPurity: editForm.metalPurity || null,
          gemstoneType: editForm.gemstoneType === "None" ? null : editForm.gemstoneType,
          caratWeight: editForm.caratWeight ? parseFloat(editForm.caratWeight) : null,
          certifiedBy: editForm.certifiedBy || null,
          description: editForm.description,
          images: imageList.length > 0 ? imageList : editingProduct.images,
          isBanned: editForm.isBanned,
          banReason: editForm.isBanned ? (editForm.banReason || "Administrative governance suspension") : null,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedback({ type: "success", message: `Piece "${editForm.title}" updated successfully.` });
        setEditingProduct(null);
        fetchProducts();
      } else {
        setFeedback({ type: "error", message: data.error || "Failed to update piece." });
      }
    } catch {
      setFeedback({ type: "error", message: "Network error saving edits." });
    } finally {
      setSavingEdit(false);
    }
  };

  // Toggle Ban Handler
  const handleBanToggle = async (p: AdminProduct) => {
    if (!p.isBanned) {
      // Prompt for ban reason
      setBanningProduct(p);
      setCustomBanReason("Policy violation or quality assurance review");
    } else {
      // Unban directly
      try {
        const res = await fetch(`/api/admin/products/${p.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isBanned: false }),
        });
        const data = await res.json();
        if (data.success) {
          setFeedback({ type: "success", message: `"${p.title}" unbanned and restored to storefront.` });
          setProducts((prev) =>
            prev.map((item) => (item.id === p.id ? { ...item, isBanned: false, banReason: null } : item))
          );
        } else {
          setFeedback({ type: "error", message: data.error || "Failed to unban item." });
        }
      } catch {
        setFeedback({ type: "error", message: "Error unbanning product." });
      }
    }
  };

  // Confirm Ban Action
  const confirmBanAction = async () => {
    if (!banningProduct) return;
    try {
      setProcessingBan(true);
      const res = await fetch(`/api/admin/products/${banningProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isBanned: true,
          banReason: customBanReason.trim() || "Policy violation or suspended by Governance",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({
          type: "success",
          message: `"${banningProduct.title}" has been BANNED and delisted from customer storefront.`,
        });
        setProducts((prev) =>
          prev.map((item) =>
            item.id === banningProduct.id
              ? { ...item, isBanned: true, banReason: customBanReason.trim() }
              : item
          )
        );
        setBanningProduct(null);
      } else {
        setFeedback({ type: "error", message: data.error || "Failed to ban product." });
      }
    } catch {
      setFeedback({ type: "error", message: "Error banning product." });
    } finally {
      setProcessingBan(false);
    }
  };

  // Delete Product Handler
  const handleDeleteProduct = async (id: string, title: string) => {
    if (!confirm(`Permanently delete "${title}" from the marketplace? This cannot be undone.`)) {
      return;
    }

    try {
      setDeletingId(id);
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: "success", message: `"${title}" was permanently removed from database.` });
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        setFeedback({ type: "error", message: data.error || "Failed to delete product." });
      }
    } catch {
      setFeedback({ type: "error", message: "Network error deleting product." });
    } finally {
      setDeletingId(null);
    }
  };

  // Extract unique shops for dropdown filter
  const uniqueShops = Array.from(
    new Map(products.map((p) => [p.shop.id, { id: p.shop.id, name: p.shop.name }])).values()
  );

  const totalCount = products.length;
  const bannedCount = products.filter((p) => p.isBanned).length;
  const activeCount = totalCount - bannedCount;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ede5dc]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-stone-900">
              Marketplace Jewelry Catalog & Moderation
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#b48c48]/15 text-[#8a6828] font-bold">
              All Sellers
            </span>
          </div>
          <p className="text-xs text-[#78716c] mt-1">
            Global oversight across all artisan ateliers. Edit details, remove counterfeit items, or ban products from customer view.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchProducts}
            className="p-2 rounded-full bg-white hover:bg-[#f5f0ea] border border-[#ede5dc] text-stone-600 transition-colors cursor-pointer shadow-2xs"
            title="Refresh Catalog"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            href="/dashboard/products/new"
            className="gold-btn px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Master Piece</span>
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

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#ede5dc] shadow-xs text-xs">
          <div className="flex items-center justify-between text-[#78716c]">
            <span>Total Jewelry Pieces</span>
            <Gem className="w-4 h-4 text-[#b48c48]" />
          </div>
          <span className="text-2xl font-serif font-bold text-stone-900 mt-2 block">
            {totalCount} Creations
          </span>
          <span className="text-[11px] text-[#a8a29e]">Across all registered sellers</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#ede5dc] shadow-xs text-xs">
          <div className="flex items-center justify-between text-[#78716c]">
            <span>Active on Storefront</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-serif font-bold text-emerald-700 mt-2 block">
            {activeCount} Live
          </span>
          <span className="text-[11px] text-[#a8a29e]">Purchasable by collectors</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#ede5dc] shadow-xs text-xs">
          <div className="flex items-center justify-between text-[#78716c]">
            <span>Banned & Delisted</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <span className="text-2xl font-serif font-bold text-rose-700 mt-2 block">
            {bannedCount} Suspended
          </span>
          <span className="text-[11px] text-[#a8a29e]">Hidden from marketplace</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-[#ede5dc] shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, atelier name, category, metal, gemstone, or seller email..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#faf8f5] border border-[#ede5dc] text-xs text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-[#b48c48] placeholder:text-stone-400"
            />
          </form>

          {/* Quick Status Buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#faf8f5] border border-[#ede5dc]">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === "ALL"
                  ? "bg-white text-stone-900 shadow-2xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setStatusFilter("ACTIVE")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === "ACTIVE"
                  ? "bg-emerald-50 text-emerald-800 shadow-2xs border border-emerald-200"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setStatusFilter("BANNED")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === "BANNED"
                  ? "bg-rose-50 text-rose-800 shadow-2xs border border-rose-200"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Banned ({bannedCount})
            </button>
          </div>
        </div>

        {/* Category & Atelier Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#ede5dc]/60">
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mr-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#faf8f5] border border-[#ede5dc] text-xs text-stone-800 font-medium focus:outline-hidden"
          >
            <option value="ALL">All Categories</option>
            <option value="Rings">Rings</option>
            <option value="Necklaces">Necklaces</option>
            <option value="Earrings">Earrings</option>
            <option value="Bracelets">Bracelets</option>
            <option value="Pendants">Pendants</option>
            <option value="High Jewelry">High Jewelry</option>
          </select>

          {uniqueShops.length > 0 && (
            <select
              value={shopFilter}
              onChange={(e) => setShopFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#faf8f5] border border-[#ede5dc] text-xs text-stone-800 font-medium focus:outline-hidden"
            >
              <option value="ALL">All Ateliers & Sellers</option>
              {uniqueShops.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          )}

          {(categoryFilter !== "ALL" || shopFilter !== "ALL" || search) && (
            <button
              onClick={() => {
                setCategoryFilter("ALL");
                setShopFilter("ALL");
                setSearch("");
                setStatusFilter("ALL");
              }}
              className="px-2.5 py-1 text-xs text-[#b48c48] hover:text-[#8a6828] font-semibold"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="p-16 text-center text-xs text-stone-500 bg-white rounded-2xl border border-[#ede5dc]">
          <RefreshCw className="w-6 h-6 animate-spin text-[#b48c48] mx-auto mb-2" />
          Loading marketplace inventory and moderation statuses...
        </div>
      ) : products.length === 0 ? (
        <div className="p-16 rounded-3xl bg-white border border-[#ede5dc] text-center space-y-3">
          <Gem className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="text-sm font-serif font-semibold text-stone-900">No jewelry items found</h3>
          <p className="text-xs text-stone-500">
            No products matched your current filters. Try adjusting search query or category.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white border border-[#ede5dc] shadow-xs">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-[#faf8f5] uppercase tracking-wider text-[11px] text-stone-500 border-b border-[#ede5dc]">
              <tr>
                <th className="py-3.5 px-4">Jewelry Piece</th>
                <th className="py-3.5 px-4">Atelier & Seller</th>
                <th className="py-3.5 px-4">Specifications</th>
                <th className="py-3.5 px-4">Price & Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ede5dc] font-medium">
              {products.map((p) => {
                const img =
                  p.images?.[0] ||
                  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=150&q=80";

                return (
                  <tr
                    key={p.id}
                    className={`transition-colors ${
                      p.isBanned ? "bg-rose-50/30 hover:bg-rose-50/50" : "hover:bg-[#faf8f5]/60"
                    }`}
                  >
                    {/* Title & Image */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={img}
                          alt={p.title}
                          className="w-12 h-12 rounded-xl object-cover border border-[#ede5dc] shrink-0 bg-[#faf8f5]"
                        />
                        <div className="max-w-[220px]">
                          <span className="font-semibold text-stone-900 block truncate" title={p.title}>
                            {p.title}
                          </span>
                          <span className="text-[10px] text-[#78716c]">
                            ID: {p.id.slice(0, 10)}...
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Shop & Seller */}
                    <td className="py-3.5 px-4">
                      <div>
                        <Link
                          href={`/shops/${p.shop?.slug}`}
                          target="_blank"
                          className="font-semibold text-stone-900 hover:text-[#b48c48] flex items-center gap-1 group"
                        >
                          <Store className="w-3 h-3 text-[#b48c48]" />
                          <span>{p.shop?.name}</span>
                        </Link>
                        <span className="text-[10px] text-[#a8a29e] block mt-0.5">
                          {p.shop?.owner?.email || "—"}
                        </span>
                      </div>
                    </td>

                    {/* Specifications */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="px-2 py-0.5 rounded-full bg-[#faf5ed] border border-[#ecd8b0] text-[10px] text-[#826229] font-medium inline-block">
                          {p.category}
                        </span>
                        <span className="text-[11px] text-stone-600 block">
                          {p.metalType} {p.metalPurity ? `• ${p.metalPurity}` : ""}
                        </span>
                        {p.gemstoneType && (
                          <span className="text-[10px] text-stone-400 block">
                            {p.gemstoneType} {p.caratWeight ? `(${p.caratWeight} ct)` : ""}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Price & Stock */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-bold text-stone-900 block">
                        {formatCurrency(Number(p.price))}
                      </span>
                      <span
                        className={`text-[10px] font-semibold ${
                          p.stock <= 0 ? "text-rose-600" : "text-[#78716c]"
                        }`}
                      >
                        {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {p.isBanned ? (
                        <div className="space-y-1">
                          <Badge variant="ruby" className="text-[10px] font-bold">
                            BANNED / DELISTED
                          </Badge>
                          {p.banReason && (
                            <span className="text-[10px] text-rose-700 block max-w-[150px] truncate" title={p.banReason}>
                              {p.banReason}
                            </span>
                          )}
                        </div>
                      ) : (
                        <Badge variant="success" className="text-[10px] font-bold">
                          LIVE & ACTIVE
                        </Badge>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View in Storefront */}
                        <Link
                          href={`/jewelry/${p.slug || p.id}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-[#faf8f5] hover:text-[#9c7936] text-stone-600 transition-colors border border-[#e8ded4]"
                          title="View on Customer Storefront"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg bg-white hover:bg-[#faf5ed] text-stone-700 hover:text-[#b48c48] transition-colors border border-[#e8ded4] cursor-pointer"
                          title="Edit Details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Ban / Unban Button */}
                        {p.isBanned ? (
                          <button
                            type="button"
                            onClick={() => handleBanToggle(p)}
                            className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1"
                            title="Restore piece to marketplace"
                          >
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>Unban</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleBanToggle(p)}
                            className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-300 text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1"
                            title="Ban and hide piece from store"
                          >
                            <ShieldAlert className="w-3 h-3 text-rose-600" />
                            <span>Ban</span>
                          </button>
                        )}

                        {/* Delete Button */}
                        <button
                          type="button"
                          disabled={deletingId === p.id}
                          onClick={() => handleDeleteProduct(p.id, p.title)}
                          className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-stone-500 hover:text-rose-600 transition-colors border border-[#e8ded4] hover:border-rose-200 cursor-pointer"
                          title="Permanently Delete Piece"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
                  Belongs to atelier: <span className="font-semibold text-stone-800">{editingProduct.shop?.name}</span>
                </p>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Jewelry Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ede5dc] text-xs bg-[#faf8f5] focus:ring-1 focus:ring-[#b48c48] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Price (USD / PKR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ede5dc] text-xs bg-[#faf8f5] focus:ring-1 focus:ring-[#b48c48] focus:outline-hidden"
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
                    value={editForm.stock}
                    onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ede5dc] text-xs bg-[#faf8f5] focus:ring-1 focus:ring-[#b48c48] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Category
                  </label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ede5dc] text-xs bg-[#faf8f5] focus:ring-1 focus:ring-[#b48c48] focus:outline-hidden"
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
                    value={editForm.metalType}
                    onChange={(e) => setEditForm({ ...editForm, metalType: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ede5dc] text-xs bg-[#faf8f5] focus:ring-1 focus:ring-[#b48c48] focus:outline-hidden"
                  >
                    <option value="Yellow Gold">Yellow Gold</option>
                    <option value="White Gold">White Gold</option>
                    <option value="Rose Gold">Rose Gold</option>
                    <option value="Platinum">Platinum</option>
                    <option value="Sterling Silver">Sterling Silver</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Metal Purity
                  </label>
                  <input
                    type="text"
                    value={editForm.metalPurity}
                    onChange={(e) => setEditForm({ ...editForm, metalPurity: e.target.value })}
                    placeholder="e.g. 18K, 22K, 925"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ede5dc] text-xs bg-[#faf8f5] focus:ring-1 focus:ring-[#b48c48] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Gemstone Type
                  </label>
                  <input
                    type="text"
                    value={editForm.gemstoneType}
                    onChange={(e) => setEditForm({ ...editForm, gemstoneType: e.target.value })}
                    placeholder="e.g. Diamond, Emerald, Sapphire"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ede5dc] text-xs bg-[#faf8f5] focus:ring-1 focus:ring-[#b48c48] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Carat Weight (ct)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.caratWeight}
                    onChange={(e) => setEditForm({ ...editForm, caratWeight: e.target.value })}
                    placeholder="e.g. 2.50"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ede5dc] text-xs bg-[#faf8f5] focus:ring-1 focus:ring-[#b48c48] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Certificate (GIA / IGI)
                  </label>
                  <input
                    type="text"
                    value={editForm.certifiedBy}
                    onChange={(e) => setEditForm({ ...editForm, certifiedBy: e.target.value })}
                    placeholder="e.g. GIA, IGI, AGS"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ede5dc] text-xs bg-[#faf8f5] focus:ring-1 focus:ring-[#b48c48] focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Image URLs (one URL per line)
                  </label>
                  <textarea
                    rows={2}
                    value={editForm.images}
                    onChange={(e) => setEditForm({ ...editForm, images: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ede5dc] text-xs bg-[#faf8f5] focus:ring-1 focus:ring-[#b48c48] focus:outline-hidden font-mono text-[11px]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ede5dc] text-xs bg-[#faf8f5] focus:ring-1 focus:ring-[#b48c48] focus:outline-hidden"
                  />
                </div>

                {/* Moderation Status */}
                <div className="sm:col-span-2 p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-stone-900 block">
                        Product Governance Status
                      </span>
                      <span className="text-[11px] text-stone-500">
                        Banning will immediately remove the piece from customer searches and catalog.
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.isBanned}
                        onChange={(e) => setEditForm({ ...editForm, isBanned: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-stone-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                    </label>
                  </div>

                  {editForm.isBanned && (
                    <div className="pt-2">
                      <label className="block text-[11px] font-medium text-rose-800 mb-1">
                        Reason for Suspension / Ban:
                      </label>
                      <input
                        type="text"
                        value={editForm.banReason}
                        onChange={(e) => setEditForm({ ...editForm, banReason: e.target.value })}
                        placeholder="e.g. Counterfeit report, policy violation..."
                        className="w-full px-3 py-1.5 rounded-lg border border-rose-300 bg-rose-50/50 text-xs text-rose-900 focus:outline-hidden"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#ede5dc]">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-full border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="gold-btn px-6 py-2 rounded-full text-xs font-semibold shadow-xs"
                >
                  {savingEdit ? "Saving..." : "Save Product Changes"}
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
                <p className="text-xs text-stone-500">
                  {banningProduct.title}
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-600">
              This product will be instantly delisted and hidden from the boutique marketplace, buyer search, and category catalogs.
            </p>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Reason for Ban / Delisting:
              </label>
              <textarea
                rows={3}
                value={customBanReason}
                onChange={(e) => setCustomBanReason(e.target.value)}
                placeholder="Specify violation reason (e.g. Failed hallmark verification, policy violation, seller unresponsiveness)..."
                className="w-full px-3 py-2 rounded-xl border border-rose-200 bg-rose-50/30 text-xs text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-rose-500"
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
                onClick={confirmBanAction}
                className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                {processingBan ? "Delisting..." : "Confirm & Ban Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
