import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/products - Query real products from Neon DB
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const metalType = searchParams.get("metalType");
    const shopId = searchParams.get("shopId");
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const where: any = {};
    if (category) where.category = category;
    if (metalType) where.metalType = metalType;
    if (shopId) where.shopId = shopId;

    const products = await prisma.product.findMany({
      where,
      take: limit,
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            status: true,
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
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch jewelry products" },
      { status: 500 }
    );
  }
}

// POST /api/products - Ingest a new real jewelry product via Web API
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      description,
      price,
      stock,
      images,
      category,
      metalType,
      metalPurity,
      gemstoneType,
      caratWeight,
      certifiedBy,
      shopId,
    } = body;

    if (!title || price === undefined || !category || !metalType || !shopId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: title, price, category, metalType, shopId",
        },
        { status: 400 }
      );
    }

    // Verify shop exists
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!shop) {
      return NextResponse.json(
        { success: false, error: "Associated boutique shop not found" },
        { status: 404 }
      );
    }

    const generatedSlug =
      slug ||
      `${title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "")}-${Date.now().toString().slice(-4)}`;

    const product = await prisma.product.create({
      data: {
        title,
        slug: generatedSlug,
        description: description || "",
        price: parseFloat(price.toString()),
        stock: parseInt(stock?.toString() || "1", 10),
        images: Array.isArray(images) && images.length > 0 ? images : [
          "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80",
        ],
        category,
        metalType,
        metalPurity: metalPurity || null,
        gemstoneType: gemstoneType || null,
        caratWeight: caratWeight ? parseFloat(caratWeight.toString()) : null,
        certifiedBy: certifiedBy || null,
        shopId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Jewelry piece successfully ingested into catalog",
        data: product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to ingest product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to ingest product" },
      { status: 500 }
    );
  }
}
