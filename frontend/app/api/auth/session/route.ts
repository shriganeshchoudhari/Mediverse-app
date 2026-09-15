import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/session
 * Body: { token: string }
 * Sets the access token as an HttpOnly, Secure, SameSite=Strict cookie.
 * The cookie is unreadable by client-side JavaScript (XSS mitigation).
 */
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "token is required" }, { status: 400 });
    }
    const response = NextResponse.json({ ok: true });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours - matches backend JWT TTL
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

/**
 * DELETE /api/auth/session
 * Clears the HttpOnly cookie by setting it with maxAge=0.
 */
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}
