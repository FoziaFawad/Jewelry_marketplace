"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Store, ArrowLeft, UploadCloud, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CreateShopPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80");
  const [bannerUrl, setBannerUrl] = useState("https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=80");
  const [submitting, setSubmitting] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
      } else {
        setError(data.error || "Image upload failed");
      }
    } catch {
      setError("Network error while uploading image");
    } finally {
      if (type === "logo") setUploadingLogo(false);
      else setUploadingBanner(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setSubmitting(true);
      setError(null);

      const res = await fetch("/api/shops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          logoUrl,
          bannerUrl,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1500);
      } else {
        setError(data.error || "Failed to create shop");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to create shop");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      {/* Back button */}
      <Link
        href="/shops"
        className="inline-flex items-center gap-1.5 text-xs text-[#826229] hover:text-[#5c441b] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Jewelry Houses
      </Link>

      <div className="pb-4 border-b border-[#ede5dc] space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#faf5ed] border border-[#ecd8b0] text-[11px] font-semibold text-[#826229] uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Artisan Onboarding</span>
        </div>
        <h1 className="text-3xl font-serif font-normal text-stone-900">
          Establish Your Jewelry Atelier
        </h1>
        <p className="text-xs text-stone-500">
          Launch your official boutique storefront on Éternelle Gems to showcase certified diamonds, 21K/22K gold, and royal bridal collections.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Boutique atelier successfully established! Redirecting to your dashboard...</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-8 sm:p-10 rounded-3xl bg-white border border-[#ede5dc] shadow-sm space-y-8">
        {/* Core details */}
        <div className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9c7936]">
            1. Boutique Identity
          </h2>

          <Input
            label="Boutique / Atelier Name"
            placeholder="e.g. Kohinoor Diamond Studio"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-wider text-stone-600">
              Atelier Heritage & Bio
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell collectors about your goldsmith heritage, master setting techniques, hallmark purity standards..."
              className="w-full rounded-xl bg-white border border-[#dcd1c4] px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#b48c48]"
              required
            />
          </div>
        </div>

        {/* Visual Branding */}
        <div className="space-y-6 pt-6 border-t border-[#ede5dc]">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9c7936]">
            2. Atelier Imagery & Branding (Cloudinary Integrated)
          </h2>

          {/* Logo upload */}
          <div className="space-y-3">
            <label className="block text-xs font-medium uppercase tracking-wider text-stone-600">
              Atelier Logo / Crest
            </label>
            <div className="flex items-center gap-4">
              <img
                src={logoUrl}
                alt="Logo preview"
                className="w-20 h-20 rounded-2xl object-cover border border-[#ede5dc] shadow-2xs shrink-0"
              />
              <div className="flex-1 space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  id="logo-upload-input"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "logo")}
                  className="hidden"
                />
                <label
                  htmlFor="logo-upload-input"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#faf5ed] hover:bg-[#f3e7d5] border border-[#e8d5b5] text-xs font-medium text-[#826229] cursor-pointer transition-colors shadow-2xs"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{uploadingLogo ? "Uploading to Cloudinary..." : "Upload Logo Image"}</span>
                </label>
                <Input
                  placeholder="Or paste direct image URL"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Banner upload */}
          <div className="space-y-3">
            <label className="block text-xs font-medium uppercase tracking-wider text-stone-600">
              Storefront Hero Banner
            </label>
            <div className="space-y-2">
              <div className="h-32 w-full rounded-2xl overflow-hidden bg-stone-100 border border-[#ede5dc]">
                <img
                  src={bannerUrl}
                  alt="Banner preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  id="banner-upload-input"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "banner")}
                  className="hidden"
                />
                <label
                  htmlFor="banner-upload-input"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#faf5ed] hover:bg-[#f3e7d5] border border-[#e8d5b5] text-xs font-medium text-[#826229] cursor-pointer transition-colors shadow-2xs shrink-0"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{uploadingBanner ? "Uploading banner..." : "Upload Banner Image"}</span>
                </label>
                <div className="flex-1">
                  <Input
                    placeholder="Or paste banner URL"
                    value={bannerUrl}
                    onChange={(e) => setBannerUrl(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#ede5dc]">
          <Link
            href="/shops"
            className="px-5 py-2.5 rounded-full text-xs font-medium text-stone-600 hover:text-stone-900"
          >
            Cancel
          </Link>
          <Button
            type="submit"
            variant="gold"
            size="md"
            disabled={submitting || uploadingLogo || uploadingBanner}
            className="px-6 rounded-full"
          >
            {submitting ? "Establishing Atelier..." : "Establish Boutique Shop"}
          </Button>
        </div>
      </form>
    </div>
  );
}
