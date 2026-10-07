import React from "react";
import Link from "next/link";
import { MetricCards } from "@/components/vendor/MetricCards";
import { OrderTable } from "@/components/vendor/OrderTable";
import { MOCK_VENDOR_METRICS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Wallet, ArrowUpRight, ShieldCheck } from "lucide-react";

export default function VendorDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ede5dc]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-serif font-normal text-stone-900">
              Atelier Overview
            </h1>
            <Badge variant="gold" className="text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#9c7936]" /> Active Boutique
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-stone-500">
            Aurora Haute Gems • Connected Stripe Express ID: <span className="font-mono text-stone-800">acct_aurora_connect_991</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/products/new"
            className="gold-btn px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-2xs"
          >
            <PlusCircle className="w-4 h-4" />
            List Fine Jewelry Piece
          </Link>
          <Link
            href="/dashboard/settings"
            className="gold-outline-btn px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-2xs"
          >
            <Wallet className="w-4 h-4" />
            Payout Settings
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <MetricCards metrics={MOCK_VENDOR_METRICS} />

      {/* Recent Fulfillment Orders */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-serif font-semibold text-stone-900">
            Recent Client Orders & Split Payouts
          </h2>
          <Link
            href="/dashboard/orders"
            className="text-xs text-[#826229] hover:text-[#5c441b] flex items-center gap-1 font-medium"
          >
            <span>View All SubOrders</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        <OrderTable />
      </div>
    </div>
  );
}
