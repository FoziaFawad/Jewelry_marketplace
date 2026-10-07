import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  // Clear auth cookies
  response.cookies.delete("auth_session");
  response.cookies.delete("user_role");
  response.cookies.delete("user_email");
  response.cookies.delete("user_name");

  return response;
}
