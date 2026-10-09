import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth-server";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    const response = NextResponse.json({
      authenticated: true,
      user: session,
    });

    if (session.role) {
      response.cookies.set("user_role", session.role, {
        path: "/",
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
      });
    }

    return response;
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
  }
}
