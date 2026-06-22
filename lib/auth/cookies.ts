import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function getSessionToken(req: Request | NextRequest): string | null {
  // Works for both Request and NextRequest
  if ("cookies" in req && typeof req.cookies.get === "function") {
    return req.cookies.get("session")?.value ?? null;
  }
  // Fallback for standard Request with cookie header
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return null;
  const match = cookieHeader
    .split(";")
    .find((c) => c.trim().startsWith("session="));
  return match ? match.split("=")[1] : null;
}
