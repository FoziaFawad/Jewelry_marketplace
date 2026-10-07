import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MOCK_SHOPS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ArrowLeft, Gem, Award, History, CheckCircle } from "lucide-react";

export function generateStaticParams() {
  return MOCK_SHOPS.map((s) => ({ slug: s.slug }));
}

export default async function ShopAboutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const shop = MOCK_SHOPS.find((s) => s.slug === slug);

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
          {shop.description}
        </p>
      </div>

      {/* Atelier Craftsmanship Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-white border border-[#ede5dc] space-y-3 shadow-2xs">
          <History className="w-5 h-5 text-[#b48c48]" />
          <h3 className="text-sm font-serif font-semibold text-stone-900">Heritage & Provenance</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Founded in {shop.establishedYear || 2018} with roots in {shop.location || "Europe"}, passing master metalwork and micro-pave setting across generations.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#ede5dc] space-y-3 shadow-2xs">
          <Gem className="w-5 h-5 text-[#b48c48]" />
          <h3 className="text-sm font-serif font-semibold text-stone-900">Ethical Diamond Sourcing</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Committed to 100% Kimberley Process certified rough diamonds and conflict-free traceable colored gemstones.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#ede5dc] space-y-3 shadow-2xs">
          <Award className="w-5 h-5 text-[#b48c48]" />
          <h3 className="text-sm font-serif font-semibold text-stone-900">Independent Certification</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Every creation exceeding 1.0 carat carries GIA or IGI certificates alongside custom insurance replacement appraisals.
          </p>
        </div>
      </div>

      {/* Trust & Guarantee */}
      <div className="p-7 rounded-3xl bg-[#f5f0ea] border border-[#ede5dc] space-y-3.5">
        <h3 className="text-sm font-serif font-semibold text-stone-900">Eternelle Gems Guarantee</h3>
        <ul className="space-y-2.5 text-xs text-stone-700">
          <li className="flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Funds held safely in escrow until you receive and inspect your jewelry piece.</span>
          </li>
          <li className="flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Complimentary 30-day ring sizing and lifetime cleaning warranty.</span>
          </li>
          <li className="flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Fully insured armored courier transit with discrete signature delivery.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
