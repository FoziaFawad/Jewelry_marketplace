import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth-server";

// GET /api/products - Query real products from Neon DB with complete filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const metalType = searchParams.get("metalType");
    const gemstoneType = searchParams.get("gemstoneType");
    const shopId = searchParams.get("shopId");
    const query = searchParams.get("query") || searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minCarat = searchParams.get("minCarat");
    const certifiedOnly = searchParams.get("certifiedOnly");
    const sortBy = searchParams.get("sortBy") || "newest";
    const limit = parseInt(searchParams.get("limit") || "100", 10);
    const includeBanned = searchParams.get("includeBanned");
    const bannedOnly = searchParams.get("bannedOnly");

    const where: any = {};

    if (bannedOnly === "true") {
      where.isBanned = true;
    } else if (includeBanned !== "true") {
      where.isBanned = false;
    }

    if (category && category !== "All") {
      where.category = { equals: category, mode: "insensitive" };
    }
    if (metalType && metalType !== "All") {
      where.metalType = { contains: metalType, mode: "insensitive" };
    }
    if (gemstoneType && gemstoneType !== "All") {
      where.gemstoneType = { equals: gemstoneType, mode: "insensitive" };
    }
    if (shopId) {
      where.shopId = shopId;
    }

    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { metalType: { contains: query, mode: "insensitive" } },
        { gemstoneType: { contains: query, mode: "insensitive" } },
        { shop: { name: { contains: query, mode: "insensitive" } } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (minCarat) {
      where.caratWeight = { gte: parseFloat(minCarat) };
    }

    if (certifiedOnly === "true") {
      where.certifiedBy = { not: null, notIn: ["None", ""] };
    }

    // Determine sorting
    let orderBy: any = { createdAt: "desc" };
    if (sortBy === "price-asc") {
      orderBy = { price: "asc" };
    } else if (sortBy === "price-desc") {
      orderBy = { price: "desc" };
    } else if (sortBy === "carat-desc") {
      orderBy = { caratWeight: "desc" };
    }

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
            bannerUrl: true,
            status: true,
          },
        },
      },
      orderBy,
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

// POST /api/products - Ingest a new real jewelry product
export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    const body = await request.json();
    let {
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

    if (!title || price === undefined || !category || !metalType) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: title, price, category, metalType",
        },
        { status: 400 }
      );
    }

    // Resolve shopId
    if (!shopId) {
      if (session?.shopId) {
        shopId = session.shopId;
      } else if (session?.id) {
        const userShop = await prisma.shop.findUnique({
          where: { ownerId: session.id },
        });
        if (userShop) shopId = userShop.id;
      }
    }

    if (!shopId) {
      const firstShop = await prisma.shop.findFirst({
        orderBy: { createdAt: "asc" },
      });
      if (firstShop) shopId = firstShop.id;
    }

    if (!shopId) {
      return NextResponse.json(
        {
          success: false,
          error: "No boutique shop exists yet. Please create a shop first before uploading jewelry pieces.",
        },
        { status: 400 }
      );
    }

    const generatedSlug =
      slug?.trim() ||
      `${title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")}-${Date.now().toString().slice(-4)}`;

    const normalizedImages = Array.isArray(images) && images.length > 0
      ? images
      : [
          "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80",
        ];

    const product = await prisma.product.create({
      data: {
        title: title.trim(),
        slug: generatedSlug,
        description: description?.trim() || "",
        price: parseFloat(price.toString()),
        stock: parseInt(stock?.toString() || "1", 10),
        images: normalizedImages,
        category: category.trim(),
        metalType: metalType.trim(),
        metalPurity: metalPurity || null,
        gemstoneType: gemstoneType || null,
        caratWeight: caratWeight ? parseFloat(caratWeight.toString()) : null,
        certifiedBy: certifiedBy || null,
        shopId,
      },
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Jewelry piece successfully hallmarked and published to boutique catalog!",
        data: product,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Failed to ingest product:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
