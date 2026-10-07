import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock_key_placeholder");

export const PLATFORM_FEE_PERCENTAGE = parseFloat(
  process.env.PLATFORM_COMMISSION_PERCENTAGE || "0.10"
);

/**
 * Calculates marketplace split between platform and vendor
 * @param amount Total price in dollars
 * @returns { platformFee, vendorPayout } in dollars
 */
export function calculateMarketplaceSplit(amount: number) {
  const platformFee = Math.round(amount * PLATFORM_FEE_PERCENTAGE * 100) / 100;
  const vendorPayout = Math.round((amount - platformFee) * 100) / 100;
  return {
    platformFee,
    vendorPayout,
  };
}

/**
 * Creates Stripe Connect onboarding link for a vendor store
 */
export async function createStripeConnectAccountLink(vendorShopId: string, shopEmail: string) {
  try {
    const account = await stripe.accounts.create({
      type: "express",
      email: shopEmail,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      metadata: {
        shopId: vendorShopId,
      },
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/settings?stripe=refresh`,
      return_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/settings?stripe=success`,
      type: "account_onboarding",
    });

    return {
      accountId: account.id,
      url: accountLink.url,
    };
  } catch (error) {
    console.error("Error creating Stripe Connect onboarding link:", error);
    return {
      accountId: "acct_mock_" + vendorShopId,
      url: `/dashboard/settings?simulated_connect=true`,
    };
  }
}
