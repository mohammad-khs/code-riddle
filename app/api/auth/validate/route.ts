import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionToken, clearSessionCookie } from "@/lib/auth/cookies";
import { hashToken } from "@/lib/auth/session";

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

  const tokenHash = hashToken(token);

  const session = await prisma.session.findFirst({
    where: {
      tokenHash,
      expiresAt: { gt: new Date() },
    },
    include: {
      user: true,
    },
  });

  if (!session) {
    const response = NextResponse.json(
      { success: false, valid: false, message: "Invalid or expired session" },
      { status: 401 },
    );
    clearSessionCookie(response);
    return response;
  }

  // Check if user is suspended
  if (!session.user.isActive) {
    await prisma.session.deleteMany({
      where: { userId: session.userId },
    });
    const response = NextResponse.json(
      { success: false, valid: false, message: "Account suspended" },
      { status: 403 },
    );
    clearSessionCookie(response);
    return response;
  }

  // Sliding expiration - extend session if it's about to expire
  const SLIDING_WINDOW = 1000 * 60 * 60 * 24 * 3; // 3 days
  const SESSION_DURATION = 1000 * 60 * 60 * 24 * 7; // 7 days
  const timeLeft = session.expiresAt.getTime() - Date.now();

  if (timeLeft < SLIDING_WINDOW) {
    await prisma.session.update({
      where: { id: session.id },
      data: {
        expiresAt: new Date(Date.now() + SESSION_DURATION),
      },
    });
  }

  // For solvers, fetch creatorUsername
  let creatorUsername: string | undefined;
  if (session.user.role === "solver" && session.user.creatorId) {
    const creator = await prisma.user.findFirst({
      where: { id: session.user.creatorId },
      select: { username: true },
    });
    creatorUsername = creator?.username;
  }

  return NextResponse.json({
    success: true,
    valid: true,
    user: {
      id: session.user.id,
      username: session.user.username,
      role: session.user.role,
      creatorUsername,
    },
  });
}
