"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Store, ShieldCheck, CheckCircle2, ExternalLink } from "lucide-react";

export default function VendorSettingsPage() {
  const [shopName, setShopName] = useState("Aurora Haute Gems");
  const [description, setDescription] = useState(
    "Specializing in conflict-free high-carat diamonds, bespoke bridal settings, and rare royal sapphires crafted in Geneva."
  );
  const [location, setLocation] = useState("Geneva, Switzerland & New York, USA");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="pb-6 border-b border-[#ede5dc]">
        <h1 className="text-2xl font-serif font-bold text-stone-900">
          Atelier Profile & Banking Payouts
        </h1>
        <p className="text-xs text-[#78716c] mt-1">
          Configure your public boutique storefront and manage your connected Stripe Express payout account.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Atelier settings successfully updated!</span>
        </div>
      )}

      {/* Stripe Connect Account Card */}
      <div className="p-6 rounded-2xl bg-white border border-[#ede5dc] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#ede5dc]">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#b48c48]" />
            <h2 className="text-sm font-semibold text-stone-900">
              Stripe Connect Marketplace Payouts
            </h2>
          </div>
          <Badge variant="success" className="text-xs">
            <ShieldCheck className="w-3.5 h-3.5" /> Express Account Active
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-[#ede5dc]">
            <span className="text-[#78716c] block">Connected Stripe ID</span>
            <span className="font-mono text-stone-900 font-semibold text-xs mt-0.5 block">
              acct_aurora_connect_991
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-[#ede5dc]">
            <span className="text-[#78716c] block">Destination Bank Account</span>
            <span className="text-stone-900 font-semibold text-xs mt-0.5 block">
              UBS Switzerland •••• 4492 (EUR/USD)
            </span>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between text-xs text-[#78716c]">
          <span>Platform fee: 10% deducted automatically at checkout.</span>
          <a
            href="https://dashboard.stripe.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#b48c48] hover:text-[#947132] flex items-center gap-1 font-medium transition-colors"
          >
            <span>Open Stripe Express Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Boutique Details Form */}
      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-white border border-[#ede5dc] shadow-sm space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-[#ede5dc]">
          <Store className="w-4 h-4 text-[#b48c48]" />
          <h2 className="text-sm font-semibold text-stone-900">Public Atelier Identity</h2>
        </div>

        <Input
          label="Boutique Display Name"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          required
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-medium uppercase tracking-wider text-stone-700">
            Atelier Bio / Story
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg bg-white border border-[#dcd1c4] px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#b48c48] focus:ring-1 focus:ring-[#b48c48] transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Location / Atelier Headquarters"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Input
            label="Year Established"
            defaultValue="2014"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <Button type="submit" variant="gold" size="md">
            Save Atelier Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
