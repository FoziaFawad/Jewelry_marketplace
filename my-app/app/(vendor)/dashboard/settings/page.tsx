"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  Store,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  UploadCloud,
  Trash2,
  AlertCircle,
  PlusCircle,
  ArrowRight,
} from "lucide-react";

interface ShopData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  status: string;
  stripeAccountId: string | null;
}

export default function VendorSettingsPage() {
  const router = useRouter();
  const [shop, setShop] = useState<ShopData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form Fields
  const [shopName, setShopName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  useEffect(() => {
    // 1. Fetch user session to get shopId
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(async (meData) => {
        let targetShopId = meData.user?.shopId;

        // If no shopId in session, fetch first shop owned by user or first shop in DB
        if (!targetShopId) {
          const shopsRes = await fetch("/api/shops");
          const shopsData = await shopsRes.json();
          if (shopsData.success && shopsData.data && shopsData.data.length > 0) {
            targetShopId = shopsData.data[0].id;
          }
        }

        if (targetShopId) {
          const shopRes = await fetch(`/api/shops/${targetShopId}`);
          const shopJson = await shopRes.json();
          if (shopJson.success && shopJson.data) {
            const s = shopJson.data;
            setShop(s);
            setShopName(s.name || "");
            setSlug(s.slug || "");
            setDescription(s.description || "");
            setLogoUrl(s.logoUrl || "");
            setBannerUrl(s.bannerUrl || "");
          }
        }
      })
      .catch((err) => {
        console.error("Error loading shop settings:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleFileUpload = async (file: File, type: "logo" | "banner") => {
    try {
      if (type === "logo") setUploadingLogo(true);
      else setUploadingBanner(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", `jewelry_shops_${type}`);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.publicUrl) {
        if (type === "logo") setLogoUrl(data.publicUrl);
        else setBannerUrl(data.publicUrl);
        setFeedback({ type: "success", message: `${type === "logo" ? "Logo" : "Banner"} uploaded to Cloudinary!` });
      } else {
        setFeedback({ type: "error", message: data.error || "Image upload failed" });
      }
    } catch {
      setFeedback({ type: "error", message: "Network error uploading image" });
    } finally {
      if (type === "logo") setUploadingLogo(false);
      else setUploadingBanner(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop?.id) return;

    try {
      setSaving(true);
      setFeedback(null);

      const res = await fetch(`/api/shops/${shop.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: shopName.trim(),
          slug: slug.trim(),
          description: description.trim(),
          logoUrl,
          bannerUrl,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedback({ type: "success", message: "Atelier boutique details saved successfully!" });
        setShop(data.data);
      } else {
        setFeedback({ type: "error", message: data.error || "Failed to update shop" });
      }
    } catch {
      setFeedback({ type: "error", message: "Network error saving settings" });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteShop = async () => {
    if (!shop?.id) return;

    const confirmMsg = `WARNING: Are you sure you want to permanently delete your boutique "${shop.name}" and all of its inventory creations? This action cannot be undone.`;
    if (!confirm(confirmMsg)) {
      return;
    }

    try {
      setDeleting(true);
      const res = await fetch(`/api/shops/${shop.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        alert("Boutique shop and inventory deleted successfully.");
        router.push("/shops");
        router.refresh();
      } else {
        setFeedback({ type: "error", message: data.error || "Failed to delete shop" });
      }
    } catch {
      setFeedback({ type: "error", message: "Network error deleting shop" });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center text-xs text-stone-500">
        Loading atelier configuration from database...
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="max-w-3xl mx-auto py-12 space-y-6">
        <div className="p-8 rounded-3xl bg-white border border-[#ede5dc] text-center space-y-4 shadow-sm">
          <Store className="w-10 h-10 text-[#9c7936] mx-auto" />
          <h2 className="text-xl font-serif text-stone-900">No Atelier Boutique Configured</h2>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            You do not currently have a registered boutique shop. Create an atelier to start showcasing your jewelry pieces.
          </p>
          <Link
            href="/shops/new"
            className="gold-btn px-6 py-2.5 rounded-full text-xs font-semibold inline-flex items-center gap-2 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Boutique Shop</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ede5dc]">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            Atelier Profile & Storefront Branding
          </h1>
          <p className="text-xs text-[#78716c] mt-1">
            Configure your public boutique storefront and manage identity, logo, and cover photography.
          </p>
        </div>

        <Link
          href={`/shops/${shop.slug}`}
          target="_blank"
          className="gold-outline-btn px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 self-start sm:self-auto shadow-2xs"
        >
          <span>View Public Storefront</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
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

      {/* Stripe Connect Account Card */}
      <div className="p-6 rounded-2xl bg-white border border-[#ede5dc] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#ede5dc]">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#b48c48]" />
            <h2 className="text-sm font-semibold text-stone-900">
              Stripe Connect Marketplace Payouts
            </h2>
          </div>
          <Badge variant="success" className="text-xs">
            <ShieldCheck className="w-3.5 h-3.5" /> Express Account Active
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-[#ede5dc]">
            <span className="text-[#78716c] block">Connected Stripe ID</span>
            <span className="font-mono text-stone-900 font-semibold text-xs mt-0.5 block">
              {shop.stripeAccountId || "acct_eternelle_connect_991"}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-[#ede5dc]">
            <span className="text-[#78716c] block">Status & Payouts</span>
            <span className="text-emerald-700 font-semibold text-xs mt-0.5 block">
              Direct Bank Settlement (PKR / USD)
            </span>
          </div>
        </div>
      </div>

      {/* Boutique Details Form */}
      <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-2xl bg-white border border-[#ede5dc] shadow-sm space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-[#ede5dc]">
          <Store className="w-4 h-4 text-[#b48c48]" />
          <h2 className="text-sm font-semibold text-stone-900">Public Atelier Identity</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Boutique Display Name"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            required
          />
          <Input
            label="Storefront URL Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium uppercase tracking-wider text-stone-700">
            Atelier Bio / Heritage Story
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl bg-white border border-[#dcd1c4] px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#b48c48] focus:ring-1 focus:ring-[#b48c48] transition-colors"
          />
        </div>

        {/* Logo and Banner Upload */}
        <div className="space-y-4 pt-4 border-t border-[#ede5dc]">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9c7936]">
            Branding Imagery (Cloudinary Powered)
          </h3>

          {/* Logo */}
          <div className="flex items-center gap-4">
            <img
              src={logoUrl || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=150&q=80"}
              alt="Logo"
              className="w-16 h-16 rounded-xl object-cover border border-[#ede5dc] shrink-0"
            />
            <div className="flex-1 space-y-1.5">
              <input
                type="file"
                accept="image/*"
                id="edit-logo-file"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "logo")}
                className="hidden"
              />
              <label
                htmlFor="edit-logo-file"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#faf5ed] hover:bg-[#f3e7d5] border border-[#e8d5b5] text-xs font-medium text-[#826229] cursor-pointer transition-colors"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>{uploadingLogo ? "Uploading logo..." : "Change Logo Image"}</span>
              </label>
              <Input
                placeholder="Or paste direct logo URL"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
              />
            </div>
          </div>

          {/* Banner */}
          <div className="space-y-2">
            <div className="h-28 w-full rounded-xl overflow-hidden bg-stone-100 border border-[#ede5dc]">
              <img
                src={bannerUrl || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=80"}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                id="edit-banner-file"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "banner")}
                className="hidden"
              />
              <label
                htmlFor="edit-banner-file"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#faf5ed] hover:bg-[#f3e7d5] border border-[#e8d5b5] text-xs font-medium text-[#826229] cursor-pointer transition-colors shrink-0"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>{uploadingBanner ? "Uploading banner..." : "Change Banner Image"}</span>
              </label>
              <div className="flex-1">
                <Input
                  placeholder="Or paste direct banner URL"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button type="submit" variant="gold" size="md" disabled={saving}>
            {saving ? "Saving Changes..." : "Save Atelier Changes"}
          </Button>
        </div>
      </form>

      {/* Danger Zone: Delete Shop */}
      <div className="p-6 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-4">
        <div className="flex items-center gap-2 text-rose-800">
          <Trash2 className="w-5 h-5 text-rose-600" />
          <h2 className="text-sm font-semibold">Danger Zone: Delete Atelier Boutique</h2>
        </div>
        <p className="text-xs text-rose-700 leading-relaxed">
          Deleting your boutique will permanently remove your storefront, atelier branding, and all associated jewelry product listings from Éternelle Gems marketplace.
        </p>
        <div className="pt-1">
          <button
            type="button"
            disabled={deleting}
            onClick={handleDeleteShop}
            className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            {deleting ? "Deleting Boutique..." : "Permanently Delete Atelier Boutique"}
          </button>
        </div>
      </div>
    </div>
  );
}
