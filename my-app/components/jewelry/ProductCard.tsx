"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/types";
import { formatCurrency, formatCarat } from "@/lib/utils";
import { MetalBadge } from "./MetalBadge";
import { Heart, ShoppingBag, Store, Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const primaryImage = product.images[0] || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="group relative flex flex-col rounded-2xl overflow-hidden bg-white border border-[#ede5dc] hover:border-[#c9b18c] shadow-2xs hover:shadow-md transition-all duration-300">
      {/* Product Image Area */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#fbf9f6]">
        <img
          src={primaryImage}
          alt={product.title}
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Subtle Warm Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/35 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.caratWeight && (
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider bg-white/95 backdrop-blur-md text-[#826229] border border-[#ecd8b0] shadow-2xs">
              {formatCarat(product.caratWeight)}
            </span>
          )}
          {product.gemstoneType && product.gemstoneType !== "None" && (
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wider bg-white/90 backdrop-blur-md text-stone-700 border border-[#e8ded4] shadow-2xs">
              {product.gemstoneType}
            </span>
          )}
        </div>

        {/* Favorite Wishlist Icon */}
        <button
          type="button"
          aria-label="Save to wishlist"
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md border border-[#e8ded4] text-stone-600 hover:text-rose-500 hover:bg-white shadow-2xs transition-all z-10"
        >
          <Heart className="w-4 h-4" />
        </button>

        {/* Quick Add Overlay on Hover */}
        <div className="absolute bottom-3 inset-x-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart?.(product);
            }}
            className="w-full py-2.5 px-4 rounded-full gold-btn text-xs font-medium flex items-center justify-center gap-2 shadow-md"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Add to Bag
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Shop Header Link */}
          {product.shop && (
            <Link
              href={`/shops/${product.shop.slug}`}
              className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-[#9c7936] transition-colors mb-1.5"
            >
              <Store className="w-3.5 h-3.5 text-[#9c7936]" />
              <span className="truncate font-medium">{product.shop.name}</span>
            </Link>
          )}

          {/* Product Title */}
          <Link href={`/jewelry/${product.id}`} className="block">
            <h3 className="text-sm font-serif font-medium text-stone-900 hover:text-[#9c7936] transition-colors line-clamp-2 leading-snug">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Metal & Certification Badges */}
        <div className="pt-1">
          <MetalBadge
            metalType={product.metalType}
            purity={product.metalPurity}
            certifiedBy={product.certifiedBy}
          />
        </div>

        {/* Pricing & Rating */}
        <div className="pt-3 border-t border-[#ede5dc] flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold gold-gradient-text tracking-tight">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-stone-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          {product.rating && (
            <div className="flex items-center gap-1 text-xs text-[#a37d36]">
              <Star className="w-3 h-3 fill-[#a37d36]" />
              <span className="font-medium text-stone-700">{product.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
