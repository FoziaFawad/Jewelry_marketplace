"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UploadCloud, CheckCircle2 } from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Rings");
  const [metalType, setMetalType] = useState("Gold");
  const [metalPurity, setMetalPurity] = useState("18K");
  const [gemstoneType, setGemstoneType] = useState("Diamond");
  const [caratWeight, setCaratWeight] = useState("2.50");
  const [certifiedBy, setCertifiedBy] = useState("GIA");
  const [certificateNumber, setCertificateNumber] = useState("");
  const [price, setPrice] = useState("12500");
  const [stock, setStock] = useState("1");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/products");
      }, 1500);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back button */}
      <Link
        href="/dashboard/products"
        className="inline-flex items-center gap-1.5 text-xs text-[#826229] hover:text-[#5c441b] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Inventory
      </Link>

      <div className="flex items-center justify-between pb-4 border-b border-[#ede5dc]">
        <div>
          <h1 className="text-2xl font-serif font-normal text-stone-900">
            List New Fine Jewelry Creation
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Specify precious metal purity, gemstone carat weight, and third-party laboratory certification.
          </p>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>Jewelry creation successfully hallmarked and listed to your boutique! Redirecting...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-8 sm:p-10 rounded-3xl bg-white border border-[#ede5dc] shadow-sm space-y-6">
        {/* Core Info */}
        <div className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9c7936]">
            1. Creation Title & Overview
          </h2>
          <Input
            label="Product Title"
            placeholder="e.g. Royal Emerald & Baguette Diamond Ring"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-wider text-stone-600">
              Description & Craftsmanship Details
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe gemstone color saturation, clarity, cut grade, and atelier mounting technique..."
              className="w-full rounded-xl bg-white border border-[#dcd1c4] px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#b48c48]"
              required
            />
          </div>
        </div>

        {/* Jewelry Domain Attributes */}
        <div className="space-y-4 pt-4 border-t border-[#ede5dc]">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9c7936]">
            2. Metal Hallmarks & Gemstone Specs
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium uppercase tracking-wider text-stone-600">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl bg-white border border-[#dcd1c4] px-3 py-2.5 text-sm text-stone-900 focus:outline-none focus:border-[#b48c48]"
              >
                <option value="Rings">Rings</option>
                <option value="Necklaces">Necklaces</option>
                <option value="Bracelets">Bracelets</option>
                <option value="Earrings">Earrings</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium uppercase tracking-wider text-stone-600">
                Precious Metal
              </label>
              <select
                value={metalType}
                onChange={(e) => setMetalType(e.target.value)}
                className="w-full rounded-xl bg-white border border-[#dcd1c4] px-3 py-2.5 text-sm text-stone-900 focus:outline-none focus:border-[#b48c48]"
              >
                <option value="Gold">Yellow Gold</option>
                <option value="White Gold">White Gold</option>
                <option value="Rose Gold">Rose Gold</option>
                <option value="Platinum">Platinum</option>
                <option value="Silver">Sterling Silver</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium uppercase tracking-wider text-stone-600">
                Metal Purity Hallmark
              </label>
              <select
                value={metalPurity}
                onChange={(e) => setMetalPurity(e.target.value)}
                className="w-full rounded-xl bg-white border border-[#dcd1c4] px-3 py-2.5 text-sm text-stone-900 focus:outline-none focus:border-[#b48c48]"
              >
                <option value="18K">18K (750 Gold)</option>
                <option value="14K">14K (585 Gold)</option>
                <option value="24K">24K (999 Pure Gold)</option>
                <option value="950 Platinum">950 Platinum</option>
                <option value="925 Sterling">925 Sterling Silver</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium uppercase tracking-wider text-stone-600">
                Center Gemstone
              </label>
              <select
                value={gemstoneType}
                onChange={(e) => setGemstoneType(e.target.value)}
                className="w-full rounded-xl bg-white border border-[#dcd1c4] px-3 py-2.5 text-sm text-stone-900 focus:outline-none focus:border-[#b48c48]"
              >
                <option value="Diamond">Natural Diamond</option>
                <option value="Emerald">Colombian Emerald</option>
                <option value="Sapphire">Ceylon Sapphire</option>
                <option value="Ruby">Burmese Ruby</option>
                <option value="Pearl">South Sea Pearl</option>
                <option value="Opal">Australian Opal</option>
                <option value="None">None (Solid Metal)</option>
              </select>
            </div>

            <Input
              label="Carat Weight (ct)"
              type="number"
              step="0.01"
              value={caratWeight}
              onChange={(e) => setCaratWeight(e.target.value)}
              placeholder="e.g. 2.50"
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-medium uppercase tracking-wider text-stone-600">
                Laboratory Certification
              </label>
              <select
                value={certifiedBy}
                onChange={(e) => setCertifiedBy(e.target.value)}
                className="w-full rounded-xl bg-white border border-[#dcd1c4] px-3 py-2.5 text-sm text-stone-900 focus:outline-none focus:border-[#b48c48]"
              >
                <option value="GIA">GIA (Gemological Institute of America)</option>
                <option value="IGI">IGI (International Gemological Institute)</option>
                <option value="AGS">AGS (American Gem Society)</option>
                <option value="None">Atelier In-House Assay</option>
              </select>
            </div>
          </div>

          <Input
            label="Certificate Report Number"
            placeholder="e.g. GIA-22359182"
            value={certificateNumber}
            onChange={(e) => setCertificateNumber(e.target.value)}
          />
        </div>

        {/* Pricing & Inventory */}
        <div className="space-y-4 pt-4 border-t border-[#ede5dc]">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9c7936]">
            3. Pricing & Stock
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price ($ USD)"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <Input
              label="Stock Available"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Media Upload Area */}
        <div className="space-y-2 pt-4 border-t border-[#ede5dc]">
          <label className="block text-xs font-medium uppercase tracking-wider text-stone-600">
            High-Resolution Photography & Certificate PDF
          </label>
          <div className="p-8 rounded-2xl border-2 border-dashed border-[#dcd1c4] hover:border-[#b48c48] transition-colors text-center bg-[#fbf9f6] cursor-pointer">
            <UploadCloud className="w-8 h-8 text-[#b48c48] mx-auto mb-2" />
            <p className="text-xs text-stone-900 font-medium">Click or drag images to upload</p>
            <p className="text-[11px] text-stone-500">Cloudinary & S3 automated presigned integration</p>
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <Link
            href="/dashboard/products"
            className="px-5 py-2.5 rounded-full text-xs font-medium text-stone-600 hover:text-stone-900"
          >
            Cancel
          </Link>
          <Button
            type="submit"
            variant="gold"
            size="md"
            disabled={submitting}
            className="px-6 rounded-full py-2.5"
          >
            {submitting ? "Hallmarking & Listing..." : "Publish Creation to Vault"}
          </Button>
        </div>
      </form>
    </div>
  );
}
