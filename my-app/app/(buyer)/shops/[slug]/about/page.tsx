import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ArrowLeft, Gem, Award, History, CheckCircle } from "lucide-react";

export default async function ShopAboutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const shop = await prisma.shop.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
    },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  if (!shop) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Back Link */}
      <Link
        href={`/shops/${shop.slug}`}
        className="inline-flex items-center gap-2 text-xs font-medium text-[#826229] hover:text-[#5c441b] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to {shop.name} Collection
      </Link>

      {/* Header */}
      <div className="space-y-4">
        <Badge variant="gold" className="text-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-[#9c7936]" />
          Master Goldsmith & Certified Atelier
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-serif font-normal text-stone-900">
          About {shop.name}
        </h1>
        <p className="text-sm text-stone-600 leading-relaxed">
          {shop.description || "Master jewelry atelier showcasing bespoke handcrafted fine jewelry, certified solitaires, and royal bridal collections."}
        </p>
      </div>

      {/* Atelier Craftsmanship Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-white border border-[#ede5dc] space-y-3 shadow-2xs">
          <History className="w-5 h-5 text-[#b48c48]" />
          <h3 className="text-sm font-serif font-semibold text-stone-900">Heritage & Provenance</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Preserving master goldsmithing traditions with hand-selected gemstones and authentic Pakistani bridal heritage.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#ede5dc] space-y-3 shadow-2xs">
          <Gem className="w-5 h-5 text-[#b48c48]" />
          <h3 className="text-sm font-serif font-semibold text-stone-900">Conflict-Free Stones</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            All center diamonds and colored gems adhere to the Kimberley Process and GIA/IGI grading standards.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#ede5dc] space-y-3 shadow-2xs">
          <Award className="w-5 h-5 text-[#b48c48]" />
          <h3 className="text-sm font-serif font-semibold text-stone-900">Official Hallmarks</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Laser-engraved karat purity stamps (21K, 22K, 24K, 950 Plat) with rigorous laboratory gold assay.
          </p>
        </div>
      </div>

      {/* Inventory CTA */}
      <div className="p-8 rounded-3xl bg-[#faf5ed] border border-[#ecd8b0] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-serif font-semibold text-stone-900">
            Explore {shop.name}&apos;s Creations
          </h3>
          <p className="text-xs text-stone-600 mt-1">
            Browse currently available handcrafted pieces ready for insured delivery.
          </p>
        </div>
        <Link
          href={`/shops/${shop.slug}`}
          className="gold-btn px-6 py-2.5 rounded-full text-xs font-semibold shrink-0 shadow-2xs"
        >
          View Collection ({shop._count.products})
        </Link>
      </div>
    </div>
  );
}
