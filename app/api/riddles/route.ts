import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { getSessionToken } from "@/lib/auth/cookies";
import { validateSession } from "@/lib/auth/session";

interface RiddleInput {
  question: string;
  answer: string;
}

// Helper to get authenticated user
async function getAuthenticatedUser(req: Request) {
  const token = getSessionToken(req);
  if (!token) return null;
  return validateSession(token);
}

// GET /api/riddles?solver=username
// Authorization:
// - Creators: can only see riddles for their own solvers
// - Solvers: can only see their own riddles
export async function GET(req: Request) {
  try {
    // Authenticate user
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(req.url);
    const solverUsername = searchParams.get("solver");

    if (!solverUsername) {
      return NextResponse.json(
        { success: false, message: "solver username required" },
        { status: 400 },
      );
    }

    let solver;
    let creator;

    if (user.role === "creator") {
      // Creator mode: can only access their own solvers
      creator = await prisma.user.findUnique({
        where: { id: user.id },
      });

      if (!creator) {
        return NextResponse.json(
          { success: false, message: "Creator not found" },
          { status: 404 },
        );
      }

      // Find solver that belongs to this creator
      solver = await prisma.user.findFirst({
        where: {
          username: solverUsername,
          role: "solver",
          creatorId: creator.id,
        },
      });
    } else if (user.role === "solver") {
      // Solver mode: can only see their own riddles
      if (user.username !== solverUsername) {
        return NextResponse.json(
          {
            success: false,
            message: "Forbidden: can only access your own riddles",
          },
          { status: 403 },
        );
      }

      solver = await prisma.user.findUnique({
        where: { id: user.id },
        include: {
          creatorRiddleSets: {
            include: {
              creator: true,
            },
          },
        },
      });

      if (solver?.creatorId) {
        creator = await prisma.user.findUnique({
          where: { id: solver.creatorId },
        });
      }
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid role" },
        { status: 403 },
      );
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

    const supabase = await createClient();
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

// POST /api/riddles { action: "save", solver, riddles, prizeLetter, prizeMusicPath, mainMusicPath, backgroundImagePath }
// Authorization: Only creators can save riddles, and only for their own solvers
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

    // Only creators can save riddles
    if (user.role !== "creator") {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden: only creators can save riddles",
        },
        { status: 403 },
      );
    }

    const body = await req.json();
    const { action } = body;

    if (action === "save") {
      const {
        solver: solverUsername,
        riddles,
        prizeLetter,
        prizeMusicPath,
        mainMusicPath,
        backgroundImagePath,
      } = body;

      if (!solverUsername) {
        return NextResponse.json(
          { success: false, message: "solver username required" },
          { status: 400 },
        );
      }

      // Get creator from authenticated session
      const creatorId = user.id;

      // Find solver by username AND creatorId (multi-tenant isolation)
      const solverUser = await prisma.user.findFirst({
        where: {
          username: solverUsername,
          role: "solver",
          creatorId: creatorId,
        },
      });

      if (!solverUser) {
        return NextResponse.json(
          {
            success: false,
            message: "Solver not found or doesn't belong to you",
          },
          { status: 404 },
        );
      }

      const solverId = solverUser.id;

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
    }

    return NextResponse.json(
      { success: false, message: "Unknown action" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Error saving riddles:", error);
    return NextResponse.json(
      { success: false, message: "Error saving riddles" },
      { status: 500 },
    );
  }
}
