import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { getSessionToken } from "@/lib/auth/cookies";
import { validateSession } from "@/lib/auth/session";

interface Prize {
  id: string;
  setId: string;
  letter: string;
  music: string | null;
  backgroundImage: string | null;
  createdAt: Date;
}

// Helper to get authenticated user
async function getAuthenticatedUser(req: Request) {
  const token = getSessionToken(req);
  if (!token) return null;
  return validateSession(token);
}

// POST /api/submit { answers }
// Authorization: Only solvers can submit, and only for their own riddles
// Identity comes from session, NOT from body
export async function POST(req: Request) {
  try {
    // Authenticate user
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // Only solvers can submit answers
    if (user.role !== "solver") {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden: only solvers can submit answers",
        },
        { status: 403 },
      );
    }

    const body = await req.json();
    const { answers } = body;

    if (!Array.isArray(answers)) {
      return NextResponse.json(
        { success: false, message: "Answers required" },
        { status: 400 },
      );
    }

    // Use authenticated user's ID directly - no username lookup needed
    const solverId = user.id;

    const riddleSet = await prisma.riddleSet.findFirst({
      where: { solverId },
      include: {
        riddles: true,
        prize: true,
      },
    });

    if (!riddleSet) {
      return NextResponse.json(
        { success: false, message: "No riddles found for your account" },
        { status: 404 },
      );
    }

    const riddles = riddleSet.riddles || [];
    const total = riddles.length;

    // Check provided answers one-by-one
    let correctCount = 0;
    for (let i = 0; i < riddles.length; i++) {
      const ans = (answers[i] || "").toString().trim().toLowerCase();
      const expected = (riddles[i].answer || "")
        .toString()
        .trim()
        .toLowerCase();
      if (ans === expected) correctCount++;
    }

    if (correctCount === total) {
      const supabase = await createClient();
      const prize: Prize = riddleSet.prize || {
        id: "",
        setId: riddleSet.id,
        letter: "",
        music: null,
        backgroundImage: null,
        createdAt: new Date(),
      };

      if (prize.music) {
        try {
          const { data } = await supabase.storage
            .from("uploads")
            .createSignedUrl(prize.music, 3600);
          prize.music = data?.signedUrl || prize.music;
        } catch (e) {
          console.error("Error generating signed URL for prize music:", e);
        }
      }

      if (prize.backgroundImage) {
        try {
          const { data } = await supabase.storage
            .from("uploads")
            .createSignedUrl(prize.backgroundImage, 3600);
          prize.backgroundImage = data?.signedUrl || prize.backgroundImage;
        } catch (e) {
          console.error("Error generating signed URL for background image:", e);
        }
      }

      return NextResponse.json({
        success: true,
        prize,
      });
    }

    return NextResponse.json({ success: false, correctCount, total });
  } catch (error) {
    console.error("Error submitting answers:", error);
    return NextResponse.json(
      { success: false, message: "Error submitting answers" },
      { status: 500 },
    );
  }
}
