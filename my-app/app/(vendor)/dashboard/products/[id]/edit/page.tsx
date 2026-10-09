"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UploadCloud, CheckCircle2, AlertCircle, X, Plus, Trash2 } from "lucide-react";

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface ShopOption {
  id: string;
  name: string;
  slug: string;
}

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dropdown options
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [shops, setShops] = useState<ShopOption[]>([]);

  // Form State
  const [shopId, setShopId] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Rings");
  const [metalType, setMetalType] = useState("Gold");
  const [metalPurity, setMetalPurity] = useState("22K");
  const [gemstoneType, setGemstoneType] = useState("Diamond");
  const [caratWeight, setCaratWeight] = useState("");
  const [certifiedBy, setCertifiedBy] = useState("GIA");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("1");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [customImageUrl, setCustomImageUrl] = useState("");

  useEffect(() => {
    // 1. Fetch categories & shops
    Promise.all([
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/shops").then((r) => r.json()),
      fetch(`/api/products/${id}`).then((r) => r.json()),
    ])
      .then(([catData, shopData, prodData]) => {
        if (catData.success && catData.data) setCategories(catData.data);
        if (shopData.success && shopData.data) setShops(shopData.data);

        if (prodData.success && prodData.data) {
          const p = prodData.data;
          setTitle(p.title || "");
          setDescription(p.description || "");
          setCategory(p.category || "Rings");
          setMetalType(p.metalType || "Gold");
          setMetalPurity(p.metalPurity || "22K");
          setGemstoneType(p.gemstoneType || "None");
          setCaratWeight(p.caratWeight ? p.caratWeight.toString() : "");
          setCertifiedBy(p.certifiedBy || "GIA");
          setPrice(p.price ? p.price.toString() : "");
          setStock(p.stock ? p.stock.toString() : "1");
          setImages(p.images && p.images.length > 0 ? p.images : []);
          setShopId(p.shopId || "");
        } else {
          setError(prodData.error || "Product not found");
        }
      })
      .catch((err) => {
        setError("Failed to load product details");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingImage(true);
      setError(null);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "jewelry_products");

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.success && data.publicUrl) {
          setImages((prev) => [...prev, data.publicUrl]);
        }
      }
    } catch {
      setError("Network error while uploading image");
    } finally {
      setUploadingImage(false);
    }
  };

  const addImageUrl = () => {
    if (customImageUrl.trim()) {
      setImages((prev) => [...prev, customImageUrl.trim()]);
      setCustomImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price || !category || !metalType) {
      setError("Please fill out all required creation specs.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          price: parseFloat(price),
          stock: parseInt(stock, 10),
          images,
          category,
          metalType,
          metalPurity,
          gemstoneType,
          caratWeight: caratWeight ? parseFloat(caratWeight) : null,
          certifiedBy,
          shopId: shopId || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard/products");
          router.refresh();
        }, 1200);
      } else {
        setError(data.error || "Failed to update product");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"? This cannot be undone.`)) {
      return;
    }

    try {
      setDeleting(true);
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        router.push("/dashboard/products");
        router.refresh();
      } else {
        setError(data.error || "Failed to delete product");
      }
    } catch {
      setError("Network error deleting product");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center text-xs text-stone-500">
        Loading jewelry creation details from database...
      </div>
    );
  }

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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#ede5dc]">
        <div>
          <h1 className="text-2xl font-serif font-normal text-stone-900">
            Edit Jewelry Creation
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Update specifications, hallmarks, carat weights, pricing, or catalog photography.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="px-4 py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{deleting ? "Deleting..." : "Delete Creation"}</span>
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>Jewelry creation successfully updated! Redirecting to inventory...</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-700 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-8 sm:p-10 rounded-3xl bg-white border border-[#ede5dc] shadow-sm space-y-6">
        {/* Boutique Atelier Selection */}
        <div className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9c7936]">
            1. Boutique Assignment
          </h2>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-wider text-stone-600">
              Atelier Boutique
            </label>
            <select
              value={shopId}
              onChange={(e) => setShopId(e.target.value)}
              className="w-full rounded-xl bg-white border border-[#dcd1c4] px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:border-[#b48c48]"
            >
              {shops.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.slug})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Core Info */}
        <div className="space-y-4 pt-4 border-t border-[#ede5dc]">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9c7936]">
            2. Title & Craftsmanship Details
          </h2>
          <Input
            label="Product Title"
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
              className="w-full rounded-xl bg-white border border-[#dcd1c4] px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#b48c48]"
              required
            />
          </div>
        </div>

        {/* Jewelry Domain Attributes */}
        <div className="space-y-4 pt-4 border-t border-[#ede5dc]">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9c7936]">
            3. Metal Hallmarks & Gemstone Specs
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
                {categories.length > 0 ? (
                  categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Rings">Rings</option>
                    <option value="Necklaces">Necklaces</option>
                    <option value="Bracelets">Bracelets</option>
                    <option value="Earrings">Earrings</option>
                  </>
                )}
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
                <option value="22K">22K (916 Pure Gold)</option>
                <option value="21K">21K (875 Pure Gold)</option>
                <option value="18K">18K (750 Gold)</option>
                <option value="24K">24K (999 Pure Bullion)</option>
                <option value="14K">14K (585 Gold)</option>
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
                <option value="Emerald">Natural Emerald</option>
                <option value="Sapphire">Ceylon Sapphire</option>
                <option value="Ruby">Burmese Ruby</option>
                <option value="Pearl">South Sea Pearl</option>
                <option value="None">None (Solid Metal)</option>
              </select>
            </div>

            <Input
              label="Carat Weight (ct)"
              type="number"
              step="0.01"
              value={caratWeight}
              onChange={(e) => setCaratWeight(e.target.value)}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-medium uppercase tracking-wider text-stone-600">
                Certification
              </label>
              <select
                value={certifiedBy}
                onChange={(e) => setCertifiedBy(e.target.value)}
                className="w-full rounded-xl bg-white border border-[#dcd1c4] px-3 py-2.5 text-sm text-stone-900 focus:outline-none focus:border-[#b48c48]"
              >
                <option value="GIA">GIA (Gemological Institute of America)</option>
                <option value="IGI">IGI (International Gemological Institute)</option>
                <option value="AGS">AGS (American Gem Society)</option>
                <option value="Certified 21K">Certified 21K Gold</option>
                <option value="24K Purity Tested">24K Purity Tested</option>
                <option value="Atelier Hallmarked">Atelier Hallmarked</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="space-y-4 pt-4 border-t border-[#ede5dc]">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9c7936]">
            4. Pricing & Inventory
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price (PKR / USD)"
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

        {/* Images */}
        <div className="space-y-4 pt-4 border-t border-[#ede5dc]">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9c7936]">
            5. Gallery Photography (Cloudinary)
          </h2>

          <div className="p-6 rounded-2xl border-2 border-dashed border-[#dcd1c4] hover:border-[#b48c48] transition-colors text-center bg-[#fbf9f6]">
            <input
              type="file"
              multiple
              accept="image/*"
              id="edit-product-images-upload"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label htmlFor="edit-product-images-upload" className="cursor-pointer block">
              <UploadCloud className="w-8 h-8 text-[#b48c48] mx-auto mb-2" />
              <p className="text-xs text-stone-900 font-semibold">
                {uploadingImage ? "Uploading to Cloudinary..." : "Upload additional jewelry photos"}
              </p>
            </label>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Or paste an image URL"
              value={customImageUrl}
              onChange={(e) => setCustomImageUrl(e.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={addImageUrl}
              className="shrink-0"
            >
              <Plus className="w-4 h-4 mr-1" /> Add URL
            </Button>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden border border-[#ede5dc] aspect-square bg-stone-100">
                  <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-stone-900/75 text-white hover:bg-rose-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-stone-900/80 text-[10px] text-white font-medium">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="pt-4 flex justify-end gap-3 border-t border-[#ede5dc]">
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
            disabled={submitting || uploadingImage}
            className="px-6 rounded-full py-2.5"
          >
            {submitting ? "Saving Changes..." : "Save Product Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
