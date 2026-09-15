import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/mfa
 * Body: { code: string }
 * Verifies the TOTP code against the backend /api/v1/auth/mfa/verify endpoint,
 * or validates the mock dev code (6-digit fallback).
 */
export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    if (!code || typeof code !== "string" || code.length !== 6) {
      return NextResponse.json({ error: "Invalid 6-digit code format" }, { status: 400 });
    }

    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8085";

    try {
      const response = await fetch(`${backendUrl}/api/v1/auth/mfa/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (response.ok) {
        return NextResponse.json({ verified: true });
      }
    } catch {
      // If backend MFA endpoint is not yet connected, accept development mock code 123456
      if (process.env.NODE_ENV !== "production" && code === "123456") {
        return NextResponse.json({ verified: true, mock: true });
      }
    }

    return NextResponse.json({ error: "Invalid authentication code" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Server processing error" }, { status: 500 });
  }
}
