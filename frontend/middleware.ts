import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Edge Middleware
 * 
 * Enforces pre-render edge authentication guards for privileged routes
 * (/admin and /cms) to prevent unauthorized bundle execution and data exposure.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve auth token from cookies
  const authToken = request.cookies.get('token')?.value || request.cookies.get('auth_token')?.value;

  // If attempting to access protected admin or CMS route without token
  if (!authToken) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Pass through with edge security headers
  const response = NextResponse.next();
  response.headers.set('X-Edge-Protected-Route', 'true');
  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/cms/:path*',
  ],
};
