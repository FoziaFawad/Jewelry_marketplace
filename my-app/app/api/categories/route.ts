import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json({
      success: true,
      data: categories,
      total: categories.length,
    });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, description, imageUrl } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Category name is required" },
        { status: 400 }
      );
    }

    const generatedSlug =
      slug?.trim() ||
      name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");

    const existing = await prisma.category.findFirst({
      where: {
        OR: [{ name: name.trim() }, { slug: generatedSlug }],
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Category with this name or slug already exists" },
        { status: 409 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: generatedSlug,
        description: description?.trim() || "",
        imageUrl:
          imageUrl ||
          "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully",
        data: category,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Failed to create category:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create category" },
      { status: 500 }
    );
  }
}
