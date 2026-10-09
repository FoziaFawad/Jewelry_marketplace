import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const shop = await prisma.shop.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true, role: true },
        },
        products: {
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: { products: true },
        },
      },
    });

    if (!shop) {
      return NextResponse.json(
        { success: false, error: "Boutique shop not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: shop });
  } catch (error) {
    console.error("Failed to fetch shop:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch shop" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug, description, logoUrl, bannerUrl, status } = body;

    const existing = await prisma.shop.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Boutique shop not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.shop.update({
      where: { id: existing.id },
      data: {
        ...(name ? { name: name.trim() } : {}),
        ...(slug ? { slug: slug.trim() } : {}),
        ...(description !== undefined ? { description: description?.trim() } : {}),
        ...(logoUrl ? { logoUrl } : {}),
        ...(bannerUrl ? { bannerUrl } : {}),
        ...(status ? { status } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Boutique details updated successfully",
      data: updated,
    });
  } catch (error: any) {
    console.error("Failed to update boutique:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update boutique" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.shop.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Boutique shop not found" },
        { status: 404 }
      );
    }

    // Delete shop from database (cascade deletes products)
    await prisma.shop.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({
      success: true,
      message: `Boutique "${existing.name}" and all its inventory have been permanently deleted`,
    });
  } catch (error: any) {
    console.error("Failed to delete boutique:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete boutique" },
      { status: 500 }
    );
  }
}
