import React from "react";
import Link from "next/link";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { formatCurrency, formatCarat } from "@/lib/utils";
import { MetalBadge } from "@/components/jewelry/MetalBadge";
import { PlusCircle, Edit3, Eye } from "lucide-react";

export default function VendorProductsPage() {
  const vendorProducts = MOCK_PRODUCTS.filter((p) => p.shopId === "shop_aurora_01");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ede5dc]">
        <div>
          <h1 className="text-2xl font-serif font-normal text-stone-900">
            Fine Jewelry Inventory
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage your atelier catalog, metal hallmarks, carat specifications, and certifications.
          </p>
        </div>

        <Link
          href="/dashboard/products/new"
          className="gold-btn px-5 py-2.5 rounded-full text-xs font-medium flex items-center gap-2 self-start sm:self-auto shadow-2xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Creation</span>
        </Link>
      </div>

      {/* Inventory Table */}
      <div className="overflow-x-auto rounded-3xl bg-white border border-[#ede5dc] shadow-2xs">
        <table className="w-full text-left text-xs text-stone-700">
          <thead className="bg-[#faf8f5] uppercase tracking-wider text-[11px] text-stone-500 border-b border-[#ede5dc]">
            <tr>
              <th className="py-4 px-5">Creation / Spec</th>
              <th className="py-4 px-5">Category</th>
              <th className="py-4 px-5">Metal & Hallmark</th>
              <th className="py-4 px-5">Gemstone / Carat</th>
              <th className="py-4 px-5">Price</th>
              <th className="py-4 px-5">In Stock</th>
              <th className="py-4 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ede5dc] font-medium">
            {vendorProducts.map((p) => (
              <tr key={p.id} className="hover:bg-[#faf8f5]/60 transition-colors">
                <td className="py-4 px-5">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="w-10 h-10 rounded-xl object-cover border border-[#e8ded4] shrink-0"
                    />
                    <div>
                      <span className="font-serif font-medium text-stone-900 block max-w-xs truncate">
                        {p.title}
                      </span>
                      <span className="text-[10px] text-[#826229]">
                        {p.certifiedBy && p.certifiedBy !== "None" ? `${p.certifiedBy} Certified` : "Atelier Hallmarked"}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-5 whitespace-nowrap text-stone-600">
                  {p.category}
                </td>
                <td className="py-4 px-5 whitespace-nowrap">
                  <MetalBadge metalType={p.metalType} purity={p.metalPurity} />
                </td>
                <td className="py-4 px-5 whitespace-nowrap">
                  <span className="text-stone-800">
                    {p.gemstoneType || "None"}
                  </span>
                  {p.caratWeight && (
                    <span className="text-[11px] text-[#826229] block">
                      {formatCarat(p.caratWeight)}
                    </span>
                  )}
                </td>
                <td className="py-4 px-5 whitespace-nowrap font-semibold text-stone-900">
                  {formatCurrency(p.price)}
                </td>
                <td className="py-4 px-5 whitespace-nowrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#faf6f0] border border-[#e8ded4] text-[10px] text-stone-700">
                    {p.stock} units
                  </span>
                </td>
                <td className="py-4 px-5 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/jewelry/${p.id}`}
                      target="_blank"
                      className="p-1.5 rounded-lg bg-[#faf6f0] hover:text-[#9c7936] text-stone-600 transition-colors border border-[#e8ded4]"
                      title="View on Storefront"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      className="p-1.5 rounded-lg bg-[#faf6f0] hover:text-stone-950 text-stone-600 transition-colors border border-[#e8ded4]"
                      title="Edit Piece"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
