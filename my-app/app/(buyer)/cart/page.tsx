import React from "react";
import Link from "next/link";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { Store, ShoppingBag, Trash2, ShieldCheck, ArrowRight } from "lucide-react";

export default function CartPage() {
  const cartItems = [
    { product: MOCK_PRODUCTS[0], quantity: 1, ringSize: "6.5" },
    { product: MOCK_PRODUCTS[1], quantity: 1, ringSize: "Standard 16in" },
  ];

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex items-center gap-3 pb-6 border-b border-[#ede5dc]">
        <ShoppingBag className="w-6 h-6 text-[#9c7936]" />
        <h1 className="text-3xl font-serif font-normal text-stone-900">Your Shopping Bag</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Items Grouped by Atelier */}
        <div className="lg:col-span-2 space-y-6">
          {/* Atelier 1 Group */}
          <div className="p-6 rounded-3xl bg-white border border-[#ede5dc] shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#ede5dc]">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-[#9c7936]" />
                <span className="text-sm font-serif font-semibold text-stone-900">
                  Aurora Haute Gems
                </span>
                <span className="text-[10px] text-[#826229] px-2.5 py-0.5 rounded-full bg-[#faf5ed] border border-[#ecd8b0]">
                  Geneva Atelier
                </span>
              </div>
              <span className="text-xs text-stone-500">Direct Insured Courier</span>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={cartItems[0].product.images[0]}
                alt={cartItems[0].product.title}
                className="w-20 h-20 rounded-2xl object-cover border border-[#e8ded4] shrink-0"
              />
              <div className="flex-1 space-y-1">
                <h3 className="text-sm font-serif font-medium text-stone-900">
                  {cartItems[0].product.title}
                </h3>
                <p className="text-xs text-stone-500">
                  {cartItems[0].product.metalPurity} {cartItems[0].product.metalType} • Size {cartItems[0].ringSize}
                </p>
                <p className="text-sm font-semibold gold-gradient-text">
                  {formatCurrency(cartItems[0].product.price)}
                </p>
              </div>
              <button
                type="button"
                className="p-2 text-stone-400 hover:text-rose-500 transition-colors"
                aria-label="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Atelier 2 Group */}
          <div className="p-6 rounded-3xl bg-white border border-[#ede5dc] shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#ede5dc]">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-[#9c7936]" />
                <span className="text-sm font-serif font-semibold text-stone-900">
                  Valerio Milano
                </span>
                <span className="text-[10px] text-[#826229] px-2.5 py-0.5 rounded-full bg-[#faf5ed] border border-[#ecd8b0]">
                  Milan Atelier
                </span>
              </div>
              <span className="text-xs text-stone-500">Direct Insured Courier</span>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={cartItems[1].product.images[0]}
                alt={cartItems[1].product.title}
                className="w-20 h-20 rounded-2xl object-cover border border-[#e8ded4] shrink-0"
              />
              <div className="flex-1 space-y-1">
                <h3 className="text-sm font-serif font-medium text-stone-900">
                  {cartItems[1].product.title}
                </h3>
                <p className="text-xs text-stone-500">
                  {cartItems[1].product.metalPurity} {cartItems[1].product.metalType} • {cartItems[1].ringSize}
                </p>
                <p className="text-sm font-semibold gold-gradient-text">
                  {formatCurrency(cartItems[1].product.price)}
                </p>
              </div>
              <button
                type="button"
                className="p-2 text-stone-400 hover:text-rose-500 transition-colors"
                aria-label="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Multi-Shop Split Notice */}
        <div className="p-6 rounded-3xl bg-white border border-[#ede5dc] shadow-sm space-y-6">
          <h2 className="text-base font-serif font-semibold text-stone-900">Order Summary</h2>

          <div className="space-y-3 text-xs text-stone-600 pb-4 border-b border-[#ede5dc]">
            <div className="flex justify-between">
              <span>Subtotal (2 pieces)</span>
              <span className="text-stone-900 font-medium">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Insured Armored Transit</span>
              <span className="text-emerald-700 font-medium">Complimentary</span>
            </div>
            <div className="flex justify-between">
              <span>Escrow Protection Fee</span>
              <span className="text-emerald-700 font-medium">Included</span>
            </div>
          </div>

          <div className="flex justify-between text-base font-bold text-stone-900">
            <span>Total Payable</span>
            <span className="gold-gradient-text text-xl">
              {formatCurrency(totalAmount)}
            </span>
          </div>

          {/* Multi-Vendor Callout */}
          <div className="p-4 rounded-2xl bg-[#faf5ed] border border-[#ecd8b0] text-[11px] text-[#785b24] leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-[#9c7936] mb-1" />
            <strong>Multi-Shop Split Checkout:</strong> Both ateliers will receive dedicated SubOrders and prepare custom hallmarks directly for dispatch.
          </div>

          <Link
            href="/checkout"
            className="w-full py-3.5 rounded-full gold-btn text-xs font-medium flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Proceed to Split Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
