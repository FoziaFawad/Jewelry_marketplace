import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { formatCurrency, formatCarat } from "@/lib/utils";
import { MetalBadge } from "@/components/jewelry/MetalBadge";
import { CaratSelector } from "@/components/jewelry/CaratSelector";
import { Badge } from "@/components/ui/badge";
import {
  Store,
  ShoppingBag,
  Truck,
  RotateCcw,
  ArrowLeft,
  FileCheck2,
} from "lucide-react";

export function generateStaticParams() {
  return MOCK_PRODUCTS.map((p) => ({ id: p.id }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = MOCK_PRODUCTS.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  const primaryImage = product.images[0];
  const secondaryImage = product.images[1] || primaryImage;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumb / Back Link */}
      <div className="flex items-center gap-2 text-xs text-stone-500">
        <Link href="/jewelry" className="hover:text-stone-900 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          Catalog
        </Link>
        <span>/</span>
        <span className="text-stone-600">{product.category}</span>
        <span>/</span>
        <span className="text-[#826229] font-medium truncate max-w-xs">{product.title}</span>
      </div>

      {/* Main Grid: Gallery + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Product Imagery Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white border border-[#ede5dc] shadow-sm group">
            <img
              src={primaryImage}
              alt={product.title}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {product.certifiedBy && product.certifiedBy !== "None" && (
              <div className="absolute top-4 left-4 z-10">
                <Badge variant="emerald" className="text-xs px-3 py-1 shadow-xs bg-white/95">
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-700" />
                  {product.certifiedBy} Certified Report
                </Badge>
              </div>
            )}
          </div>

          {/* Thumbnail / Angle Preview */}
          <div className="grid grid-cols-4 gap-3">
            {[primaryImage, secondaryImage].map((img, i) => (
              <div
                key={i}
                className="relative aspect-square rounded-2xl overflow-hidden border border-[#e8ded4] hover:border-[#b48c48] bg-white cursor-pointer shadow-2xs"
              >
                <img src={img} alt={`View angle ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Specifications & Purchase Actions */}
        <div className="space-y-6">
          {/* Shop Header */}
          {product.shop && (
            <Link
              href={`/shops/${product.shop.slug}`}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#faf5ed] border border-[#ecd8b0] text-xs text-[#826229] hover:border-[#b48c48] transition-colors shadow-2xs"
            >
              <Store className="w-3.5 h-3.5 text-[#9c7936]" />
              <span>Created by {product.shop.name}</span>
            </Link>
          )}

          {/* Title & Price */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-serif font-normal text-stone-900 tracking-tight leading-snug">
              {product.title}
            </h1>

            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl font-semibold gold-gradient-text tracking-tight">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-stone-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Hallmarks & Attributes */}
          <div className="pt-2">
            <MetalBadge
              metalType={product.metalType}
              purity={product.metalPurity}
              certifiedBy={product.certifiedBy}
            />
          </div>

          {/* Interactive Carat Selector */}
          {product.caratWeight && (
            <div className="p-4 rounded-2xl bg-white border border-[#ede5dc] shadow-2xs">
              <CaratSelector currentCarat={product.caratWeight} />
            </div>
          )}

          {/* Description */}
          <div className="space-y-2 text-xs sm:text-sm text-stone-600 leading-relaxed pt-2 border-t border-[#ede5dc]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Atelier Master Notes
            </h3>
            <p>{product.description}</p>
          </div>

          {/* Gemological Specs Box */}
          <div className="p-5 rounded-2xl bg-[#faf8f5] border border-[#ede5dc] grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-stone-500 block">Precious Metal</span>
              <span className="font-semibold text-stone-900">
                {product.metalPurity ? `${product.metalPurity} ${product.metalType}` : product.metalType}
              </span>
            </div>
            <div>
              <span className="text-stone-500 block">Center Gemstone</span>
              <span className="font-semibold text-stone-900">
                {product.gemstoneType || "None"}
              </span>
            </div>
            <div>
              <span className="text-stone-500 block">Carat Weight</span>
              <span className="font-semibold text-[#826229]">
                {product.caratWeight ? formatCarat(product.caratWeight) : "Solitaire Setting"}
              </span>
            </div>
            <div>
              <span className="text-stone-500 block">Lab Certificate</span>
              <span className="font-semibold text-emerald-800">
                {product.certificateNumber ? `${product.certifiedBy} #${product.certificateNumber}` : "Certified by Atelier"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href={`/checkout?productId=${product.id}`}
              className="flex-1 py-3 px-6 rounded-full gold-btn text-center text-xs font-medium flex items-center justify-center gap-2 shadow-md"
            >
              <ShoppingBag className="w-4 h-4" />
              Direct Atelier Checkout
            </Link>
            <Link
              href="/cart"
              className="py-3 px-6 rounded-full gold-outline-btn text-center text-xs font-medium flex items-center justify-center gap-2 shadow-2xs"
            >
              Add to Multi-Shop Bag
            </Link>
          </div>

          {/* Guarantees */}
          <div className="pt-4 border-t border-[#ede5dc] grid grid-cols-2 gap-3 text-xs text-stone-500">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#9c7936] shrink-0" />
              <span>Insured Armored Transit</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#9c7936] shrink-0" />
              <span>30-Day Escrow Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
