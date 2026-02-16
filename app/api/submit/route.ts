import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

interface Prize {
  id: string;
  setId: string;
  letter: string;
  music: string | null;
  backgroundImage: string | null;
  createdAt: Date;
}

// POST /api/submit { solver, answers }
export async function POST(req: Request) {
  const body = await req.json();
  const { solver, answers } = body;

  if (!solver) {
    return NextResponse.json(
      { success: false, message: "solver username required" },
      { status: 400 },
    );
  }

  if (!Array.isArray(answers)) {
    return NextResponse.json(
      { success: false, message: "Answers required" },
      { status: 400 },
    );
  }

  try {
    // Find solver by username
    const solverUser = await prisma.user.findFirst({
      where: { username: solver, role: "solver" },
    });

    if (!solverUser) {
      return NextResponse.json(
        { success: false, message: "Solver not found" },
        { status: 404 },
      );
    }

    const riddleSet = await prisma.riddleSet.findFirst({
      where: { solverId: solverUser.id },
      include: {
        riddles: true,
        prize: true,
      },
    });

    if (!riddleSet) {
      return NextResponse.json(
        { success: false, message: "No riddles for this solver" },
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
      const supabase = createClient();
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
