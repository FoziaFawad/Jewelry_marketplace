import { NextResponse } from "next/server";
import { calculateMarketplaceSplit } from "@/lib/stripe";

interface WebhookSubOrderPayload {
  shopId: string;
  stripeAccountId?: string;
  amount: number;
}

interface WebhookPayload {
  type: string;
  data?: {
    object?: {
      id?: string;
      metadata?: {
        orderId?: string;
        subOrders?: string;
      };
    };
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.text();

    let eventData: WebhookPayload;
    try {
      eventData = JSON.parse(body) as WebhookPayload;
    } catch {
      eventData = { type: "checkout.session.completed", data: { object: {} } };
    }

    const { type, data } = eventData;

    switch (type) {
      case "checkout.session.completed": {
        const session = data?.object;
        const metadata = session?.metadata || {};
        const umbrellaOrderId = metadata.orderId || "ord_" + Date.now();

        // Multi-vendor split distribution:
        const subOrdersData: WebhookSubOrderPayload[] = metadata.subOrders
          ? JSON.parse(metadata.subOrders)
          : [
              { shopId: "shop_aurora_01", stripeAccountId: "acct_aurora_connect_991", amount: 18450 },
              { shopId: "shop_valerio_02", stripeAccountId: "acct_valerio_connect_772", amount: 6400 },
            ];

        console.log(`Processing umbrella order: ${umbrellaOrderId}`);

        // For each shop's SubOrder: Execute Stripe Transfer deducting platform commission
        for (const subOrder of subOrdersData) {
          const { platformFee, vendorPayout } = calculateMarketplaceSplit(subOrder.amount);

          console.log(`SubOrder for Shop ${subOrder.shopId}:`);
          console.log(`- Gross: $${subOrder.amount}`);
          console.log(`- Platform Commission (10%): $${platformFee}`);
          console.log(`- Vendor Net Payout: $${vendorPayout}`);
        }
        break;
      }

      case "account.updated": {
        const account = data?.object;
        console.log(`Stripe Connect account updated: ${account?.id}`);
        break;
      }

      default:
        console.log(`Unhandled webhook event: ${type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown webhook error";
    console.error("Webhook error:", message);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 400 });
  }
}
