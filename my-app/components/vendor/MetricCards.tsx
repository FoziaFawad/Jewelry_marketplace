import React from "react";
import { VendorMetrics } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { DollarSign, Wallet, ShoppingBag, Gem, Star, ArrowUpRight } from "lucide-react";

interface MetricCardsProps {
  metrics: VendorMetrics;
}

export function MetricCards({ metrics }: MetricCardsProps) {
  const cards = [
    {
      label: "Total Sales",
      value: formatCurrency(metrics.totalRevenue),
      change: "+18.4% this month",
      icon: DollarSign,
      color: "text-[#9c7936]",
    },
    {
      label: "Earnings Paid Out",
      value: formatCurrency(metrics.netPayout),
      change: "Transferred to bank",
      icon: Wallet,
      color: "text-emerald-700",
    },
    {
      label: "Pending Earnings",
      value: formatCurrency(metrics.pendingPayout),
      change: "Available after delivery",
      icon: ArrowUpRight,
      color: "text-blue-700",
    },
    {
      label: "Total Orders",
      value: metrics.totalOrders.toString(),
      change: "4 ready to ship",
      icon: ShoppingBag,
      color: "text-purple-700",
    },
    {
      label: "Active Products",
      value: metrics.activeProducts.toString(),
      change: "Listed in shop",
      icon: Gem,
      color: "text-rose-700",
    },
    {
      label: "Customer Rating",
      value: `${metrics.averageRating} / 5.0`,
      change: "Based on verified reviews",
      icon: Star,
      color: "text-[#9c7936]",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="p-6 rounded-3xl bg-white border border-[#ede5dc] shadow-2xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-stone-500">
                {card.label}
              </span>
              <div className={`p-2.5 rounded-2xl bg-[#faf6f0] border border-[#e8ded4] ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4">
              <div className="text-2xl font-serif font-semibold text-stone-900 tracking-tight">
                {card.value}
              </div>
              <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
                {card.change}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
