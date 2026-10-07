import React from "react";
import Link from "next/link";
import { SearchBar } from "@/components/marketplace/SearchBar";
import { ProductCard } from "@/components/jewelry/ProductCard";
import { ShopCard } from "@/components/marketplace/ShopCard";
import { MOCK_PRODUCTS, MOCK_SHOPS } from "@/lib/mock-data";
import { Sparkles, ArrowRight, Store, Award } from "lucide-react";

export default function MallLandingPage() {
  const featuredProducts = MOCK_PRODUCTS.slice(0, 4);
  const featuredShops = MOCK_SHOPS;

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & Search */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f5f0ea] border border-[#e8ded4] text-stone-700 text-xs font-medium tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-[#b48c48]" />
              <span>Certified Fine Jewelry & Trusted Artisans</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl font-serif text-stone-900 tracking-tight leading-[1.15]">
                Fine jewelry, <br />
                <span className="italic font-serif">handcrafted</span> with care.
              </h1>

              <p className="text-sm sm:text-base text-stone-600 max-w-xl leading-relaxed">
                Discover engagement rings, solid gold necklaces, and certified gemstone pieces from verified independent jewelers worldwide.
              </p>
            </div>

            {/* Search Bar */}
            <div className="pt-1 max-w-xl">
              <SearchBar placeholder="Search diamond rings, gold necklaces, earrings..." />
            </div>

            {/* Curated Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-stone-500 font-medium">Popular:</span>
              {[
                { label: "Diamond Rings", href: "/jewelry?gemstoneType=Diamond" },
                { label: "18K Gold", href: "/jewelry?metalType=Gold" },
                { label: "Emeralds", href: "/jewelry?gemstoneType=Emerald" },
                { label: "Certified Stones", href: "/jewelry?certifiedOnly=true" },
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
                      Authenticity Guaranteed
                    </span>
                    <span className="text-xs font-serif font-semibold text-stone-900">
                      100% Certified Precious Metals & Gems
                    </span>
                  </div>
                  <Award className="w-5 h-5 text-[#b48c48]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-1">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#9c7936]">
            Categories
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 font-normal">
            Shop by Jewelry Style
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            {
              title: "Engagement & Rings",
              subtitle: "Solitaire, Bands & Gemstones",
              image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80",
              href: "/jewelry?category=Rings",
            },
            {
              title: "Necklaces & Pendants",
              subtitle: "Gold Chains, Chokers & Pearls",
              image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
              href: "/jewelry?category=Necklaces",
            },
            {
              title: "Bracelets & Cuffs",
              subtitle: "Diamond Tennis & Solid Gold",
              image: "https://images.unsplash.com/photo-1611591475819-bf91696b96b2?auto=format&fit=crop&w=600&q=80",
              href: "/jewelry?category=Bracelets",
            },
            {
              title: "Earrings",
              subtitle: "Studs, Drops & Hoops",
              image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80",
              href: "/jewelry?category=Earrings",
            },
          ].map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="group relative h-52 rounded-2xl overflow-hidden bg-white border border-[#ede5dc] hover:border-[#b48c48] shadow-2xs hover:shadow-md transition-all p-4 flex flex-col justify-end"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/20 to-transparent" />
              <div className="relative z-10">
                <h3 className="text-sm font-serif font-medium text-white group-hover:text-[#ecd8b0] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-[11px] text-stone-200">{cat.subtitle}</p>
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
              Featured Collection
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Featured Shops */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#ede5dc]">
          <div>
            <div className="flex items-center gap-2 text-[#9c7936] text-xs font-semibold uppercase tracking-wider mb-1">
              <Store className="w-3.5 h-3.5" />
              Verified Sellers
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredShops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      </section>

      {/* Multi-Vendor Marketplace Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#f5f0ea] border border-[#ede5dc] relative overflow-hidden shadow-xs">
          <div className="max-w-2xl space-y-3.5">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#9c7936]">
              Shop Multiple Designers in One Place
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-normal text-stone-900">
              One Cart. Direct Delivery from Verified Sellers.
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Order a custom engagement ring from one jeweler and a diamond necklace from another in a single checkout. Each seller receives their portion of the order and ships directly to your address with insured tracking.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link href="/jewelry" className="gold-btn px-6 py-2.5 rounded-full text-xs font-medium">
                Browse Collection
              </Link>
              <Link href="/register?role=VENDOR" className="gold-outline-btn px-6 py-2.5 rounded-full text-xs font-medium">
                Open a Jewelry Shop
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
