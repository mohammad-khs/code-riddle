import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient({
});

function hash(pw: string) {
  return crypto.createHash("sha256").update(pw).digest("hex");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, username, password, userType, creatorUsername } = body;

    // List all solvers for a specific creator
    if (action === "list_solvers") {
      const creator = body.creator;
      if (!creator) {
        return NextResponse.json(
          { success: false, message: "Creator username required" },
          { status: 400 }
        );
      }
      const solvers = await prisma.user.findMany({
        where: {
          userType: "solver",
          createdBy: creator,
        },
        select: {
          username: true,
        },
      });
      return NextResponse.json({
        solvers: solvers.map((s: { username: string }) => s.username),
      });
    }

    if (!username || !password || !userType) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    if (action === "register") {
      // Solvers can only be registered by creators
      if (userType === "solver") {
        if (!creatorUsername) {
          return NextResponse.json(
            {
              success: false,
              message: "Creator username required for solver registration",
            },
            { status: 400 }
          );
        }
        // Verify that the creator exists
        const creatorExists = await prisma.user.findUnique({
          where: { username: creatorUsername },
        });
        if (!creatorExists || creatorExists.userType !== "creator") {
          return NextResponse.json(
            { success: false, message: "Creator not found" },
            { status: 404 }
          );
        }
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });
      if (existingUser && existingUser.userType === userType) {
        return NextResponse.json(
          { success: false, message: "User exists" },
          { status: 400 }
        );
      }

      const user = await prisma.user.create({
        data: {
          username,
          password: hash(password),
          userType,
          createdBy: userType === "solver" ? creatorUsername : null,
        },
      });

      return NextResponse.json({
        success: true,
        user: { id: user.id, username, userType },
      });
    }

    if (action === "login") {
      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user || user.userType !== userType) {
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 }
        );
      }

      if (user.password !== hash(password)) {
        return NextResponse.json(
          { success: false, message: "Invalid credentials" },
          { status: 401 }
        );
      }

      const token = crypto
        .createHash("sha1")
        .update(`${username}:${userType}:${Date.now()}`)
        .digest("hex");

      return NextResponse.json({
        success: true,
        token,
        user: { id: user.id, username, userType },
      });
    }

    return NextResponse.json(
      { success: false, message: "Unknown action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
