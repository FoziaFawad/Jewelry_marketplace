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
  Banknote,
  ShoppingBag,
  Truck,
  Phone,
  MapPin,
} from "lucide-react";

export default function CheckoutPage() {
  const [completed, setCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Lahore");

  // Two luxury items from 2 renowned Pakistani fine jewelry houses
  const subOrders = [
    {
      shopName: "Naurattan Heritage Jewelers",
      shopLocation: "MM Alam Road, Gulberg III, Lahore",
      itemTitle: "Royal Solitaire 2.5ct Diamond Engagement Ring",
      amount: 485000,
      stripeConnectedAccount: "acct_naurattan_connect_991",
    },
    {
      shopName: "Zaveri Fine Diamonds",
      shopLocation: "Clifton Block 4, Karachi",
      itemTitle: "Heritage 22K Gold Bridal Choker & Emerald Haar Set",
      amount: 720000,
      stripeConnectedAccount: "acct_zaveri_connect_772",
    },
  ];

  const totalAmount = subOrders.reduce((sum, item) => sum + item.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setCompleted(true);
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-[#ede5dc]">
        <div>
          <div className="flex items-center gap-1.5 text-[#9c7936] text-xs font-semibold uppercase tracking-wider mb-1">
            <Truck className="w-3.5 h-3.5" />
            Nationwide Insured Delivery • Pakistan
          </div>
          <h1 className="text-3xl font-serif font-normal text-stone-900">
            Complete Your Order
          </h1>
        </div>
        <Badge variant="gold" className="text-xs">
          Cash on Delivery (COD)
        </Badge>
      </div>

      {completed ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-emerald-200 text-center max-w-2xl mx-auto space-y-6 shadow-md">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-normal text-stone-900">
              Thank You! Your COD Order is Confirmed
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed max-w-md mx-auto">
              Your order <strong className="text-stone-900 font-mono">#ORD-89218</strong> has been placed successfully. You do not need to pay anything online. Please have exact cash ready in Pakistani Rupees (PKR) when the courier rider delivers your package.
            </p>
          </div>

          {/* COD Payment Summary Notice */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-left space-y-1.5 text-xs text-amber-900">
            <div className="flex items-center justify-between font-semibold">
              <span className="flex items-center gap-1.5">
                <Banknote className="w-4 h-4 text-amber-800" />
                Payment Method: Cash on Delivery (COD)
              </span>
              <span className="text-sm font-bold text-stone-900">{formatCurrency(totalAmount)}</span>
            </div>
            <p className="text-[11px] text-amber-800">
              Dispatched via verified courier (TCS / Leopard Courier Express) in tamper-proof security sealed boxes. Payment will be collected at your doorstep.
            </p>
          </div>

          {/* SubOrder breakdown */}
          <div className="space-y-3 text-left">
            {subOrders.map((s, idx) => {
              const { vendorPayout } = calculateMarketplaceSplit(s.amount);
              return (
                <div key={idx} className="p-4 rounded-2xl bg-[#faf8f5] border border-[#ede5dc] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-serif font-semibold text-stone-900 flex items-center gap-1.5">
                        <Store className="w-3.5 h-3.5 text-[#9c7936]" />
                        Package {idx + 1}: {s.shopName}
                      </span>
                      <span className="text-[10px] text-stone-400 block ml-5">{s.shopLocation}</span>
                    </div>
                    <Badge variant="success" className="text-[10px]">Processing Dispatch</Badge>
                  </div>
                  <p className="text-stone-700 font-medium pt-1">{s.itemTitle}</p>
                  <div className="flex justify-between text-[11px] pt-1 text-stone-500 border-t border-[#ede5dc]">
                    <span>Item Price: <strong className="text-stone-900">{formatCurrency(s.amount)}</strong></span>
                    <span>Seller Payout (After Delivery): <strong className="text-emerald-700">{formatCurrency(vendorPayout)}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex justify-center gap-4">
            <Link href="/dashboard/orders" className="gold-btn px-6 py-2.5 rounded-full text-xs font-medium">
              View Order in Dashboard
            </Link>
            <Link href="/jewelry" className="gold-outline-btn px-6 py-2.5 rounded-full text-xs font-medium">
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Checkout Form */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Shipping Address */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#ede5dc] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#9c7936]" />
                  1. Delivery Address (Pakistan)
                </h2>
                <span className="text-[11px] text-stone-400">All fields required for dispatch</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" defaultValue="Ayla" required />
                <Input label="Last Name" defaultValue="Zahra" required />
              </div>

              <div className="space-y-1">
                <Input
                  label="Contact Mobile Number (Required for Courier Dispatch)"
                  placeholder="+92 300 1234567"
                  defaultValue="+92 300 1234567"
                  required
                />
                <p className="text-[11px] text-stone-400 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#9c7936]" />
                  The courier rider will call this number prior to doorstep delivery.
                </p>
              </div>

              <Input
                label="Street Address / House / Apartment"
                defaultValue="House 14-B, Street 7, Block F, Gulberg II"
                placeholder="Complete street address, house/floor number"
                required
              />

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-700 uppercase tracking-wider block">
                    City
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-[#fbf9f6] border border-[#dcd1c4] rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-[#b48c48]"
                  >
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Multan">Multan</option>
                    <option value="Peshawar">Peshawar</option>
                    <option value="Sialkot">Sialkot</option>
                    <option value="Gujranwala">Gujranwala</option>
                    <option value="Quetta">Quetta</option>
                  </select>
                </div>
                <Input label="Province" defaultValue="Punjab" required />
                <Input label="Postal Code" defaultValue="54000" required />
              </div>
            </div>

            {/* Step 2: Payment Method (Cash on Delivery) */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#ede5dc] shadow-sm space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                2. Payment Method
              </h2>

              {/* COD Option Box */}
              <div className="p-4 rounded-xl bg-[#faf5ed] border-2 border-[#b48c48] flex items-start gap-3.5">
                <div className="mt-0.5 p-2 rounded-full bg-white border border-[#ecd8b0] text-[#9c7936] shrink-0">
                  <Banknote className="w-5 h-5" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-stone-900">Cash on Delivery (COD)</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Standard Payment
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Pay with cash in Pakistani Rupees (PKR) directly to the delivery rider when your package arrives. No online payment or credit card is required.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1">
                <div className="flex items-center gap-2 font-medium text-stone-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Doorstep Security & Inspection Guarantee</span>
                </div>
                <p className="text-[11px] text-stone-500 pl-6">
                  Packages are sealed with tamper-evident security tape and contain official jeweler certificates (21K/22K Hallmark and Gemological Reports). You may verify package integrity before completing cash payment.
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#ede5dc] shadow-sm space-y-5">
              <div className="flex items-center gap-2 text-stone-900 font-serif font-semibold text-sm">
                <ShoppingBag className="w-4 h-4 text-[#9c7936]" />
                <span>Order Summary</span>
              </div>

              <div className="space-y-3">
                {subOrders.map((s, idx) => {
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#faf8f5] border border-[#ede5dc] space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-serif font-medium text-stone-900 block">{s.shopName}</span>
                          <span className="text-[10px] text-stone-400">{s.shopLocation}</span>
                        </div>
                        <span className="font-semibold text-stone-900">{formatCurrency(s.amount)}</span>
                      </div>
                      <p className="text-[11px] text-stone-600 truncate">{s.itemTitle}</p>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-[#ede5dc] space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal (2 items):</span>
                  <span className="text-stone-900 font-medium">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Insured Courier Delivery:</span>
                  <span className="text-emerald-700 font-medium">Free Nationwide</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Payment Method:</span>
                  <span className="font-medium text-stone-800">Cash on Delivery</span>
                </div>
                <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-[#ede5dc]">
                  <span>Total Due on Delivery:</span>
                  <span className="gold-gradient-text text-xl">{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              <Button
                type="submit"
                variant="gold"
                size="lg"
                className="w-full text-xs font-medium rounded-full py-3 cursor-pointer"
                disabled={submitting}
              >
                {submitting ? "Confirming Order..." : "Place Order (Cash on Delivery)"}
              </Button>

              <div className="flex items-center gap-2 text-[11px] text-stone-500 justify-center">
                <Truck className="w-3.5 h-3.5 text-[#9c7936]" />
                <span>Nationwide Express Courier • Pay cash upon arrival</span>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
