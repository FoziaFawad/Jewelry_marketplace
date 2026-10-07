import { NextResponse } from "next/server";
import { MOCK_SHOPS } from "@/lib/mock-data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let shops = MOCK_SHOPS;
    if (status) {
      shops = shops.filter((s) => s.status.toLowerCase() === status.toLowerCase());
    }

    return NextResponse.json({
      success: true,
      data: shops,
      total: shops.length,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch boutique shops" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, location, establishedYear } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Shop name is required" },
        { status: 400 }
      );
    }

    const newShop = {
      id: "shop_" + Date.now(),
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, ""),
      description: description || "",
      logoUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=80",
      status: "PENDING_VERIFICATION" as const,
      stripeAccountId: null,
      ownerId: "usr_vendor_new",
      rating: 5.0,
      reviewCount: 0,
      location: location || "Geneva, Switzerland",
      establishedYear: establishedYear || new Date().getFullYear(),
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Atelier boutique submitted for verification",
      data: newShop,
    }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to create boutique" },
      { status: 500 }
    );
  }
}
