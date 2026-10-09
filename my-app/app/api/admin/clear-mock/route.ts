import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { mode = "mock_only" } = body;

    const MOCK_SHOP_IDS = [
      "shop_aurora_01",
      "shop_valerio_02",
      "shop_celestial_03",
      "shop_solitaire_04",
    ];

    const MOCK_PROD_IDS = [
      "prod_01",
      "prod_02",
      "prod_03",
      "prod_04",
      "prod_05",
      "prod_06",
    ];

    if (mode === "all_catalog") {
      // Delete all products and shops
      const deletedProducts = await prisma.product.deleteMany({});
      const deletedShops = await prisma.shop.deleteMany({});
      return NextResponse.json({
        success: true,
        message: `Purged complete catalog: ${deletedProducts.count} products and ${deletedShops.count} shops removed.`,
      });
    }

    // Default mode: Purge mock shops & products
    const deletedProducts = await prisma.product.deleteMany({
      where: {
        OR: [
          { id: { in: MOCK_PROD_IDS } },
          { shopId: { in: MOCK_SHOP_IDS } },
        ],
      },
    });

    const deletedShops = await prisma.shop.deleteMany({
      where: {
        id: { in: MOCK_SHOP_IDS },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Cleaned mock records: ${deletedProducts.count} mock products and ${deletedShops.count} mock shops removed.`,
      deletedCount: {
        products: deletedProducts.count,
        shops: deletedShops.count,
      },
    });
  } catch (error: any) {
    console.error("Purge mock data error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to clear mock data" },
      { status: 500 }
    );
  }
}
