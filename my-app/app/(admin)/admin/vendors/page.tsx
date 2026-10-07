"use client";

import React, { useState } from "react";
import { MOCK_SHOPS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";

export default function AdminVendorsPage() {
  const [shops, setShops] = useState(MOCK_SHOPS);

  const toggleStatus = (id: string, newStatus: "ACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED") => {
    setShops((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-[#ede5dc]">
        <h1 className="text-2xl font-serif font-bold text-stone-900">
          Atelier KYC & Marketplace Governance
        </h1>
        <p className="text-xs text-[#78716c] mt-1">
          Review business registration licenses, ethical diamond Kimberley compliance, and approve Stripe Connect accounts.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#ede5dc] shadow-xs text-xs">
          <span className="text-[#78716c] block">Verified Ateliers</span>
          <span className="text-2xl font-serif font-bold text-emerald-700 mt-1 block">3 Active</span>
          <span className="text-[11px] text-[#a8a29e]">Live on Eternelle Gems boutique</span>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-[#ede5dc] shadow-xs text-xs">
          <span className="text-[#78716c] block">Pending KYC Review</span>
          <span className="text-2xl font-serif font-bold text-[#b48c48] mt-1 block">1 Pending</span>
          <span className="text-[11px] text-[#a8a29e]">Solitaire Guild (UK)</span>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-[#ede5dc] shadow-xs text-xs">
          <span className="text-[#78716c] block">Suspended Stores</span>
          <span className="text-2xl font-serif font-bold text-stone-400 mt-1 block">0 Suspended</span>
          <span className="text-[11px] text-[#a8a29e]">Zero infractions</span>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="overflow-x-auto rounded-2xl bg-white border border-[#ede5dc] shadow-xs">
        <table className="w-full text-left text-xs text-stone-700">
          <thead className="bg-[#faf8f5] uppercase tracking-wider text-[11px] text-stone-500 border-b border-[#ede5dc]">
            <tr>
              <th className="py-3.5 px-4">Boutique Atelier</th>
              <th className="py-3.5 px-4">Location / Founded</th>
              <th className="py-3.5 px-4">KYC Documents</th>
              <th className="py-3.5 px-4">Stripe Connect ID</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Governance Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ede5dc] font-medium">
            {shops.map((s) => (
              <tr key={s.id} className="hover:bg-[#faf8f5]/60 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={s.logoUrl || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=100&q=80"}
                      alt={s.name}
                      className="w-9 h-9 rounded-lg object-cover border border-[#ede5dc] shrink-0"
                    />
                    <div>
                      <span className="font-semibold text-stone-900 block">{s.name}</span>
                      <span className="text-[10px] text-[#78716c]">{s.slug}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-stone-700">
                  <span>{s.location || "Europe"}</span>
                  <span className="text-[10px] text-[#a8a29e] block">Est. {s.establishedYear}</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> Assay & Kimberley Verified
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono text-[11px] text-stone-700">
                  {s.stripeAccountId ? (
                    <span className="text-emerald-700 font-semibold">{s.stripeAccountId}</span>
                  ) : (
                    <span className="text-[#b48c48]">Onboarding pending</span>
                  )}
                </td>
                <td className="py-3.5 px-4">
                  {s.status === "ACTIVE" ? (
                    <Badge variant="success" className="text-[10px]">
                      Verified Active
                    </Badge>
                  ) : s.status === "PENDING_VERIFICATION" ? (
                    <Badge variant="warning" className="text-[10px]">
                      Pending Review
                    </Badge>
                  ) : (
                    <Badge variant="ruby" className="text-[10px]">
                      Suspended
                    </Badge>
                  )}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {s.status !== "ACTIVE" && (
                      <button
                        type="button"
                        onClick={() => toggleStatus(s.id, "ACTIVE")}
                        className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 text-[11px] font-semibold transition-colors"
                      >
                        Approve
                      </button>
                    )}
                    {s.status === "ACTIVE" && (
                      <button
                        type="button"
                        onClick={() => toggleStatus(s.id, "SUSPENDED")}
                        className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-[11px] font-semibold transition-colors"
                      >
                        Suspend
                      </button>
                    )}
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
