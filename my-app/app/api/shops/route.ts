import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: any = {};
    if (status) {
      where.status = status.toUpperCase();
    }

    const shops = await prisma.shop.findMany({
      where,
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: shops,
      total: shops.length,
    });
  } catch (error) {
    console.error("Failed to fetch shops:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch boutique shops" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, ownerId, logoUrl, bannerUrl } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Shop name is required" },
        { status: 400 }
      );
    }

    // Find vendor owner or fall back to an existing vendor
    let vendorOwnerId = ownerId;
    if (!vendorOwnerId) {
      const defaultVendor = await prisma.user.findFirst({
        where: { role: "VENDOR" },
      });
      vendorOwnerId = defaultVendor?.id;
    }

    if (!vendorOwnerId) {
      return NextResponse.json(
        { success: false, error: "No vendor account found to associate this shop with" },
        { status: 400 }
      );
    }

    const baseSlug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const newShop = await prisma.shop.create({
      data: {
        name,
        slug,
        description: description || "",
        logoUrl: logoUrl || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80",
        bannerUrl: bannerUrl || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=80",
        status: "PENDING_VERIFICATION",
        ownerId: vendorOwnerId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Atelier boutique created and submitted for verification",
      data: newShop,
    }, { status: 201 });
  } catch (error) {
    console.error("Failed to create boutique:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create boutique" },
      { status: 500 }
    );
  }
}
