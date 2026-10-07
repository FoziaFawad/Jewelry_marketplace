import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { filename, uploadType } = body;

    if (!filename) {
      return NextResponse.json(
        { success: false, error: "Filename is required" },
        { status: 400 }
      );
    }

    const mockStorageUrl =
      uploadType === "gem_certificate"
        ? `https://images.unsplash.com/photo-1605100804763-247f67b3557e?cert=${Date.now()}`
        : `https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80`;

    return NextResponse.json({
      success: true,
      uploadUrl: `https://upload.market.jewelry/presigned/${encodeURIComponent(filename)}`,
      publicUrl: mockStorageUrl,
      fields: {
        key: `uploads/${uploadType || "general"}/${Date.now()}_${filename}`,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Presigned URL generation failed" },
      { status: 500 }
    );
  }
}
