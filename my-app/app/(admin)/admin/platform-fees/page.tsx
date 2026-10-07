import React from "react";
import { MOCK_ADMIN_METRICS } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { Percent, DollarSign, Wallet, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PlatformFeesPage() {
  const transactions = [
    {
      id: "ord_1001",
      date: "Today, 14:22",
      shopName: "Naurattan Heritage Jewelers",
      grossAmount: 485000,
      feeAmount: 48500,
      netPayout: 436500,
      status: "In Escrow",
    },
    {
      id: "ord_0998",
      date: "Yesterday",
      shopName: "Zaveri Fine Diamonds",
      grossAmount: 720000,
      feeAmount: 72000,
      netPayout: 648000,
      status: "Settled",
    },
    {
      id: "ord_0984",
      date: "Apr 02, 2024",
      shopName: "Kohinoor Gold Studio",
      grossAmount: 360000,
      feeAmount: 36000,
      netPayout: 324000,
      status: "Settled",
    },
    {
      id: "ord_0975",
      date: "Mar 30, 2024",
      shopName: "Deewan Bridal Atelier",
      grossAmount: 890000,
      feeAmount: 89000,
      netPayout: 801000,
      status: "Settled",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-[#ede5dc]">
        <h1 className="text-2xl font-serif font-bold text-stone-900">
          Platform Commission & Fee Ledger
        </h1>
        <p className="text-xs text-[#78716c] mt-1">
          Real-time tracking of marketplace splits (10.0% take rate) and automated Stripe Transfer disbursements.
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#ede5dc] shadow-xs text-xs space-y-1">
          <div className="flex items-center justify-between text-[#78716c]">
            <span>Commission Take Rate</span>
            <Percent className="w-4 h-4 text-[#b48c48]" />
          </div>
          <span className="text-2xl font-serif font-bold text-[#b48c48] block pt-2">10.0%</span>
          <span className="text-[11px] text-[#a8a29e]">Auto-split on Stripe</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#ede5dc] shadow-xs text-xs space-y-1">
          <div className="flex items-center justify-between text-[#78716c]">
            <span>Total Gross GMV</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-serif font-bold text-stone-900 block pt-2">
            {formatCurrency(MOCK_ADMIN_METRICS.totalGrossVolume)}
          </span>
          <span className="text-[11px] text-[#a8a29e]">320 Total Orders</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#ede5dc] shadow-xs text-xs space-y-1">
          <div className="flex items-center justify-between text-[#78716c]">
            <span>Platform Revenue Earned</span>
            <TrendingUp className="w-4 h-4 text-[#b48c48]" />
          </div>
          <span className="text-2xl font-serif font-bold text-[#8a6828] block pt-2">
            {formatCurrency(MOCK_ADMIN_METRICS.platformCommissionEarned)}
          </span>
          <span className="text-[11px] text-[#a8a29e]">Net platform fees</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#ede5dc] shadow-xs text-xs space-y-1">
          <div className="flex items-center justify-between text-[#78716c]">
            <span>Vendor Payouts Remitted</span>
            <Wallet className="w-4 h-4 text-stone-700" />
          </div>
          <span className="text-2xl font-serif font-bold text-stone-900 block pt-2">
            {formatCurrency(MOCK_ADMIN_METRICS.totalGrossVolume - MOCK_ADMIN_METRICS.platformCommissionEarned)}
          </span>
          <span className="text-[11px] text-[#a8a29e]">Transferred to ateliers</span>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="space-y-3">
        <h2 className="text-base font-serif font-semibold text-stone-900">
          Real-Time Commission Ledger
        </h2>

        <div className="overflow-x-auto rounded-2xl bg-white border border-[#ede5dc] shadow-xs">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-[#faf8f5] uppercase tracking-wider text-[11px] text-stone-500 border-b border-[#ede5dc]">
              <tr>
                <th className="py-3.5 px-4">Order ID / Date</th>
                <th className="py-3.5 px-4">Vendor Atelier</th>
                <th className="py-3.5 px-4">Gross Customer Paid</th>
                <th className="py-3.5 px-4">Platform Fee (10%)</th>
                <th className="py-3.5 px-4">Vendor Transfer</th>
                <th className="py-3.5 px-4">Settlement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ede5dc] font-medium">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-[#faf8f5]/60 transition-colors">
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-semibold text-stone-900 block">{t.id}</span>
                    <span className="text-[10px] text-[#a8a29e]">{t.date}</span>
                  </td>
                  <td className="py-3.5 px-4 text-stone-800 font-medium">
                    {t.shopName}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-stone-900 font-semibold">
                    {formatCurrency(t.grossAmount)}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap font-bold text-[#b48c48]">
                    +{formatCurrency(t.feeAmount)}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-stone-700 font-semibold">
                    {formatCurrency(t.netPayout)}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {t.status === "Settled" ? (
                      <Badge variant="success" className="text-[10px]">
                        Settled
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="text-[10px]">
                        In Escrow
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
