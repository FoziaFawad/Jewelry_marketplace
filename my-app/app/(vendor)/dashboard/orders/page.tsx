import React from "react";
import { OrderTable } from "@/components/vendor/OrderTable";
import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function VendorOrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ede5dc]">
        <div>
          <h1 className="text-2xl font-serif font-normal text-stone-900">
            Order Fulfillment & Courier Dispatch
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Dispatch jewelry with insured armored tracking. Funds release from escrow automatically upon client delivery confirmation.
          </p>
        </div>

        <Badge variant="gold" className="text-xs self-start sm:self-auto">
          <ShieldCheck className="w-3.5 h-3.5 text-[#9c7936]" />
          Escrow Protected Splits
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-3xl bg-white border border-[#ede5dc] shadow-2xs text-xs">
          <span className="text-stone-500 block">Awaiting Dispatch</span>
          <span className="text-xl font-serif font-semibold text-[#826229] mt-1 block">1 Piece</span>
          <span className="text-[11px] text-stone-400">Requires armored tracking code</span>
        </div>
        <div className="p-5 rounded-3xl bg-white border border-[#ede5dc] shadow-2xs text-xs">
          <span className="text-stone-500 block">In Courier Transit</span>
          <span className="text-xl font-serif font-semibold text-stone-900 mt-1 block">1 Piece</span>
          <span className="text-[11px] text-stone-400">Insured transit active</span>
        </div>
        <div className="p-5 rounded-3xl bg-white border border-[#ede5dc] shadow-2xs text-xs">
          <span className="text-stone-500 block">Delivered & Settled</span>
          <span className="text-xl font-serif font-semibold text-emerald-700 mt-1 block">46 Pieces</span>
          <span className="text-[11px] text-stone-400">Payouts transferred to bank</span>
        </div>
      </div>

      <OrderTable />
    </div>
  );
}
