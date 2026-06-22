import { prisma } from "@/lib/prisma";
import crypto from "crypto";

const SESSION_DURATION = 1000 * 60 * 60 * 24 * 7; // 7 days
const SLIDING_WINDOW = 1000 * 60 * 60 * 24 * 3; // 3 days

export function generateSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function createSession(
  userId: string,
  token: string,
  ip?: string,
  userAgent?: string,
) {
  const tokenHash = hashToken(token);

  return prisma.session.create({
    data: {
      userId,
      tokenHash,
      ip,
      userAgent,
      expiresAt: new Date(Date.now() + SESSION_DURATION),
    },
  });
}

export async function validateSession(token: string) {
  const tokenHash = hashToken(token);

  // Use findUnique since tokenHash is unique
  const session = await prisma.session.findUnique({
    where: {
      tokenHash,
    },
    include: {
      user: true,
    },
  });

  if (!session) return null;

  // Expiration check
  if (session.expiresAt <= new Date()) {
    // Clean up expired session
    await prisma.session.delete({
      where: { id: session.id },
    });
    return null;
  }

  // Suspend check
  if (!session.user.isActive) {
    await prisma.session.deleteMany({
      where: { userId: session.userId },
    });
    return null;
  }

  // Sliding expiration
  const timeLeft = session.expiresAt.getTime() - Date.now();
  if (timeLeft < SLIDING_WINDOW) {
    await prisma.session.update({
      where: { id: session.id },
      data: {
        expiresAt: new Date(Date.now() + SESSION_DURATION),
      },
    });
  }

  return session.user;
}

export async function deleteSession(token: string) {
  const tokenHash = hashToken(token);
  return prisma.session.deleteMany({
    where: { tokenHash },
  });
}

export async function deleteAllSessions(userId: string) {
  return prisma.session.deleteMany({
    where: { userId },
  });
}
