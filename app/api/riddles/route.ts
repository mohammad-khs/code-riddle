import { NextResponse } from "next/server";
import { readJSON, writeJSON, saveMusicBase64 } from "../../../lib/storage";

const RIDDLES_PATH = "data/riddles.json";

// GET /api/riddles?solver=username
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const solver = searchParams.get("solver");
  const sets = await readJSON(RIDDLES_PATH);
  if (!solver) return NextResponse.json([]);
  const found = sets.find((s: any) => s.solver === solver);
  return NextResponse.json(found || {});
}

// POST /api/riddles { action: "save", solver, riddles, prizeLetter, prizeMusicBase64 }
export async function POST(req: Request) {
  const body = await req.json();
  const { action } = body;
  if (action === "save") {
    const { solver, riddles, prizeLetter, prizeMusicBase64 } = body;
    if (!solver)
      return NextResponse.json(
        { success: false, message: "Solver required" },
        { status: 400 }
      );
    let prizeMusic = "";
    if (prizeMusicBase64) {
      try {
        prizeMusic = await saveMusicBase64(prizeMusicBase64);
      } catch (e) {
        console.error(e);
      }
    }
    const sets = await readJSON(RIDDLES_PATH);
    // Overwrite or add
    const idx = sets.findIndex((s: any) => s.solver === solver);
    const newSet = {
      solver,
      riddles: riddles || [],
      prize: { letter: prizeLetter || "", music: prizeMusic },
    };
    if (idx >= 0) sets[idx] = newSet;
    else sets.push(newSet);
    await writeJSON(RIDDLES_PATH, sets);
    return NextResponse.json({ success: true });
  }
  return NextResponse.json(
    { success: false, message: "Unknown action" },
    { status: 400 }
  );
}
