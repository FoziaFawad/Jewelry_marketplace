"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { calculateMarketplaceSplit } from "@/lib/stripe";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Store,
  CheckCircle2,
  Lock,
  Split,
} from "lucide-react";

export default function CheckoutPage() {
  const [completed, setCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Two demo items from 2 different shops
  const subOrders = [
    {
      shopName: "Aurora Haute Gems",
      shopLocation: "Geneva Atelier",
      itemTitle: "The Empress 3.2ct Oval Solitaire Diamond Ring",
      amount: 18450,
      stripeConnectedAccount: "acct_aurora_connect_991",
    },
    {
      shopName: "Valerio Milano",
      shopLocation: "Milan Atelier",
      itemTitle: "Verona Royal Emerald & Diamond Choker",
      amount: 24800,
      stripeConnectedAccount: "acct_valerio_connect_772",
    },
  ];

  const totalAmount = subOrders.reduce((sum, item) => sum + item.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setCompleted(true);
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#ede5dc]">
        <div>
          <div className="flex items-center gap-2 text-[#9c7936] text-xs font-semibold uppercase tracking-widest mb-1">
            <Lock className="w-3.5 h-3.5" />
            256-Bit Escrow Encrypted
          </div>
          <h1 className="text-3xl font-serif font-normal text-stone-900">
            Multi-Shop Split Checkout
          </h1>
        </div>
        <Badge variant="gold" className="text-xs">
          Powered by Stripe Connect
        </Badge>
      </div>

      {completed ? (
        <div className="p-10 rounded-3xl bg-white border border-emerald-200 text-center max-w-2xl mx-auto space-y-6 shadow-md">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-normal text-stone-900">
              Order Confirmed & Escrow Activated!
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Umbrella Order <strong className="text-[#826229] font-mono">ORD-89218-VAULT</strong> has been created. Funds are safely locked in escrow and partitioned into 2 boutique SubOrders.
            </p>
          </div>

          {/* SubOrder breakdown */}
          <div className="space-y-3 text-left">
            {subOrders.map((s, idx) => {
              const { platformFee, vendorPayout } = calculateMarketplaceSplit(s.amount);
              return (
                <div key={idx} className="p-4 rounded-2xl bg-[#faf8f5] border border-[#ede5dc] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-semibold text-stone-900 flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5 text-[#9c7936]" />
                      SubOrder #{idx + 1}: {s.shopName}
                    </span>
                    <Badge variant="success" className="text-[10px]">Processing</Badge>
                  </div>
                  <p className="text-stone-600">{s.itemTitle}</p>
                  <div className="flex justify-between text-[11px] pt-1 text-stone-500 border-t border-[#ede5dc]">
                    <span>Atelier Net Transfer: <strong className="text-emerald-700">{formatCurrency(vendorPayout)}</strong></span>
                    <span>Platform Fee (10%): <strong className="text-[#826229]">{formatCurrency(platformFee)}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex justify-center gap-4">
            <Link href="/dashboard" className="gold-btn px-6 py-2.5 rounded-full text-xs font-medium">
              View in Vendor Portal
            </Link>
            <Link href="/jewelry" className="gold-outline-btn px-6 py-2.5 rounded-full text-xs font-medium">
              Continue Browsing
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Shipping and Card Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#ede5dc] shadow-sm space-y-5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                1. Insured Delivery Destination
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" defaultValue="Genevieve" />
                <Input label="Last Name" defaultValue="Vance" />
              </div>
              <Input label="Delivery Address" defaultValue="740 Park Avenue, Penthouse B" />
              <div className="grid grid-cols-3 gap-3">
                <Input label="City" defaultValue="New York" />
                <Input label="State" defaultValue="NY" />
                <Input label="Postal Code" defaultValue="10021" />
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#ede5dc] shadow-sm space-y-5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                2. Payment Details (Stripe Connect Split)
              </h2>
              <Input
                label="Card Number"
                placeholder="4242 •••• •••• 4242"
                defaultValue="•••• •••• •••• 4242"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Expiration" defaultValue="12/28" />
                <Input label="CVC" defaultValue="882" />
              </div>
            </div>
          </div>

          {/* Multi-Vendor Order Decomposition Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#ede5dc] shadow-sm space-y-5">
              <div className="flex items-center gap-2 text-stone-900 font-serif font-semibold text-sm">
                <Split className="w-4 h-4 text-[#9c7936]" />
                <span>Multi-Shop Order Breakdown</span>
              </div>

              <div className="space-y-4">
                {subOrders.map((s, idx) => {
                  const { platformFee, vendorPayout } = calculateMarketplaceSplit(s.amount);
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-[#faf8f5] border border-[#ede5dc] space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-medium text-stone-900">{s.shopName}</span>
                        <span className="font-semibold text-stone-900">{formatCurrency(s.amount)}</span>
                      </div>
                      <p className="text-[11px] text-stone-500 truncate">{s.itemTitle}</p>
                      <div className="pt-2 border-t border-[#ede5dc] flex justify-between text-[10px] text-stone-500">
                        <span>Vendor Net Payout: <strong className="text-emerald-700">{formatCurrency(vendorPayout)}</strong></span>
                        <span>Platform Commission (10%): <strong className="text-[#826229]">{formatCurrency(platformFee)}</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-[#ede5dc] space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Combined Items:</span>
                  <span className="text-stone-900 font-medium">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Armored Transport:</span>
                  <span className="text-emerald-700 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-[#ede5dc]">
                  <span>Total Amount:</span>
                  <span className="gold-gradient-text text-xl">{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              <Button
                type="button"
                variant="gold"
                size="lg"
                className="w-full text-xs font-medium rounded-full py-3"
                disabled={submitting}
                onClick={handleSubmit}
              >
                {submitting ? "Distributing via Stripe Connect..." : "Authorize Escrow & Place Order"}
              </Button>

              <div className="flex items-center gap-2 text-[10px] text-stone-500 justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-[#9c7936]" />
                <span>Protected by Stripe Connect Transfer API & Escrow Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
