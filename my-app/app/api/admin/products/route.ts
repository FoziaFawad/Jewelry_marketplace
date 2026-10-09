import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth-server";

// GET /api/admin/products - List all products across all seller accounts
export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin privileges required." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category");
    const shopId = searchParams.get("shopId");
    const status = searchParams.get("status") || "ALL"; // ALL | ACTIVE | BANNED

    const where: any = {};

    if (search.trim()) {
      where.OR = [
        { title: { contains: search.trim(), mode: "insensitive" } },
        { description: { contains: search.trim(), mode: "insensitive" } },
        { category: { contains: search.trim(), mode: "insensitive" } },
        { metalType: { contains: search.trim(), mode: "insensitive" } },
        { gemstoneType: { contains: search.trim(), mode: "insensitive" } },
        { shop: { name: { contains: search.trim(), mode: "insensitive" } } },
        { shop: { owner: { email: { contains: search.trim(), mode: "insensitive" } } } },
      ];
    }

    if (category && category !== "ALL" && category !== "All") {
      where.category = { equals: category, mode: "insensitive" };
    }

    if (shopId && shopId !== "ALL") {
      where.shopId = shopId;
    }

    if (status === "BANNED") {
      where.isBanned = true;
    } else if (status === "ACTIVE") {
      where.isBanned = false;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            slug: true,
            status: true,
            logoUrl: true,
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: products,
      total: products.length,
    });
  } catch (error: any) {
    console.error("Admin fetch products error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}
