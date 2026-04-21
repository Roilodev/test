import { writeFile } from "fs/promises";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const allowedImages = ["jpg", "jpeg", "png", "webp", "avif"];
  const allowedVideos = ["mp4", "mov", "webm", "avi"];
  const allowed = [...allowedImages, ...allowedVideos];
  if (!allowed.includes(ext))
    return NextResponse.json({ error: "Tipo não permitido" }, { status: 400 });

  const isVideo = allowedVideos.includes(ext);

  const filename = `${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(join(process.cwd(), "public", "uploads", filename), buffer);

  return NextResponse.json({ url: `/uploads/${filename}`, type: isVideo ? "video" : "image" });
}
