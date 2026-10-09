import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession, createSessionToken } from "@/lib/auth-server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const ownerId = searchParams.get("ownerId");
    const search = searchParams.get("search");

    const where: any = {};
    if (status) {
      where.status = status.toUpperCase();
    }
    if (ownerId) {
      where.ownerId = ownerId;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const shops = await prisma.shop.findMany({
      where,
      include: {
        owner: {
          select: { id: true, name: true, email: true, role: true },
        },
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
    const session = await getServerSession();
    const body = await request.json();
    const { name, description, ownerId, logoUrl, bannerUrl, status = "ACTIVE" } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Boutique shop name is required" },
        { status: 400 }
      );
    }

    // Determine owner
    let targetOwnerId = ownerId || session?.id;

    if (!targetOwnerId) {
      const defaultVendor = await prisma.user.findFirst({
        where: { role: "VENDOR" },
      });
      targetOwnerId = defaultVendor?.id;
    }

    if (!targetOwnerId) {
      // Create a default artisan user if none exists
      const newArtisan = await prisma.user.create({
        data: {
          name: `${name.trim()} Master Artisan`,
          email: `artisan-${Date.now()}@eternelle.com`,
          role: "VENDOR",
        },
      });
      targetOwnerId = newArtisan.id;
    }

    // Check if owner already has a shop (since ownerId is @unique on Shop)
    const existingShop = await prisma.shop.findUnique({
      where: { ownerId: targetOwnerId },
    });

    if (existingShop) {
      // If user already owns a shop, update it or return helpful message
      return NextResponse.json(
        {
          success: false,
          error: `You already own an active boutique: "${existingShop.name}". You can edit it in Settings or delete it first.`,
          existingShop,
        },
        { status: 400 }
      );
    }

    // Ensure user role is updated to VENDOR
    await prisma.user.update({
      where: { id: targetOwnerId },
      data: { role: "VENDOR" },
    });

    const baseSlug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
    let slug = baseSlug;
    let counter = 1;

    // Ensure unique slug
    while (await prisma.shop.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const newShop = await prisma.shop.create({
      data: {
        name: name.trim(),
        slug,
        description: description?.trim() || `Master jewelry atelier showcasing bespoke handcrafted fine jewelry.`,
        logoUrl:
          logoUrl ||
          "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80",
        bannerUrl:
          bannerUrl ||
          "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=80",
        status: status === "PENDING_VERIFICATION" ? "PENDING_VERIFICATION" : "ACTIVE",
        ownerId: targetOwnerId,
      },
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Atelier boutique successfully established and published to marketplace!",
        data: newShop,
      },
      { status: 201 }
    );

    // If active session belongs to this user, update session cookie with new shop details
    if (session && session.id === targetOwnerId) {
      const updatedSession = {
        ...session,
        role: "VENDOR" as const,
        shopId: newShop.id,
        shopSlug: newShop.slug,
        shopName: newShop.name,
      };
      const newToken = createSessionToken(updatedSession);
      response.cookies.set("auth_session", newToken, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
      });
      response.cookies.set("user_role", "VENDOR", {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
      });
    }

    return response;
  } catch (error: any) {
    console.error("Failed to create boutique:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create boutique" },
      { status: 500 }
    );
  }
}
