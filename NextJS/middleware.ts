import { NextRequest, NextResponse } from "next/server";

const PROTECTED = ["/dashboard", "/profile", "/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;

  // Redirect unauthenticated users away from protected routes
  const isProtected = PROTECTED.some(r => pathname.startsWith(r));
  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin route — check role encoded in token (simplified)
  if (pathname.startsWith("/admin") && token) {
    const isAdmin = token.includes("admin");
    if (!isAdmin)
      return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // Add security headers on every response
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
