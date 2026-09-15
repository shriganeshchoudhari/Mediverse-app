import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Edge Middleware
 *
 * Enforces cryptographic JWT signature validation for privileged routes
 * (/admin and /cms). A mere presence check is insufficient — an attacker can
 * forge an arbitrary string in the cookie. This middleware verifies the
 * HMAC-SHA256 signature using native Web Crypto API (crypto.subtle) without
 * requiring external dependencies.
 */

function base64UrlDecode(str: string): Uint8Array {
  const m = str.length % 4;
  const base64 = (m ? str + '='.repeat(4 - m) : str)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function verifyHmacSha256(token: string, secret: string): Promise<boolean> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const [headerB64, payloadB64, sigB64] = parts;

    // Decode and check header algorithm
    const headerStr = new TextDecoder().decode(base64UrlDecode(headerB64));
    const header = JSON.parse(headerStr);
    if (header.alg !== 'HS256') return false;

    // Import secret key for HMAC verification
    const keyData = new TextEncoder().encode(secret);
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData as unknown as BufferSource,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    // Verify cryptographic signature
    const dataToSign = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
    const signature = base64UrlDecode(sigB64);
    const isValid = await crypto.subtle.verify(
      'HMAC',
      cryptoKey,
      signature as unknown as BufferSource,
      dataToSign as unknown as BufferSource
    );
    if (!isValid) return false;

    // Parse payload and check expiration
    const payloadStr = new TextDecoder().decode(base64UrlDecode(payloadB64));
    const payload = JSON.parse(payloadStr);

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return false;
    if (payload.nbf && payload.nbf > now) return false;

    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve auth token from cookies (supports both naming conventions)
  const authToken =
    request.cookies.get('token')?.value ||
    request.cookies.get('auth_token')?.value;

  // No token present — redirect immediately
  if (!authToken) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Cryptographically verify JWT signature and expiry
  const secret = process.env.JWT_SECRET || 'mediverse-dev-secret-key-change-in-prod';
  const isValid = await verifyHmacSha256(authToken, secret);

  if (!isValid) {
    // Expired, tampered, or unsigned token — reject
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Propagate with edge-level security marker for observability
  const response = NextResponse.next();
  response.headers.set('X-Edge-Protected-Route', 'true');
  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/cms/:path*',
    '/emr/:path*',
    '/osce/:path*',
  ],
};
