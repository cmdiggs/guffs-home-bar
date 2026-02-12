import { NextRequest, NextResponse } from "next/server";
import convert from "heic-convert";
import { isAdmin } from "@/lib/auth";
import { getMemorabilia, createMemorabilia } from "@/lib/db";
import { saveMemorabiliaImage, validateMemorabiliaImageFile } from "@/lib/storage";

function isHeicFile(file: { type: string; name: string }): boolean {
  const t = file.type?.toLowerCase() ?? "";
  const n = file.name?.toLowerCase() ?? "";
  return t === "image/heic" || t === "image/heif" || n.endsWith(".heic") || n.endsWith(".heif");
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const items = await getMemorabilia();
    return NextResponse.json(items);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load memorabilia" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const formData = await request.formData();
    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    const file = formData.get("file");
    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required." }, { status: 400 });
    }
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Image is required." }, { status: 400 });
    }
    const validation = validateMemorabiliaImageFile({
      type: file.type,
      size: file.size,
      name: file.name,
    });
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }
    let buffer = Buffer.from(await file.arrayBuffer());
    let saveName = file.name;
    if (isHeicFile({ type: file.type, name: file.name })) {
      try {
        const jpegBuffer = await convert({
          buffer: buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength),
          format: "JPEG",
          quality: 0.9
        });
        buffer = Buffer.from(jpegBuffer);
        saveName = file.name.replace(/\.(heic|heif)$/i, ".jpg") || "image.jpg";
      } catch (convertErr) {
        console.error("HEIC conversion failed:", convertErr);
        return NextResponse.json(
          { error: "Could not process HEIC image. Try saving as JPEG first." },
          { status: 400 }
        );
      }
    }
    const imagePath = saveMemorabiliaImage(buffer, saveName);
    const item = await createMemorabilia(title, description, imagePath);
    return NextResponse.json(item);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create memorabilia" }, { status: 500 });
  }
}
