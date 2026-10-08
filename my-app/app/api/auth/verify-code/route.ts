import { NextResponse } from "next/server";
import { verifyCode } from "@/lib/verification";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { success: false, error: "Email and verification code are required" },
        { status: 400 }
      );
    }

    const result = verifyCode(email, code);

    if (!result.valid) {
      return NextResponse.json(
        { success: false, error: result.error || "Invalid verification code" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email address verified successfully",
    });
  } catch (error: any) {
    console.error("verify-code route error:", error);
    return NextResponse.json(
      { success: false, error: "Verification process encountered an error" },
      { status: 500 }
    );
  }
}
