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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center gap-3 pb-5 border-b border-[#ede5dc]">
        <ShoppingBag className="w-6 h-6 text-[#9c7936]" />
        <h1 className="text-3xl font-serif font-normal text-stone-900">Your Shopping Cart</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Items Grouped by Shop */}
        <div className="lg:col-span-2 space-y-5">
          {/* Shop 1 Group */}
          <div className="p-6 rounded-2xl bg-white border border-[#ede5dc] shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#ede5dc]">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-[#9c7936]" />
                <span className="text-sm font-serif font-semibold text-stone-900">
                  Aurora Haute Gems
                </span>
                <span className="text-[10px] text-[#826229] px-2.5 py-0.5 rounded-full bg-[#faf5ed] border border-[#ecd8b0]">
                  Verified Shop
                </span>
              </div>
              <span className="text-xs text-stone-500">Tracked Shipping</span>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={cartItems[0].product.images[0]}
                alt={cartItems[0].product.title}
                className="w-20 h-20 rounded-xl object-cover border border-[#e8ded4] shrink-0"
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
                className="p-2 text-stone-400 hover:text-rose-500 transition-colors cursor-pointer"
                aria-label="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Shop 2 Group */}
          <div className="p-6 rounded-2xl bg-white border border-[#ede5dc] shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#ede5dc]">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-[#9c7936]" />
                <span className="text-sm font-serif font-semibold text-stone-900">
                  Valerio Milano
                </span>
                <span className="text-[10px] text-[#826229] px-2.5 py-0.5 rounded-full bg-[#faf5ed] border border-[#ecd8b0]">
                  Verified Shop
                </span>
              </div>
              <span className="text-xs text-stone-500">Tracked Shipping</span>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={cartItems[1].product.images[0]}
                alt={cartItems[1].product.title}
                className="w-20 h-20 rounded-xl object-cover border border-[#e8ded4] shrink-0"
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
                className="p-2 text-stone-400 hover:text-rose-500 transition-colors cursor-pointer"
                aria-label="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="p-6 rounded-2xl bg-white border border-[#ede5dc] shadow-sm space-y-5">
          <h2 className="text-base font-serif font-semibold text-stone-900">Order Summary</h2>

          <div className="space-y-3 text-xs text-stone-600 pb-4 border-b border-[#ede5dc]">
            <div className="flex justify-between">
              <span>Items (2)</span>
              <span className="text-stone-900 font-medium">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Insured Shipping</span>
              <span className="text-emerald-700 font-medium">Free</span>
            </div>
            <div className="flex justify-between">
              <span>Buyer Protection</span>
              <span className="text-emerald-700 font-medium">Included</span>
            </div>
          </div>

          <div className="flex justify-between text-base font-bold text-stone-900">
            <span>Total</span>
            <span className="gold-gradient-text text-xl">
              {formatCurrency(totalAmount)}
            </span>
          </div>

          {/* Multi-Store Note */}
          <div className="p-3.5 rounded-xl bg-[#faf5ed] border border-[#ecd8b0] text-xs text-[#785b24] leading-relaxed flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#9c7936] shrink-0 mt-0.5" />
            <span>
              <strong>Multiple Shops:</strong> Your items will ship directly from the 2 independent jewelers with full tracking.
            </span>
          </div>

          <Link
            href="/checkout"
            className="w-full py-3 rounded-full gold-btn text-xs font-medium flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
