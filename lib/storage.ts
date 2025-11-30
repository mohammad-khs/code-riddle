import { promises as fs } from "fs";
import path from "path";

const projectRoot = process.cwd();

export async function readJSON<T = any>(relativePath: string): Promise<T> {
  const full = path.join(projectRoot, relativePath);
  const raw = await fs.readFile(full, "utf-8");
  return JSON.parse(raw) as T;
}

export async function writeJSON(relativePath: string, data: any) {
  const full = path.join(projectRoot, relativePath);
  await fs.writeFile(full, JSON.stringify(data, null, 2), "utf-8");
}

export async function saveMusicBase64(base64Data: string, ext = "mp3") {
  // base64Data may be data:<type>;base64,xxxxx
  const matches = base64Data.match(/^data:audio\/(.+);base64,(.+)$/);
  let payload = base64Data;
  let fileExt = ext;
  if (matches) {
    fileExt = matches[1] || ext;
    payload = matches[2];
  }
  const buffer = Buffer.from(payload, "base64");
  const fileName = `prize-${Date.now()}.${fileExt}`;
  const outDir = path.join(projectRoot, "public", "music");
  try {
    await fs.mkdir(outDir, { recursive: true });
  } catch (e) {
    // ignore
  }
  const outPath = path.join(outDir, fileName);
  await fs.writeFile(outPath, buffer);
  // return public-relative path
  return `/music/${fileName}`;
}
