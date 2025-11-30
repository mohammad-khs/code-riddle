import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// POST /api/submit { solver, answers }
export async function POST(req: Request) {
  const body = await req.json();
  const { solver, answers } = body;

  if (!solver)
    return NextResponse.json(
      { success: false, message: "Solver required" },
      { status: 400 }
    );

  if (!Array.isArray(answers))
    return NextResponse.json(
      { success: false, message: "Answers required" },
      { status: 400 }
    );

  try {
    const riddleSet = await prisma.riddleSet.findFirst({
      where: { solver },
      include: {
        riddles: true,
        prize: true,
      },
    });

    if (!riddleSet)
      return NextResponse.json(
        { success: false, message: "No riddles for this solver" },
        { status: 404 }
      );

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
      return NextResponse.json({
        success: true,
        prize: riddleSet.prize || {},
      });
    }

    return NextResponse.json({ success: false, correctCount, total });
  } catch (error) {
    console.error("Error submitting answers:", error);
    return NextResponse.json(
      { success: false, message: "Error submitting answers" },
      { status: 500 }
    );
  }
}
