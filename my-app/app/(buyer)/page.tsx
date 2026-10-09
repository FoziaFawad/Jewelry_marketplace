import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { SearchBar } from "@/components/marketplace/SearchBar";
import { ProductCard } from "@/components/jewelry/ProductCard";
import { ShopCard } from "@/components/marketplace/ShopCard";
import { Sparkles, ArrowRight, Store, Award, ShieldCheck, Banknote, Truck } from "lucide-react";

export default async function MallLandingPage() {
  // Query real data from Neon PostgreSQL
  const [dbProducts, dbShops, dbCategories] = await Promise.all([
    prisma.product.findMany({
      take: 8,
      where: {
        isBanned: false,
        shop: { status: "ACTIVE" },
      },
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }).catch(() => []),

    prisma.shop.findMany({
      take: 4,
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    }).catch(() => []),

    prisma.category.findMany({
      take: 4,
      orderBy: { createdAt: "asc" },
    }).catch(() => []),
  ]);

  // Convert Decimal prices to numbers for ProductCard
  const featuredProducts: any[] = dbProducts.map((p) => ({
    ...p,
    price: Number(p.price),
    caratWeight: p.caratWeight ? Number(p.caratWeight) : undefined,
  }));

  const featuredShops: any[] = dbShops;

  const defaultCategoriesFallback = [
    {
      name: "Bridal Sets & Haars",
      subtitle: "22K Gold Chokers, Haars & Pearls",
      imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
      slug: "necklaces",
    },
    {
      name: "Solitaires & Rings",
      subtitle: "Certified Diamonds & Gold Bands",
      imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80",
      slug: "rings",
    },
    {
      name: "Bangles & Kangan",
      subtitle: "Solid 21K & 22K Gold Pairs & Cuffs",
      imageUrl: "https://images.unsplash.com/photo-1611591475819-bf91696b96b2?auto=format&fit=crop&w=600&q=80",
      slug: "bracelets",
    },
    {
      name: "Jhumkas & Earrings",
      subtitle: "Traditional Drops, Studs & Chandbalis",
      imageUrl: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80",
      slug: "earrings",
    },
  ];

  const displayCategories = dbCategories.length > 0 ? dbCategories : defaultCategoriesFallback;

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & Search */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f5f0ea] border border-[#e8ded4] text-stone-700 text-xs font-medium tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-[#b48c48]" />
              <span>Hallmark Certified 21K & 22K Gold • Certified Solitaires</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl font-serif text-stone-900 tracking-tight leading-[1.15]">
                Fine jewelry, <br />
                <span className="italic font-serif">handcrafted</span> with royal heritage.
              </h1>

              <p className="text-sm sm:text-base text-stone-600 max-w-xl leading-relaxed">
                Discover exquisite 21K and 22K gold bridal sets, certified diamond engagement rings, solid gold bangles, and precious gemstones from leading fine jewelry houses in Lahore, Karachi, and Islamabad.
              </p>
            </div>

            {/* Search Bar */}
            <div className="pt-1 max-w-xl">
              <SearchBar placeholder="Search bridal choker sets, 22K gold bangles, diamond solitaires..." />
            </div>

            {/* Curated Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-stone-500 font-medium">Popular:</span>
              {[
                { label: "22K Bridal Sets", href: "/jewelry?category=Necklaces" },
                { label: "Solitaire Rings", href: "/jewelry?category=Rings" },
                { label: "21K Gold Bangles", href: "/jewelry?category=Bracelets" },
                { label: "Royal Jhumkas", href: "/jewelry?category=Earrings" },
                { label: "Pure 24K Gold", href: "/jewelry?metalType=Gold" },
                { label: "Cash on Delivery", href: "/jewelry" },
              ].map((tag) => (
                <Link
                  key={tag.label}
                  href={tag.href}
                  className="px-3 py-1 rounded-full bg-white border border-[#e8ded4] text-stone-700 hover:border-[#b48c48] hover:text-[#826229] transition-colors shadow-2xs"
                >
                  {tag.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column: Visual Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm">
              <div className="relative h-[430px] w-full rounded-t-[160px] rounded-b-3xl overflow-hidden bg-[#f5f0ea] border-2 border-[#e8ded4] shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80"
                  alt="Fine jewelry piece"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 via-transparent to-transparent opacity-40" />

                {/* Badge */}
                <div className="absolute bottom-5 inset-x-5 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#e8ded4] shadow-md flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#9c7936] font-semibold block">
                      Authenticity & Purity Guaranteed
                    </span>
                    <span className="text-xs font-serif font-semibold text-stone-900">
                      100% Hallmark Tested 21K, 22K & 24K Gold
                    </span>
                  </div>
                  <Award className="w-5 h-5 text-[#b48c48]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Convenience Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-3xl bg-white border border-[#ede5dc] shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#faf5ed] border border-[#ecd8b0] text-[#9c7936] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-900">Hallmark Certified</p>
              <p className="text-[11px] text-stone-500">21K, 22K & 24K Pure Gold</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#faf5ed] border border-[#ecd8b0] text-[#9c7936] shrink-0">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-900">Cash on Delivery</p>
              <p className="text-[11px] text-stone-500">Pay cash upon delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#faf5ed] border border-[#ecd8b0] text-[#9c7936] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-900">Nationwide Courier</p>
              <p className="text-[11px] text-stone-500">Insured express delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#faf5ed] border border-[#ecd8b0] text-[#9c7936] shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-900">Verified Jewelers</p>
              <p className="text-[11px] text-stone-500">Lahore, Karachi & Islamabad</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-1">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#9c7936]">
            Curated Collections
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 font-normal">
            Shop by Jewelry Style
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {displayCategories.map((cat: any) => (
            <Link
              key={cat.id || cat.name}
              href={`/jewelry?category=${encodeURIComponent(cat.name)}`}
              className="group relative h-56 rounded-2xl overflow-hidden bg-white border border-[#ede5dc] hover:border-[#b48c48] shadow-2xs hover:shadow-md transition-all p-4 flex flex-col justify-end"
            >
              <img
                src={cat.imageUrl || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80"}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/25 to-transparent" />
              <div className="relative z-10">
                <h3 className="text-sm font-serif font-medium text-white group-hover:text-[#ecd8b0] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-stone-200 mt-0.5 line-clamp-1">
                  {cat.description || cat.subtitle || "Fine jewelry creations"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Jewelry Pieces */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#ede5dc]">
          <div>
            <div className="flex items-center gap-2 text-[#9c7936] text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Live Marketplace Catalog
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-normal text-stone-900">
              Popular Jewelry Pieces
            </h2>
          </div>
          <Link
            href="/jewelry"
            className="text-xs font-medium text-[#826229] hover:text-[#5c441b] flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>View All Jewelry</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-3xl bg-white border border-[#ede5dc] text-center space-y-3">
            <Sparkles className="w-8 h-8 text-[#9c7936] mx-auto" />
            <h3 className="text-base font-serif font-medium text-stone-900">Catalog is currently empty</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              All mock items were cleared. Log into your seller dashboard or open a boutique to upload your own fine jewelry creations!
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link href="/shops/new" className="gold-btn px-5 py-2 rounded-full text-xs font-medium">
                Create Boutique
              </Link>
              <Link href="/dashboard/products/new" className="gold-outline-btn px-5 py-2 rounded-full text-xs font-medium">
                Upload Product
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Featured Shops */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#ede5dc]">
          <div>
            <div className="flex items-center gap-2 text-[#9c7936] text-xs font-semibold uppercase tracking-wider mb-1">
              <Store className="w-3.5 h-3.5" />
              Verified Heritage Houses
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-normal text-stone-900">
              Meet Independent Jewelry Designers
            </h2>
          </div>
          <Link
            href="/shops"
            className="text-xs font-medium text-[#826229] hover:text-[#5c441b] flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>View All Shops</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {featuredShops.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredShops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-3xl bg-white border border-[#ede5dc] text-center space-y-3">
            <Store className="w-8 h-8 text-stone-400 mx-auto" />
            <h3 className="text-base font-serif font-medium text-stone-900">No boutique shops yet</h3>
            <p className="text-xs text-stone-500">
              Establish the first atelier boutique on the Éternelle Gems marketplace.
            </p>
            <Link href="/shops/new" className="gold-btn px-5 py-2 rounded-full text-xs font-medium inline-block mt-2">
              Open a Boutique Shop
            </Link>
          </div>
        )}
      </section>

      {/* Multi-Vendor Marketplace Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#f5f0ea] border border-[#ede5dc] relative overflow-hidden shadow-xs">
          <div className="max-w-2xl space-y-3.5">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#9c7936]">
              Nationwide Multi-Vendor Marketplace
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-normal text-stone-900">
              One Cart. Direct Delivery from Verified Jewellers.
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Order a custom diamond solitaire from Lahore and a pure 22K gold bridal set from Karachi in a single order. Each jeweler dispatches directly in insured, tamper-proof security packaging with Cash on Delivery (COD) across Karachi, Lahore, Islamabad, and all cities nationwide.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link href="/jewelry" className="gold-btn px-6 py-2.5 rounded-full text-xs font-medium">
                Browse Collection
              </Link>
              <Link href="/shops/new" className="gold-outline-btn px-6 py-2.5 rounded-full text-xs font-medium">
                Open a Jewelry Shop
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
