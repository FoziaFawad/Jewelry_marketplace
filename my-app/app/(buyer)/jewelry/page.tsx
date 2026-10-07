import React, { Suspense } from "react";
import { FilterSidebar } from "@/components/marketplace/FilterSidebar";
import { ProductCard } from "@/components/jewelry/ProductCard";
import { SearchBar } from "@/components/marketplace/SearchBar";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { Sparkles, Gem } from "lucide-react";

interface PageProps {
  searchParams: Promise<{
    category?: string;
    metalType?: string;
    metalPurity?: string;
    gemstoneType?: string;
    minPrice?: string;
    maxPrice?: string;
    minCarat?: string;
    certifiedOnly?: string;
    sortBy?: string;
    query?: string;
  }>;
}

async function JewelryCatalogContent({ searchParams }: PageProps) {
  const filters = await searchParams;

  let products = [...MOCK_PRODUCTS];

  // 1. Text Query Filter
  if (filters.query) {
    const q = filters.query.toLowerCase();
    products = products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.metalType.toLowerCase().includes(q) ||
        (p.gemstoneType && p.gemstoneType.toLowerCase().includes(q)) ||
        (p.shop && p.shop.name.toLowerCase().includes(q))
    );
  }

  // 2. Category Filter
  if (filters.category && filters.category !== "All") {
    products = products.filter(
      (p) => p.category.toLowerCase() === filters.category?.toLowerCase()
    );
  }

  // 3. Metal Type Filter
  if (filters.metalType && filters.metalType !== "All") {
    products = products.filter((p) =>
      p.metalType.toLowerCase().includes(filters.metalType!.toLowerCase())
    );
  }

  // 4. Gemstone Filter
  if (filters.gemstoneType && filters.gemstoneType !== "All") {
    products = products.filter(
      (p) => p.gemstoneType?.toLowerCase() === filters.gemstoneType?.toLowerCase()
    );
  }

  // 5. Price Filter
  if (filters.minPrice) {
    const min = parseFloat(filters.minPrice);
    if (!isNaN(min)) products = products.filter((p) => p.price >= min);
  }
  if (filters.maxPrice) {
    const max = parseFloat(filters.maxPrice);
    if (!isNaN(max)) products = products.filter((p) => p.price <= max);
  }

  // 6. Carat Filter
  if (filters.minCarat) {
    const carat = parseFloat(filters.minCarat);
    if (!isNaN(carat)) products = products.filter((p) => (p.caratWeight || 0) >= carat);
  }

  // 7. Certified Only
  if (filters.certifiedOnly === "true") {
    products = products.filter((p) => p.certifiedBy && p.certifiedBy !== "None");
  }

  // 8. Sorting
  if (filters.sortBy === "price-asc") {
    products.sort((a, b) => a.price - b.price);
  } else if (filters.sortBy === "price-desc") {
    products.sort((a, b) => b.price - a.price);
  } else if (filters.sortBy === "carat-desc") {
    products.sort((a, b) => (b.caratWeight || 0) - (a.caratWeight || 0));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#ede5dc]">
        <div>
          <div className="flex items-center gap-2 text-[#9c7936] text-xs font-semibold uppercase tracking-widest mb-1">
            <Gem className="w-4 h-4" />
            Eternelle Gems Catalog
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-normal text-stone-900">
            Fine Jewelry & Certified Gemstones
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-2">
            Filtered across precious metals, GIA/IGI laboratory certifications, and independent ateliers.
          </p>
        </div>

        <div className="w-full md:w-80">
          <SearchBar initialQuery={filters.query || ""} placeholder="Search jewels..." />
        </div>
      </div>

      {/* Main Layout: Filter Sidebar + Products Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar */}
        <Suspense fallback={<div className="w-full lg:w-72 h-96 bg-white rounded-2xl border border-[#ede5dc] animate-pulse" />}>
          <FilterSidebar />
        </Suspense>

        {/* Catalog Results */}
        <div className="flex-1 w-full space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500 px-1">
            <span>
              Showing <strong className="text-stone-900">{products.length}</strong> authenticated jewelry creations
            </span>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 rounded-3xl bg-white border border-[#ede5dc] p-8 space-y-3 shadow-2xs">
              <Sparkles className="w-8 h-8 text-[#b48c48] mx-auto" />
              <h3 className="text-base font-serif font-medium text-stone-900">No jewels match current filters</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Try widening your price range or clearing metal or carat constraints to discover available creations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function JewelryCatalogPage({ searchParams }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="h-8 w-64 bg-stone-200 rounded-lg mx-auto animate-pulse mb-4" />
          <div className="h-4 w-96 bg-stone-100 rounded mx-auto animate-pulse" />
        </div>
      }
    >
      <JewelryCatalogContent searchParams={searchParams} />
    </Suspense>
  );
}
