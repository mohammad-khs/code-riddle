import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/riddles?solver=username
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const solver = searchParams.get("solver");

  if (!solver) return NextResponse.json({});

  try {
    const riddleSet = await prisma.riddleSet.findFirst({
      where: { solver },
      include: {
        riddles: true,
        prize: true,
      },
    });
    return NextResponse.json(riddleSet || {});
  } catch (error) {
    console.error("Error fetching riddles:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching riddles" },
      { status: 500 }
    );
  }
}

// POST /api/riddles { action: "save", solver, riddles, prizeLetter, prizeMusicBase64 }
export async function POST(req: Request) {
  const body = await req.json();
  const { action } = body;

  if (action === "save") {
    const {
      solver,
      riddles,
      prizeLetter,
      prizeMusicBase64,
      mainMusicBase64,
      backgroundImageBase64,
      createdBy,
    } = body;

    if (!solver)
      return NextResponse.json(
        { success: false, message: "Solver required" },
        { status: 400 }
      );

    // Store music base64 directly in database (or empty string if not provided)
    const prizeMusic = prizeMusicBase64 || "";
    const mainMusic = mainMusicBase64 || "";
    const backgroundImage = backgroundImageBase64 || "";

    try {
      // Find existing RiddleSet
      const existingSet = await prisma.riddleSet.findFirst({
        where: { solver },
      });

      if (existingSet) {
        // Delete existing riddles and prize
        await prisma.riddle.deleteMany({
          where: { setId: existingSet.id },
        });
        await prisma.prize.deleteMany({
          where: { setId: existingSet.id },
        });

        // Update the RiddleSet
        await prisma.riddleSet.update({
          where: { id: existingSet.id },
          data: {
            mainMusic: mainMusic,
            riddles: {
              create: (riddles || []).map((r: any) => ({
                question: r.question,
                answer: r.answer,
              })),
            },
            prize: {
              create: {
                letter: prizeLetter || "",
                music: prizeMusic,
                backgroundImage: backgroundImage,
              },
            },
          },
        });
      } else {
        // Create new RiddleSet
        await prisma.riddleSet.create({
          data: {
            solver,
            createdBy: createdBy || "unknown",
            mainMusic: mainMusic,
            riddles: {
              create: (riddles || []).map((r: any) => ({
                question: r.question,
                answer: r.answer,
              })),
            },
            prize: {
              create: {
                letter: prizeLetter || "",
                music: prizeMusic,
                backgroundImage: backgroundImage,
              },
            },
          },
        });
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error saving riddles:", error);
      return NextResponse.json(
        { success: false, message: "Error saving riddles" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { success: false, message: "Unknown action" },
    { status: 400 }
  );
}
