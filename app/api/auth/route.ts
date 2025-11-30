import { NextResponse } from "next/server";
import { readJSON, writeJSON } from "../../../lib/storage";
import crypto from "crypto";

const USERS_PATH = "data/users.json";

function hash(pw: string) {
  return crypto.createHash("sha256").update(pw).digest("hex");
}

export async function POST(req: Request) {
  const body = await req.json();
  const { action, username, password, userType, creatorUsername } = body;

  // List all solvers for a specific creator
  if (action === "list_solvers") {
    const creator = body.creator;
    if (!creator) {
      return NextResponse.json(
        { success: false, message: "Creator username required" },
        { status: 400 }
      );
    }
    const store = await readJSON<{ users: any[] }>(USERS_PATH);
    const solvers = (store.users || [])
      .filter((u) => u.userType === "solver" && u.createdBy === creator)
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
    // Solvers can only be registered by creators
    if (userType === "solver") {
      if (!creatorUsername) {
        return NextResponse.json(
          {
            success: false,
            message: "Creator username required for solver registration",
          },
          { status: 400 }
        );
      }
      // Verify that the creator exists
      const creatorExists = users.find(
        (u) => u.username === creatorUsername && u.userType === "creator"
      );
      if (!creatorExists) {
        return NextResponse.json(
          { success: false, message: "Creator not found" },
          { status: 404 }
        );
      }
    }

    if (users.find((u) => u.username === username && u.userType === userType)) {
      return NextResponse.json(
        { success: false, message: "User exists" },
        { status: 400 }
      );
    }
    const user: any = {
      id: Date.now(),
      username,
      password: hash(password),
      userType,
    };
    if (userType === "solver") {
      user.createdBy = creatorUsername;
    }
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
