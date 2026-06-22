import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { AuthRequestBody } from "@/types/auth";
import {
  createSession,
  generateSessionToken,
  deleteSession,
  deleteAllSessions,
  validateSession,
} from "@/lib/auth/session";
import {
  setSessionCookie,
  clearSessionCookie,
  getSessionToken,
} from "@/lib/auth/cookies";

export async function POST(req: Request) {
  try {
    const body: AuthRequestBody = await req.json();
    const { action, username, password, userType, creatorUsername } = body;

    if (action === "logout") {
      const token = getSessionToken(req);

      if (token) {
        await deleteSession(token);
      }

      const response = NextResponse.json({ success: true });
      clearSessionCookie(response);

      return response;
    }

    if (action === "logout_all") {
      const token = getSessionToken(req);

      if (!token) {
        return NextResponse.json(
          { success: false, message: "Unauthorized" },
          { status: 401 },
        );
      }

      const user = await validateSession(token);
      if (!user) {
        const response = NextResponse.json(
          { success: false, message: "Unauthorized" },
          { status: 401 },
        );
        clearSessionCookie(response);
        return response;
      }

      await deleteAllSessions(user.id);

      const response = NextResponse.json({ success: true });
      clearSessionCookie(response);

      return response;
    }

    if (action === "list_solvers") {
      if (!creatorUsername) {
        return NextResponse.json(
          { success: false, message: "creatorUsername is required" },
          { status: 400 },
        );
      }

      const creator = await prisma.user.findFirst({
        where: {
          username: creatorUsername,
          role: "creator",
          creatorId: null,
          isActive: true,
        },
      });

      if (!creator) {
        return NextResponse.json(
          { success: false, message: "Creator not found or inactive" },
          { status: 404 },
        );
      }

      const solvers = await prisma.user.findMany({
        where: {
          role: "solver",
          creatorId: creator.id,
          isActive: true,
        },
        select: {
          username: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({
        success: true,
        solvers: solvers.map((s) => s.username),
      });
    }

    if (!username || !password || !userType) {
      return NextResponse.json(
        {
          success: false,
          message: "username, password and userType are required",
        },
        { status: 400 },
      );
    }

    if (!["creator", "solver"].includes(userType)) {
      return NextResponse.json(
        { success: false, message: "userType must be 'creator' or 'solver'" },
        { status: 400 },
      );
    }

    if (action === "register") {
      let creatorIdForSolver: string | null = null;

      if (userType === "solver") {
        if (!creatorUsername) {
          return NextResponse.json(
            {
              success: false,
              message: "creatorUsername required for solver registration",
            },
            { status: 400 },
          );
        }

        const creator = await prisma.user.findFirst({
          where: {
            username: creatorUsername,
            role: "creator",
            creatorId: null,
            isActive: true,
          },
        });

        if (!creator) {
          return NextResponse.json(
            { success: false, message: "Creator not found or inactive" },
            { status: 404 },
          );
        }

        creatorIdForSolver = creator.id;

        const existingSolver = await prisma.user.findFirst({
          where: {
            username,
            creatorId: creator.id,
          },
        });

        if (existingSolver) {
          return NextResponse.json(
            {
              success: false,
              message: "This username is already taken for this creator",
            },
            { status: 409 },
          );
        }
      } else {
        const existingCreator = await prisma.user.findFirst({
          where: {
            username,
            creatorId: null,
          },
        });

        if (existingCreator) {
          return NextResponse.json(
            { success: false, message: "Username already exists" },
            { status: 409 },
          );
        }
      }

      const hashedPassword = await hashPassword({ password });

      const newUser = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          role: userType,
          creatorId: creatorIdForSolver,
        },
      });

      return NextResponse.json({
        success: true,
        message: "User registered successfully",
        user: {
          id: newUser.id,
          username: newUser.username,
          role: newUser.role,
        },
      });
    }

    if (action === "login") {
      // For creators, look for user with username and null creatorId
      // For solvers, look for user with username and matching creator
      let user;

      if (userType === "creator") {
        user = await prisma.user.findFirst({
          where: {
            username,
            creatorId: null,
            role: "creator",
          },
        });
      } else {
        // For solver login, we need creatorUsername to identify which creator's solver
        if (!creatorUsername) {
          return NextResponse.json(
            {
              success: false,
              message: "creatorUsername is required for solver login",
            },
            { status: 400 },
          );
        }

        const creator = await prisma.user.findFirst({
          where: {
            username: creatorUsername,
            role: "creator",
            creatorId: null,
          },
        });

        if (!creator) {
          return NextResponse.json(
            { success: false, message: "Creator not found" },
            { status: 404 },
          );
        }

        user = await prisma.user.findFirst({
          where: {
            username,
            creatorId: creator.id,
            role: "solver",
          },
        });
      }

      if (!user || !user.isActive) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid credentials or account inactive",
          },
          { status: 401 },
        );
      }

      const passwordValid = await verifyPassword({
        hash: user.password,
        password,
      });

      if (!passwordValid) {
        return NextResponse.json(
          { success: false, message: "Invalid credentials" },
          { status: 401 },
        );
      }

      const token = generateSessionToken();
      const ip = req.headers.get("x-forwarded-for") || "unknown";
      const userAgent = req.headers.get("user-agent") || "unknown";

      await createSession(user.id, token, ip, userAgent);

      const response = NextResponse.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      });

      // Set HttpOnly cookie using helper
      setSessionCookie(response, token);

      return response;
    }

    return NextResponse.json(
      { success: false, message: "Unknown action" },
      { status: 400 },
    );
  } catch (err) {
    console.error("Auth API error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
