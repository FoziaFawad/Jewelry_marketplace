import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { ProductCard } from "@/components/jewelry/ProductCard";
import { Badge } from "@/components/ui/badge";
import { getServerSession } from "@/lib/auth-server";
import { ShieldCheck, Star, MapPin, Sparkles, MessageCircle, Info, Store, ArrowRight, Settings } from "lucide-react";

export default async function ShopStorefrontPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Query real shop from Neon DB
  const shop = await prisma.shop.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
    },
    include: {
      products: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!shop) {
    notFound();
  }

  const session = await getServerSession();
  const isOwner = session?.shopId === shop.id || session?.id === shop.ownerId || session?.role === "ADMIN";

  const shopProducts: any[] = shop.products.map((p) => ({
    ...p,
    price: Number(p.price),
    caratWeight: p.caratWeight ? Number(p.caratWeight) : undefined,
    shop: {
      id: shop.id,
      name: shop.name,
      slug: shop.slug,
      logoUrl: shop.logoUrl,
      status: shop.status,
    },
  }));

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10 space-y-4">
        {/* Vendor Owner Quick Action Banner */}
        {isOwner && (
          <div className="p-4 rounded-2xl bg-[#faf5ed] border border-[#e5d2b3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2.5 text-xs text-[#826229]">
              <Store className="w-4 h-4 text-[#b48c48] shrink-0" />
              <span>
                <strong>Atelier Owner Mode:</strong> You are viewing your live shop. Click below to manage products, categories & boutique settings.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard/products/new"
                className="gold-btn px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shrink-0 shadow-xs"
              >
                <span>Upload Product</span>
              </Link>
              <Link
                href="/dashboard/settings"
                className="gold-outline-btn px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shrink-0 shadow-xs"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Shop Settings</span>
              </Link>
            </div>
          </div>
        )}

        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#ede5dc] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative h-20 w-20 rounded-2xl overflow-hidden border-2 border-white shadow-md shrink-0 bg-stone-100">
              <img
                src={shop.logoUrl || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80"}
                alt={shop.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-serif text-stone-900 font-normal">
                  {shop.name}
                </h1>
                {shop.status === "ACTIVE" ? (
                  <Badge variant="gold" className="text-xs">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Verified Atelier
                  </Badge>
                ) : (
                  <Badge variant="warning" className="text-xs">
                    Pending Verification
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 pt-0.5">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-[#b48c48] fill-[#b48c48]" />
                  <span className="font-semibold text-stone-900">5.0</span>
                  <span className="text-stone-400">(Artisan Verified)</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>Verified House</span>
                </div>
              </div>

              <p className="text-xs text-stone-600 max-w-2xl leading-relaxed pt-1">
                {shop.description || "Master jewelry atelier showcasing bespoke handcrafted fine jewelry."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={`/shops/${shop.slug}/about`}
              className="gold-outline-btn px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-2xs"
            >
              <Info className="w-3.5 h-3.5" />
              <span>About Atelier</span>
            </Link>
            <Link
              href="/dashboard/products/new"
              className="gold-btn px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Add Creation</span>
            </Link>
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
            <h3 className="text-base font-medium text-stone-900">No products uploaded yet</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              This atelier currently has no active creations listed. Upload fine jewelry pieces to display them here.
            </p>
            <Link
              href="/dashboard/products/new"
              className="gold-btn px-5 py-2 rounded-full text-xs font-semibold inline-block mt-2"
            >
              Upload First Piece
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
