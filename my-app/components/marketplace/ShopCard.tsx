import React from "react";
import Link from "next/link";
import { Shop } from "@/types";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Star, MapPin, ArrowRight } from "lucide-react";

interface ShopCardProps {
  shop: Shop;
}

export function ShopCard({ shop }: ShopCardProps) {
  const isVerified = shop.status === "ACTIVE";

  return (
    <div className="group relative flex flex-col rounded-2xl overflow-hidden bg-white border border-[#ede5dc] hover:border-[#c9b18c] shadow-2xs hover:shadow-md transition-all duration-300">
      {/* Banner */}
      <div className="relative h-32 w-full overflow-hidden bg-[#f5f0ea]">
        <img
          src={shop.bannerUrl || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80"}
          alt={`${shop.name} banner`}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 via-transparent to-transparent opacity-40" />
      </div>

      {/* Content Container */}
      <div className="px-5 pb-5 pt-0 relative flex-1 flex flex-col justify-between">
        <div>
          {/* Logo & Status Badge Row */}
          <div className="flex items-end justify-between -mt-9 mb-3">
            <div className="relative h-16 w-16 rounded-xl overflow-hidden border-2 border-white bg-white shadow-md">
              <img
                src={shop.logoUrl || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=200&q=80"}
                alt={shop.name}
                className="h-full w-full object-cover"
              />
            </div>

            {isVerified ? (
              <Badge variant="gold" className="text-[10px]">
                <ShieldCheck className="w-3 h-3 text-[#9c7936]" /> Verified Seller
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[10px]">
                Under Review
              </Badge>
            )}
          </div>

          {/* Shop Title */}
          <Link href={`/shops/${shop.slug}`} className="block">
            <h3 className="text-base font-serif font-semibold text-stone-900 group-hover:text-[#9c7936] transition-colors">
              {shop.name}
            </h3>
          </Link>

          {/* Location & Established */}
          <div className="flex items-center gap-3 text-xs text-stone-500 mt-1 mb-2.5">
            {shop.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-stone-400" />
                {shop.location}
              </span>
            )}
            {shop.establishedYear && (
              <span>Est. {shop.establishedYear}</span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {shop.description}
          </p>
        </div>

        {/* Rating and Explore Link */}
        <div className="mt-4 pt-3 border-t border-[#ede5dc] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#9c7936]">
            <Star className="w-3.5 h-3.5 fill-[#9c7936]" />
            <span className="font-semibold text-stone-900">{shop.rating || 4.9}</span>
            <span className="text-stone-400">({shop.reviewCount || 0} reviews)</span>
          </div>

          <Link
            href={`/shops/${shop.slug}`}
            className="inline-flex items-center gap-1 text-xs font-medium text-[#826229] hover:text-[#5c441b] transition-colors"
          >
            Visit Shop
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
