"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

const CATEGORIES = ["All", "Rings", "Necklaces", "Bracelets", "Earrings"];
const METAL_TYPES = ["All", "Gold", "White Gold", "Rose Gold", "Platinum", "Silver"];
const GEMSTONES = ["All", "Diamond", "Emerald", "Sapphire", "Ruby", "Pearl", "Opal"];

export function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "All";
  const currentMetal = searchParams.get("metalType") || "All";
  const currentGemstone = searchParams.get("gemstoneType") || "All";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const currentMinCarat = searchParams.get("minCarat") || "";
  const currentCertified = searchParams.get("certifiedOnly") === "true";
  const currentSort = searchParams.get("sortBy") || "newest";

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "All" && value !== "") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/jewelry?${params.toString()}`);
  };

  const handleReset = () => {
    router.push("/jewelry");
  };

  return (
    <aside className="w-full lg:w-72 space-y-6 bg-white p-6 rounded-2xl border border-[#ede5dc] shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#ede5dc]">
        <div className="flex items-center gap-2 text-stone-900 font-serif font-semibold text-sm">
          <SlidersHorizontal className="w-4 h-4 text-[#9c7936]" />
          <span>Refine Catalog</span>
        </div>
        <button
          onClick={handleReset}
          className="text-xs text-stone-400 hover:text-[#9c7936] flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Sort By */}
      <div className="space-y-2">
        <label className="text-xs uppercase font-medium tracking-wider text-stone-500">
          Sort By
        </label>
        <select
          value={currentSort}
          onChange={(e) => updateParam("sortBy", e.target.value)}
          className="w-full bg-[#fbf9f6] border border-[#dcd1c4] rounded-lg px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-[#b48c48]"
        >
          <option value="newest">Featured & Curated</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="carat-desc">Highest Carat Weight</option>
        </select>
      </div>

      {/* Category Filter */}
      <div className="space-y-2.5">
        <label className="text-xs uppercase font-medium tracking-wider text-stone-500">
          Jewelry Category
        </label>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => updateParam("category", cat)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                currentCategory === cat
                  ? "bg-[#faf5ed] text-[#826229] border-[#d8be89] font-medium shadow-2xs"
                  : "bg-white text-stone-600 border-[#e8ded4] hover:border-[#c9b18c] hover:text-stone-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Metal Type Filter */}
      <div className="space-y-2.5">
        <label className="text-xs uppercase font-medium tracking-wider text-stone-500">
          Precious Metal
        </label>
        <div className="flex flex-wrap gap-1.5">
          {METAL_TYPES.map((metal) => (
            <button
              key={metal}
              onClick={() => updateParam("metalType", metal)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                currentMetal === metal
                  ? "bg-[#faf5ed] text-[#826229] border-[#d8be89] font-medium shadow-2xs"
                  : "bg-white text-stone-600 border-[#e8ded4] hover:border-[#c9b18c] hover:text-stone-900"
              }`}
            >
              {metal}
            </button>
          ))}
        </div>
      </div>

      {/* Gemstone Filter */}
      <div className="space-y-2.5">
        <label className="text-xs uppercase font-medium tracking-wider text-stone-500">
          Center Gemstone
        </label>
        <div className="flex flex-wrap gap-1.5">
          {GEMSTONES.map((gem) => (
            <button
              key={gem}
              onClick={() => updateParam("gemstoneType", gem)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                currentGemstone === gem
                  ? "bg-[#faf5ed] text-[#826229] border-[#d8be89] font-medium shadow-2xs"
                  : "bg-white text-stone-600 border-[#e8ded4] hover:border-[#c9b18c] hover:text-stone-900"
              }`}
            >
              {gem}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-2.5">
        <label className="text-xs uppercase font-medium tracking-wider text-stone-500">
          Price Range ($ USD)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min $"
            value={currentMinPrice}
            onChange={(e) => updateParam("minPrice", e.target.value)}
            className="bg-[#fbf9f6] border border-[#dcd1c4] rounded-lg px-2.5 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#b48c48]"
          />
          <input
            type="number"
            placeholder="Max $"
            value={currentMaxPrice}
            onChange={(e) => updateParam("maxPrice", e.target.value)}
            className="bg-[#fbf9f6] border border-[#dcd1c4] rounded-lg px-2.5 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#b48c48]"
          />
        </div>
      </div>

      {/* Minimum Carat */}
      <div className="space-y-2.5">
        <label className="text-xs uppercase font-medium tracking-wider text-stone-500">
          Minimum Carat Weight
        </label>
        <div className="flex items-center gap-2">
          {[1.0, 2.0, 3.0, 5.0].map((c) => (
            <button
              key={c}
              onClick={() =>
                updateParam("minCarat", currentMinCarat === c.toString() ? null : c.toString())
              }
              className={`flex-1 text-xs py-1.5 rounded-full border transition-all ${
                currentMinCarat === c.toString()
                  ? "bg-[#faf5ed] text-[#826229] border-[#d8be89] font-medium shadow-2xs"
                  : "bg-white text-stone-600 border-[#e8ded4] hover:border-[#c9b18c]"
              }`}
            >
              {c}+ ct
            </button>
          ))}
        </div>
      </div>

      {/* Certified Only Toggle */}
      <div className="pt-3 border-t border-[#ede5dc]">
        <label className="flex items-center gap-2.5 cursor-pointer text-xs text-stone-700 hover:text-stone-950 transition-colors">
          <input
            type="checkbox"
            checked={currentCertified}
            onChange={(e) =>
              updateParam("certifiedOnly", e.target.checked ? "true" : null)
            }
            className="rounded border-[#dcd1c4] text-[#b48c48] focus:ring-0 focus:ring-offset-0 h-4 w-4"
          />
          <span>GIA / IGI Certified Only</span>
        </label>
      </div>
    </aside>
  );
}
