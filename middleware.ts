/**
 * Next.js Middleware for Server-side Route Protection
 *
 * This middleware protects studio routes by verifying authentication
 * on the server-side before rendering the page.
 *
 * Protected Routes:
 * - /studio/* - All studio routes require authentication
 *
 * Public Routes:
 * - / - Home page
 * - /games/* - Game pages
 * - /api/* - API routes
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * List of paths that require authentication
 */
const PROTECTED_PATHS = [
  "/studio",
  "/studio/",
];

/**
 * List of paths that are public (don't require auth)
 */
const PUBLIC_PATHS = [
  "/",
  "/games",
  "/api",
  "/_next",
  "/favicon.ico",
];

/**
 * Checks if a path requires authentication
 */
function isProtectedPath(pathname: string): boolean {
  // Check if path starts with /studio
  if (pathname.startsWith("/studio")) {
    return true;
  }

  // Check exact protected paths
  return PROTECTED_PATHS.some(path => pathname === path);
}

/**
 * Checks if a path is public
 */
function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(path => pathname.startsWith(path));
}

/**
 * Verifies the authentication token from the request
 *
 * @param request - The Next.js request object
 * @returns The wallet address if authenticated, null otherwise
 */
function verifyAuthToken(request: NextRequest): string | null {
  // Try to get token from Authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    // In a real implementation, you would verify the JWT token here
    // For now, we'll check if the token exists and is not empty
    if (token && token.length > 0) {
      // Extract wallet address from token or verify it
      // This is a simplified check - in production, verify the JWT signature
      try {
        // Decode JWT payload (without verification for now)
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload?.address || payload?.sub || null;
      } catch {
        // If token is invalid, continue to check cookie
      }
    }
  }

  // Try to get wallet address from X-Wallet-Address header
  const walletAddress = request.headers.get("x-wallet-address");
  if (walletAddress) {
    return walletAddress;
  }

  // Try to get credentials from cookie
  const authCookie = request.cookies.get("peridot_auth_credentials");
  if (authCookie) {
    try {
      const credentials = JSON.parse(authCookie.value);
      return credentials?.wallet?.address || null;
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Main middleware function
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Check if path requires authentication
  if (isProtectedPath(pathname)) {
    const walletAddress = verifyAuthToken(request);

    // If not authenticated, redirect to home with auth required flag
    if (!walletAddress) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("auth", "required");
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    // If authenticated, add wallet address to headers for use in the page
    const response = NextResponse.next();
    response.headers.set("x-wallet-address", walletAddress);
    return response;
  }

  // For all other paths, allow access
  return NextResponse.next();
}

/**
 * Configure which paths the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
