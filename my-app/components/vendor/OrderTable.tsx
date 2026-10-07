import React from "react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Truck, CheckCircle2, Clock } from "lucide-react";

interface VendorOrderRow {
  id: string;
  subOrderId: string;
  customerName: string;
  itemTitle: string;
  itemImage?: string;
  quantity: number;
  saleAmount: number;
  platformFee: number;
  payoutAmount: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  trackingNumber?: string | null;
  date: string;
}

interface OrderTableProps {
  orders?: VendorOrderRow[];
}

const DEFAULT_ORDERS: VendorOrderRow[] = [
  {
    id: "ord_1001",
    subOrderId: "sub_1001_A",
    customerName: "Genevieve Vance",
    itemTitle: "The Empress 3.2ct Oval Solitaire Diamond Ring (18K White Gold)",
    itemImage: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=150&q=80",
    quantity: 1,
    saleAmount: 18450,
    platformFee: 1845,
    payoutAmount: 16605,
    status: "PROCESSING",
    trackingNumber: "FEDEX-PRECIOUS-992140",
    date: "Today, 14:22",
  },
  {
    id: "ord_0998",
    subOrderId: "sub_0998_B",
    customerName: "Julian Thorne",
    itemTitle: "Ceylon Sapphire Dewdrop Earrings in 18K Rose Gold",
    itemImage: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=150&q=80",
    quantity: 1,
    saleAmount: 6400,
    platformFee: 640,
    payoutAmount: 5760,
    status: "SHIPPED",
    trackingNumber: "BRINKS-SECURE-4410",
    date: "Yesterday",
  },
  {
    id: "ord_0984",
    subOrderId: "sub_0984_C",
    customerName: "Claire De Witt",
    itemTitle: "Constellation Cushion Cut Burmese Ruby Ring",
    itemImage: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=150&q=80",
    quantity: 1,
    saleAmount: 31200,
    platformFee: 3120,
    payoutAmount: 28080,
    status: "DELIVERED",
    trackingNumber: "ARMORED-DELIVERY-290",
    date: "Apr 02, 2024",
  },
];

export function OrderTable({ orders = DEFAULT_ORDERS }: OrderTableProps) {
  const getStatusBadge = (status: VendorOrderRow["status"]) => {
    switch (status) {
      case "PROCESSING":
        return (
          <Badge variant="warning" className="text-[10px]">
            <Clock className="w-3 h-3" /> Processing
          </Badge>
        );
      case "SHIPPED":
        return (
          <Badge variant="gold" className="text-[10px]">
            <Truck className="w-3 h-3" /> In Transit
          </Badge>
        );
      case "DELIVERED":
        return (
          <Badge variant="success" className="text-[10px]">
            <CheckCircle2 className="w-3 h-3" /> Delivered
          </Badge>
        );
      default:
        return <Badge variant="outline" className="text-[10px]">{status}</Badge>;
    }
  };

  return (
    <div className="overflow-x-auto rounded-3xl bg-white border border-[#ede5dc] shadow-2xs">
      <table className="w-full text-left text-xs text-stone-700">
        <thead className="bg-[#faf8f5] uppercase tracking-wider text-[11px] text-stone-500 border-b border-[#ede5dc]">
          <tr>
            <th className="py-4 px-5">SubOrder / Date</th>
            <th className="py-4 px-5">Client</th>
            <th className="py-4 px-5">Jewelry Item</th>
            <th className="py-4 px-5">Gross Sale</th>
            <th className="py-4 px-5">Fee (10%)</th>
            <th className="py-4 px-5">Net Payout</th>
            <th className="py-4 px-5">Status & Dispatch</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#ede5dc] font-medium">
          {orders.map((o) => (
            <tr key={o.subOrderId} className="hover:bg-[#faf8f5]/60 transition-colors">
              <td className="py-4 px-5 whitespace-nowrap">
                <span className="font-semibold text-stone-900 block">{o.subOrderId}</span>
                <span className="text-[10px] text-stone-400">{o.date}</span>
              </td>
              <td className="py-4 px-5 whitespace-nowrap text-stone-800">
                {o.customerName}
              </td>
              <td className="py-4 px-5 max-w-xs">
                <div className="flex items-center gap-2.5">
                  {o.itemImage && (
                    <img
                      src={o.itemImage}
                      alt={o.itemTitle}
                      className="w-8 h-8 rounded-lg object-cover shrink-0 border border-[#e8ded4]"
                    />
                  )}
                  <span className="truncate text-stone-800">{o.itemTitle}</span>
                </div>
              </td>
              <td className="py-4 px-5 whitespace-nowrap text-stone-900 font-semibold">
                {formatCurrency(o.saleAmount)}
              </td>
              <td className="py-4 px-5 whitespace-nowrap text-rose-600">
                -{formatCurrency(o.platformFee)}
              </td>
              <td className="py-4 px-5 whitespace-nowrap font-bold text-emerald-700">
                {formatCurrency(o.payoutAmount)}
              </td>
              <td className="py-4 px-5 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  {getStatusBadge(o.status)}
                  {o.trackingNumber && (
                    <span className="text-[10px] text-stone-600 font-mono bg-[#faf6f0] px-2 py-0.5 rounded-full border border-[#e8ded4]">
                      {o.trackingNumber}
                    </span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
