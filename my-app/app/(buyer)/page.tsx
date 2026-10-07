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
    <div className="space-y-24 pb-24">
      {/* Hero Section Inspired by Editorial Atelier Craftsmanship */}
      <section className="relative pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial Headline & Search */}
          <div className="lg:col-span-7 space-y-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f5f0ea] border border-[#e8ded4] text-stone-700 text-xs font-medium tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#b48c48]" />
              <span>Eternelle Gems • Haute Joaillerie</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl font-serif font-normal text-stone-900 tracking-tight leading-[1.12]">
                Faithful to the <br />
                <span className="italic font-serif">principles of fine</span> <br />
                craftsmanship.
              </h1>

              <p className="text-sm sm:text-base text-stone-600 max-w-xl leading-relaxed">
                A curated marketplace connecting collectors with master European goldsmiths, ethical diamond lapidaries, and certified gemstone ateliers.
              </p>
            </div>

            {/* Search Bar */}
            <div className="pt-2 max-w-xl">
              <SearchBar placeholder="Search solitaire diamonds, 18K necklaces, emeralds..." />
            </div>

            {/* Curated Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-stone-600 font-medium">Curated:</span>
              {[
                { label: "Solitaire Diamonds", href: "/jewelry?gemstoneType=Diamond" },
                { label: "18K Gold Chokers", href: "/jewelry?metalType=Gold" },
                { label: "Royal Emeralds", href: "/jewelry?gemstoneType=Emerald" },
                { label: "GIA Certified", href: "/jewelry?certifiedOnly=true" },
              ].map((tag) => (
                <Link
                  key={tag.label}
                  href={tag.href}
                  className="px-3.5 py-1 rounded-full bg-white border border-[#e8ded4] text-stone-700 hover:border-[#b48c48] hover:text-[#826229] transition-colors shadow-2xs"
                >
                  {tag.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column: Arched Fine Craft Visual */}
          <div className="lg:col-span-5 relative">
            {/* Fine decorative geometric motifs inspired by Verena reference */}
            <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full border border-[#ded5cb] pointer-events-none opacity-60" />
            <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full border border-[#ded5cb] pointer-events-none opacity-60" />

            <div className="relative mx-auto max-w-sm">
              {/* Arched Framed Image */}
              <div className="relative h-[440px] w-full rounded-t-[180px] rounded-b-3xl overflow-hidden bg-[#f5f0ea] border-2 border-[#e8ded4] shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80"
                  alt="Fine jewelry craftsmanship"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 via-transparent to-transparent opacity-40" />

                {/* Floating Atelier Hallmarking Badge */}
                <div className="absolute bottom-5 inset-x-5 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#e8ded4] shadow-md flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#9c7936] font-semibold block">
                      Certified Atelier
                    </span>
                    <span className="text-xs font-serif font-semibold text-stone-900">
                      Geneva & Milan Hallmarks
                    </span>
                  </div>
                  <Award className="w-5 h-5 text-[#b48c48]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Row with Arched Aesthetic */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#9c7936]">
            Curated Categories
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 font-normal">
            Mastery Across Precious Forms
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            {
              title: "Solitaire & Bridal",
              subtitle: "GIA Certified Diamonds",
              image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80",
              href: "/jewelry?category=Rings",
            },
            {
              title: "Fine Necklaces",
              subtitle: "Emerald & 18K Chains",
              image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
              href: "/jewelry?category=Necklaces",
            },
            {
              title: "Tennis Bracelets",
              subtitle: "950 Platinum Settings",
              image: "https://images.unsplash.com/photo-1611591475819-bf91696b96b2?auto=format&fit=crop&w=600&q=80",
              href: "/jewelry?category=Bracelets",
            },
            {
              title: "Precious Earrings",
              subtitle: "Sapphires & Pearls",
              image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80",
              href: "/jewelry?category=Earrings",
            },
          ].map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="group relative h-56 rounded-2xl overflow-hidden bg-white border border-[#ede5dc] hover:border-[#b48c48] shadow-2xs hover:shadow-md transition-all p-4 flex flex-col justify-end"
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#ede5dc]">
          <div>
            <div className="flex items-center gap-2 text-[#9c7936] text-xs font-semibold uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Curated Masterpieces
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-normal text-stone-900">
              Signature Atelier Jewels
            </h2>
          </div>
          <Link
            href="/jewelry"
            className="text-xs font-medium text-[#826229] hover:text-[#5c441b] flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Explore Entire Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Featured Artisan Boutiques */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#ede5dc]">
          <div>
            <div className="flex items-center gap-2 text-[#9c7936] text-xs font-semibold uppercase tracking-widest mb-1">
              <Store className="w-3.5 h-3.5" />
              Independent Ateliers
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-normal text-stone-900">
              Meet Master Goldsmiths & Gemologists
            </h2>
          </div>
          <Link
            href="/shops"
            className="text-xs font-medium text-[#826229] hover:text-[#5c441b] flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>View All Ateliers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredShops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      </section>

      {/* Multi-Vendor Marketplace Split Architecture Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-14 rounded-3xl bg-[#f5f0ea] border border-[#ede5dc] relative overflow-hidden shadow-xs">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#9c7936]">
              Multi-Vendor Marketplace Infrastructure
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-normal text-stone-900">
              One Unified Basket. Direct Atelier Payouts.
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Acquire a bespoke engagement ring from Geneva and an emerald choker from Milan in a single transaction. Our automated Stripe Connect architecture partitions discrete SubOrders, calculates the 10% platform commission, and directly remits funds to independent ateliers.
            </p>
            <div className="pt-3 flex flex-wrap gap-4">
              <Link href="/jewelry" className="gold-btn px-6 py-2.5 rounded-full text-xs font-medium">
                Start Curating
              </Link>
              <Link href="/register?role=VENDOR" className="gold-outline-btn px-6 py-2.5 rounded-full text-xs font-medium">
                Apply as an Atelier Vendor
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
