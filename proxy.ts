// Session validation is handled by API routes and server components
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionToken } from "@/lib/auth/cookies";

export function proxy(req: NextRequest) {
  const token = getSessionToken(req);

  // No token - redirect to appropriate login
  if (!token) {
    const pathname = req.nextUrl.pathname;
    const loginUrl = pathname.startsWith("/solver")
      ? new URL("/solver/login", req.url)
      : new URL("/creator/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Token exists - pass it to downstream via header
  // Actual session validation happens in API routes/server components
  const response = NextResponse.next();
  response.headers.set("x-session-token", token);

  return response;
}

export const config = {
  matcher: [
    "/creator/dashboard/:path*",
    "/creator/register-solver/:path*",
    "/solver/solve/:path*",
  ],
};
