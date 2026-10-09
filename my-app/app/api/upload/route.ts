import { NextResponse } from "next/server";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    // 1. Multipart Form Data (Native file upload from browser)
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const folder = (formData.get("folder") as string) || "jewelry_marketplace";

      if (!file) {
        return NextResponse.json(
          { success: false, error: "No image file provided in form data" },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await uploadImageToCloudinary(buffer, folder);

      return NextResponse.json({
        success: true,
        url: result.secure_url,
        publicUrl: result.secure_url,
        publicId: result.public_id,
      });
    }

    // 2. JSON Body (Base64 image or Image URL)
    const body = await request.json();
    const { image, url, folder = "jewelry_marketplace" } = body;

    const target = image || url;
    if (!target) {
      return NextResponse.json(
        { success: false, error: "No image data or URL provided" },
        { status: 400 }
      );
    }

    const result = await uploadImageToCloudinary(target, folder);

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error: any) {
    console.error("Cloudinary upload failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to upload image to cloud storage",
      },
      { status: 500 }
    );
  }
}
