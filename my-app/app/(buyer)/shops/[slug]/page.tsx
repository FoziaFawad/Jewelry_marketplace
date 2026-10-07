import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MOCK_SHOPS, MOCK_PRODUCTS } from "@/lib/mock-data";
import { ProductCard } from "@/components/jewelry/ProductCard";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Star, MapPin, Sparkles, MessageCircle, Info } from "lucide-react";

export function generateStaticParams() {
  return MOCK_SHOPS.map((s) => ({ slug: s.slug }));
}

export default async function ShopStorefrontPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const shop = MOCK_SHOPS.find((s) => s.slug === slug);

  if (!shop) {
    notFound();
  }

  const shopProducts = MOCK_PRODUCTS.filter((p) => p.shopId === shop.id);

  return (
    <div className="space-y-12 pb-20">
      {/* Shop Hero Banner */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-[#f5f0ea]">
        <img
          src={shop.bannerUrl || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=80"}
          alt={shop.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent opacity-50" />
      </div>

      {/* Atelier Profile Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#ede5dc] shadow-md flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative h-24 w-24 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-white shrink-0">
              <img
                src={shop.logoUrl || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80"}
                alt={shop.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-serif font-normal text-stone-900">
                  {shop.name}
                </h1>
                {shop.status === "ACTIVE" && (
                  <Badge variant="gold" className="text-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#9c7936]" /> Verified Atelier
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500">
                {shop.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    {shop.location}
                  </span>
                )}
                {shop.establishedYear && (
                  <span>Established {shop.establishedYear}</span>
                )}
                <div className="flex items-center gap-1 text-[#9c7936] font-medium">
                  <Star className="w-3.5 h-3.5 fill-[#9c7936]" />
                  <span className="text-stone-800">{shop.rating}</span>
                  <span className="text-stone-400 font-normal">({shop.reviewCount} reviews)</span>
                </div>
              </div>

              <p className="text-xs text-stone-600 max-w-2xl leading-relaxed pt-1">
                {shop.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={`/shops/${shop.slug}/about`}
              className="gold-outline-btn px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-2xs"
            >
              <Info className="w-3.5 h-3.5" />
              About Atelier
            </Link>
            <button
              type="button"
              className="gold-btn px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-2xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Bespoke Inquiry
            </button>
          </div>
        </div>
      </div>

      {/* Atelier Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#ede5dc]">
          <div>
            <h2 className="text-xl font-serif font-normal text-stone-900">
              Creations by {shop.name}
            </h2>
            <p className="text-xs text-stone-500">
              Showing {shopProducts.length} authenticated fine jewelry creations
            </p>
          </div>
        </div>

        {shopProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {shopProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#ede5dc] p-8 space-y-3 shadow-xs">
            <Sparkles className="w-8 h-8 text-[#b48c48] mx-auto" />
            <h3 className="text-base font-medium text-stone-900">New creations arriving soon</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              This atelier is currently crafting their upcoming seasonal collection. Check back shortly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
