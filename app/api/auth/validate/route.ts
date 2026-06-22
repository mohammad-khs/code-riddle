import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionToken, clearSessionCookie } from "@/lib/auth/cookies";
import { validateSession } from "@/lib/auth/session";

// Session validation endpoint - runs in Node.js runtime (not Edge)
// This is called by client components to verify session validity
export async function GET(req: NextRequest) {
  const token = getSessionToken(req);

  if (!token) {
    return NextResponse.json(
      { success: false, valid: false, message: "No session token" },
      { status: 401 },
    );
  }

  const user = await validateSession(token);

  if (!user) {
    const response = NextResponse.json(
      { success: false, valid: false, message: "Invalid or expired session" },
      { status: 401 },
    );
    clearSessionCookie(response);
    return response;
  }

  // For solvers, fetch creatorUsername
  let creatorUsername: string | undefined;
  if (user.role === "solver" && user.creatorId) {
    const creator = await prisma.user.findUnique({
      where: { id: user.creatorId },
      select: { username: true },
    });
    creatorUsername = creator?.username;
  }

  return NextResponse.json({
    success: true,
    valid: true,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      creatorUsername,
    },
  });
}
