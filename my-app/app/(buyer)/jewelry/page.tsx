import React, { Suspense } from "react";
import prisma from "@/lib/prisma";
import { FilterSidebar } from "@/components/marketplace/FilterSidebar";
import { ProductCard } from "@/components/jewelry/ProductCard";
import { SearchBar } from "@/components/marketplace/SearchBar";
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

  const where: any = {
    isBanned: false,
    shop: { status: "ACTIVE" },
  };

  // 1. Text Query
  if (filters.query) {
    const q = filters.query.trim();
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { metalType: { contains: q, mode: "insensitive" } },
      { gemstoneType: { contains: q, mode: "insensitive" } },
      { shop: { name: { contains: q, mode: "insensitive" } } },
    ];
  }

  // 2. Category
  if (filters.category && filters.category !== "All") {
    where.category = { equals: filters.category, mode: "insensitive" };
  }

  // 3. Metal Type
  if (filters.metalType && filters.metalType !== "All") {
    where.metalType = { contains: filters.metalType, mode: "insensitive" };
  }

  // 4. Gemstone Type
  if (filters.gemstoneType && filters.gemstoneType !== "All") {
    where.gemstoneType = { equals: filters.gemstoneType, mode: "insensitive" };
  }

  // 5. Price
  if (filters.minPrice || filters.maxPrice) {
    where.price = {};
    if (filters.minPrice) where.price.gte = parseFloat(filters.minPrice);
    if (filters.maxPrice) where.price.lte = parseFloat(filters.maxPrice);
  }

  // 6. Carat
  if (filters.minCarat) {
    const minCarat = parseFloat(filters.minCarat);
    if (!isNaN(minCarat)) {
      where.caratWeight = { gte: minCarat };
    }
  }

  // 7. Certified Only
  if (filters.certifiedOnly === "true") {
    where.certifiedBy = { not: null, notIn: ["None", ""] };
  }

  // Sorting
  let orderBy: any = { createdAt: "desc" };
  if (filters.sortBy === "price-asc") {
    orderBy = { price: "asc" };
  } else if (filters.sortBy === "price-desc") {
    orderBy = { price: "desc" };
  } else if (filters.sortBy === "carat-desc") {
    orderBy = { caratWeight: "desc" };
  }

  const dbProducts = await prisma.product.findMany({
    where,
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
    orderBy,
  }).catch(() => []);

  const products: any[] = dbProducts.map((p) => ({
    ...p,
    price: Number(p.price),
    caratWeight: p.caratWeight ? Number(p.caratWeight) : undefined,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#ede5dc]">
        <div>
          <div className="flex items-center gap-2 text-[#9c7936] text-xs font-semibold uppercase tracking-wider mb-1">
            <Gem className="w-4 h-4" />
            Jewelry Collection
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-normal text-stone-900">
            {filters.category && filters.category !== "All"
              ? `${filters.category} Collection`
              : "All Fine Jewelry"}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-xl">
            Explore certified solitaires, 21K and 22K bridal jewellery, and royal handcrafted designs from verified ateliers.
          </p>
        </div>

        <div className="w-full md:w-80">
          <SearchBar placeholder="Filter current view..." />
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <FilterSidebar />

        <main className="flex-1 w-full space-y-6">
          <div className="flex items-center justify-between text-xs text-stone-600 pb-2">
            <span>
              Showing <strong className="text-stone-900">{products.length}</strong> fine creations
            </span>
            {filters.category && filters.category !== "All" && (
              <span className="text-[#826229] font-medium">Filtered by: {filters.category}</span>
            )}
          </div>

          {products.length === 0 ? (
            <div className="p-16 rounded-3xl bg-white border border-[#ede5dc] text-center space-y-3">
              <Sparkles className="w-8 h-8 text-[#9c7936] mx-auto" />
              <h3 className="text-base font-serif font-medium text-stone-900">
                No jewelry pieces found
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                No items match your active filters. Try broadening your criteria or search term.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function JewelryCatalogPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-stone-500">Loading catalog...</div>}>
      <JewelryCatalogContent searchParams={searchParams} />
    </Suspense>
  );
}
