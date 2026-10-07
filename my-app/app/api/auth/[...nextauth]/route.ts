import { NextResponse } from "next/server";
import { DEMO_USERS, SessionUser } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const role = (searchParams.get("role") || "VENDOR").toUpperCase() as keyof typeof DEMO_USERS;
  const user: SessionUser = DEMO_USERS[role] || DEMO_USERS.VENDOR;

  return NextResponse.json({
    user,
    status: "authenticated",
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, role } = body;

    const matchedRole = (role || "BUYER").toUpperCase() as keyof typeof DEMO_USERS;
    const user = DEMO_USERS[matchedRole] || {
      id: "usr_" + Date.now(),
      name: email.split("@")[0],
      email,
      role: matchedRole,
    };

    const response = NextResponse.json({
      success: true,
      user,
    });

    response.cookies.set("user_role", user.role, {
      path: "/",
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "Authentication failed" },
      { status: 400 }
    );
  }
}
