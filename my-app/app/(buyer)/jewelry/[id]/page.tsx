import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
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
  Banknote,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Query real product from Neon DB
  const rawProduct = await prisma.product.findFirst({
    where: {
      OR: [{ id }, { slug: id }],
    },
    include: {
      shop: true,
    },
  });

  if (!rawProduct) {
    notFound();
  }

  if (rawProduct.isBanned) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-stone-900">Creation Unavailable</h1>
        <p className="text-sm text-stone-600">
          This fine jewelry piece is currently under administrative governance review or suspended from the marketplace catalog.
        </p>
        <div className="pt-4">
          <Link href="/jewelry" className="gold-btn px-6 py-2.5 rounded-full text-xs font-semibold inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Explore Available Creations
          </Link>
        </div>
      </div>
    );
  }

  const product = {
    ...rawProduct,
    price: Number(rawProduct.price),
    caratWeight: rawProduct.caratWeight ? Number(rawProduct.caratWeight) : undefined,
  };

  const primaryImage = product.images[0] || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80";
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
              className="w-full h-full object-cover object-center"
            />
          </div>

          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-2xl overflow-hidden border border-[#ede5dc] bg-white shadow-2xs"
                >
                  <img src={img} alt={`${product.title} view ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Specs */}
        <div className="space-y-6">
          {/* Shop Tag */}
          {product.shop && (
            <Link
              href={`/shops/${product.shop.slug}`}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#faf5ed] border border-[#ecd8b0] text-[#826229] text-xs font-medium hover:bg-[#f3e7d5] transition-colors"
            >
              <Store className="w-3.5 h-3.5" />
              <span>{product.shop.name}</span>
            </Link>
          )}

          <div>
            <h1 className="text-3xl sm:text-4xl font-serif text-stone-900 font-normal leading-tight">
              {product.title}
            </h1>
            <p className="text-2xl font-serif font-semibold text-[#826229] mt-3">
              {formatCurrency(product.price)}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {product.description}
          </p>

          {/* Jewelry Hallmarks */}
          <div className="p-5 rounded-2xl bg-[#faf8f5] border border-[#ede5dc] space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9c7936]">
              Hallmark Specifications & Gemological Report
            </h3>
            <div className="flex flex-wrap gap-2">
              <MetalBadge metalType={product.metalType} purity={product.metalPurity || undefined} />
              {product.certifiedBy && (
                <Badge variant="gold" className="text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  {product.certifiedBy} Certified
                </Badge>
              )}
            </div>
          </div>

          {/* Key Specs Grid */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-white border border-[#ede5dc] text-xs">
            <div>
              <span className="text-stone-500 block">Gemstone</span>
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
              <span className="text-stone-500 block">Certification</span>
              <span className="font-semibold text-emerald-800">
                {product.certifiedBy || "Atelier Hallmarked"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href={`/checkout?productId=${product.id}`}
              className="flex-1 py-3 px-6 rounded-full gold-btn text-center text-xs font-medium flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              Buy Now
            </Link>
            <Link
              href="/cart"
              className="py-3 px-6 rounded-full gold-outline-btn text-center text-xs font-medium flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
            >
              Add to Cart
            </Link>
          </div>

          {/* Guarantees */}
          <div className="pt-4 border-t border-[#ede5dc] grid grid-cols-2 gap-3 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <Banknote className="w-4 h-4 text-[#9c7936] shrink-0" />
              <span>Cash on Delivery (COD)</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>100% Hallmark Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#9c7936] shrink-0" />
              <span>Insured Courier</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#9c7936] shrink-0" />
              <span>Doorstep Inspection Allowed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
