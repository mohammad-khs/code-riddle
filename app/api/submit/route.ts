import { NextResponse } from "next/server";
import { readJSON } from "../../../lib/storage";

const RIDDLES_PATH = "data/riddles.json";

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
  const sets = await readJSON(RIDDLES_PATH);
  const set = sets.find((s: any) => s.solver === solver);
  if (!set)
    return NextResponse.json(
      { success: false, message: "No riddles for this solver" },
      { status: 404 }
    );
  const riddles = set.riddles || [];
  const total = riddles.length;
  // check provided answers one-by-one
  let correctCount = 0;
  for (let i = 0; i < riddles.length; i++) {
    const ans = (answers[i] || "").toString().trim().toLowerCase();
    const expected = (riddles[i].answer || "").toString().trim().toLowerCase();
    if (ans === expected) correctCount++;
  }
  if (correctCount === total) {
    return NextResponse.json({ success: true, prize: set.prize || {} });
  }
  return NextResponse.json({ success: false, correctCount, total });
}
