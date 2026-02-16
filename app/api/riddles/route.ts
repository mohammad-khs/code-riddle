import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

interface RiddleInput {
  question: string;
  answer: string;
}

// GET /api/riddles?solver=username
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const solverUsername = searchParams.get("solver");

  if (!solverUsername) return NextResponse.json({});

  try {
    // Find the solver user by username
    const solver = await prisma.user.findFirst({
      where: { username: solverUsername, role: "solver" },
    });

    if (!solver) return NextResponse.json({});

    const riddleSet = await prisma.riddleSet.findFirst({
      where: { solverId: solver.id },
      include: {
        riddles: true,
        prize: true,
      },
    });

    if (!riddleSet) {
      return NextResponse.json({});
    }

    const supabase = createClient();
    const result = { ...riddleSet };

    if (result.mainMusic) {
      try {
        const { data } = await supabase.storage
          .from("uploads")
          .createSignedUrl(result.mainMusic, 3600);
        result.mainMusic = data?.signedUrl || result.mainMusic;
      } catch (e) {
        console.error("Error generating signed URL for mainMusic:", e);
      }
    }

    if (result.prize?.music) {
      try {
        const { data } = await supabase.storage
          .from("uploads")
          .createSignedUrl(result.prize.music, 3600);
        result.prize.music = data?.signedUrl || result.prize.music;
      } catch (e) {
        console.error("Error generating signed URL for prize music:", e);
      }
    }

    if (result.prize?.backgroundImage) {
      try {
        const { data } = await supabase.storage
          .from("uploads")
          .createSignedUrl(result.prize.backgroundImage, 3600);
        result.prize.backgroundImage =
          data?.signedUrl || result.prize.backgroundImage;
      } catch (e) {
        console.error("Error generating signed URL for background image:", e);
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching riddles:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching riddles" },
      { status: 500 },
    );
  }
}

// POST /api/riddles { action: "save", solver, creatorUsername, riddles, prizeLetter, prizeMusicPath, mainMusicPath, backgroundImagePath }
export async function POST(req: Request) {
  const body = await req.json();
  const { action } = body;

  if (action === "save") {
    const {
      solver,
      creatorUsername,
      riddles,
      prizeLetter,
      prizeMusicPath,
      mainMusicPath,
      backgroundImagePath,
    } = body;

    if (!solver) {
      return NextResponse.json(
        { success: false, message: "solver username required" },
        { status: 400 },
      );
    }

    if (!creatorUsername) {
      return NextResponse.json(
        { success: false, message: "creatorUsername required" },
        { status: 400 },
      );
    }

    try {
      // Find solver and creator by username
      const solverUser = await prisma.user.findFirst({
        where: { username: solver, role: "solver" },
      });

      if (!solverUser) {
        return NextResponse.json(
          { success: false, message: "Solver not found" },
          { status: 404 },
        );
      }

      const creatorUser = await prisma.user.findFirst({
        where: { username: creatorUsername, role: "creator" },
      });

      if (!creatorUser) {
        return NextResponse.json(
          { success: false, message: "Creator not found" },
          { status: 404 },
        );
      }

      const solverId = solverUser.id;
      const creatorId = creatorUser.id;

      // Store URLs directly in database (or empty string if not provided)
      const prizeMusic = prizeMusicPath || "";
      const mainMusic = mainMusicPath || "";
      const backgroundImage = backgroundImagePath || "";

      // Find existing RiddleSet
      const existingSet = await prisma.riddleSet.findFirst({
        where: { solverId },
      });

      const riddlesData: RiddleInput[] = (riddles || []).map(
        (r: RiddleInput) => ({
          question: r.question,
          answer: r.answer,
        }),
      );

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
              create: riddlesData,
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
            solverId,
            creatorId,
            mainMusic: mainMusic,
            riddles: {
              create: riddlesData,
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
        { status: 500 },
      );
    }
  }

  return NextResponse.json(
    { success: false, message: "Unknown action" },
    { status: 400 },
  );
}
