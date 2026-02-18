import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

interface RiddleInput {
  question: string;
  answer: string;
}

// GET /api/riddles?solver=username
// Optionally: ?creator=username (for creator dashboard use)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const solverUsername = searchParams.get("solver");
    const creatorUsername = searchParams.get("creator");

    if (!solverUsername) {
      return NextResponse.json(
        { success: false, message: "solver username required" },
        { status: 400 },
      );
    }

    let solver;
    let creator;

    if (creatorUsername) {
      // Creator dashboard mode: find by creator + solver
      creator = await prisma.user.findFirst({
        where: { username: creatorUsername, role: "creator", creatorId: null },
      });

      if (!creator) {
        return NextResponse.json({}, { status: 404 });
      }

      solver = await prisma.user.findFirst({
        where: {
          username: solverUsername,
          role: "solver",
          creatorId: creator.id,
        },
      });
    } else {
      // Solver mode: find solver and lookup creator
      solver = await prisma.user.findFirst({
        where: {
          username: solverUsername,
          role: "solver",
        },
        include: {
          creatorRiddleSets: {
            include: {
              creator: true,
            },
          },
        },
      });

      if (solver && solver.creatorId) {
        creator = await prisma.user.findFirst({
          where: { id: solver.creatorId },
        });
      }
    }

    if (!solver) {
      return NextResponse.json({});
    }

    // Get the riddle set for this solver
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
    const result = {
      solver: { id: solver.id, username: solver.username },
      creatorUsername: creator?.username,
      riddleSet: { ...riddleSet },
    };

    // Generate signed URLs for media files
    if (result.riddleSet.mainMusic) {
      try {
        const { data } = await supabase.storage
          .from("uploads")
          .createSignedUrl(result.riddleSet.mainMusic, 3600);
        result.riddleSet.mainMusic =
          data?.signedUrl || result.riddleSet.mainMusic;
      } catch (e) {
        console.error("Error generating signed URL for mainMusic:", e);
      }
    }

    if (result.riddleSet.prize?.music) {
      try {
        const { data } = await supabase.storage
          .from("uploads")
          .createSignedUrl(result.riddleSet.prize.music, 3600);
        result.riddleSet.prize.music =
          data?.signedUrl || result.riddleSet.prize.music;
      } catch (e) {
        console.error("Error generating signed URL for prize music:", e);
      }
    }

    if (result.riddleSet.prize?.backgroundImage) {
      try {
        const { data } = await supabase.storage
          .from("uploads")
          .createSignedUrl(result.riddleSet.prize.backgroundImage, 3600);
        result.riddleSet.prize.backgroundImage =
          data?.signedUrl || result.riddleSet.prize.backgroundImage;
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
      // Find creator first
      const creatorUser = await prisma.user.findFirst({
        where: { username: creatorUsername, role: "creator", creatorId: null },
      });

      if (!creatorUser) {
        return NextResponse.json(
          { success: false, message: "Creator not found" },
          { status: 404 },
        );
      }

      // Find solver by username AND creatorId (multi-tenant)
      const solverUser = await prisma.user.findFirst({
        where: {
          username: solver,
          role: "solver",
          creatorId: creatorUser.id,
        },
      });

      if (!solverUser) {
        return NextResponse.json(
          { success: false, message: "Solver not found" },
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
