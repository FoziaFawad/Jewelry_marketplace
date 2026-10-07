import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth-server";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    return NextResponse.json({
      authenticated: true,
      user: session,
    });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
  }
}
