import { NextResponse } from "next/server";
import { readJSON, writeJSON } from "../../../lib/storage";
import crypto from "crypto";

const USERS_PATH = "data/users.json";

function hash(pw: string) {
  return crypto.createHash("sha256").update(pw).digest("hex");
}

export async function POST(req: Request) {
  const body = await req.json();
  const { action, username, password, userType } = body;

  // List all solvers (for creator dashboard)
  if (action === "list_solvers") {
    const store = await readJSON<{ users: any[] }>(USERS_PATH);
    const solvers = (store.users || [])
      .filter((u) => u.userType === "solver")
      .map((u) => u.username);
    return NextResponse.json({ solvers });
  }

  if (!username || !password || !userType) {
    return NextResponse.json(
      { success: false, message: "Missing fields" },
      { status: 400 }
    );
  }

  const store = await readJSON<{ users: any[] }>(USERS_PATH);
  const users = store.users || [];

  if (action === "register") {
    if (users.find((u) => u.username === username && u.userType === userType)) {
      return NextResponse.json(
        { success: false, message: "User exists" },
        { status: 400 }
      );
    }
    const user = {
      id: Date.now(),
      username,
      password: hash(password),
      userType,
    };
    users.push(user);
    await writeJSON(USERS_PATH, { users });
    return NextResponse.json({
      success: true,
      user: { id: user.id, username, userType },
    });
  }

  if (action === "login") {
    const user = users.find(
      (u) => u.username === username && u.userType === userType
    );
    if (!user)
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    if (user.password !== hash(password))
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
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
}
