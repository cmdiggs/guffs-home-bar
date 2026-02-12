import { NextResponse } from "next/server";
import convert from "heic-convert";
import { createSubmission } from "@/lib/db";
import { saveSubmissionFile, validateSubmissionImageFile } from "@/lib/storage";

function isHeicFile(file: { type: string; name: string }): boolean {
  const t = file.type.toLowerCase();
  const n = file.name.toLowerCase();
  return (
    t === "image/heic" ||
    t === "image/heif" ||
    n.endsWith(".heic") ||
    n.endsWith(".heif")
  );
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const guestName = (formData.get("guestName") as string)?.trim() || null;
    const comment = (formData.get("comment") as string)?.trim() || null;

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const validation = validateSubmissionImageFile({
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
          buffer,
          format: "JPEG",
          quality: 0.9,
        });
        buffer = Buffer.isBuffer(jpegBuffer) ? jpegBuffer : Buffer.from(jpegBuffer as ArrayBuffer | Uint8Array);
        saveName = file.name.replace(/\.(heic|heif)$/i, ".jpg") || "photo.jpg";
      } catch (convertErr) {
        console.error("HEIC conversion failed:", convertErr);
        return NextResponse.json(
          { error: "Could not process HEIC photo. Try saving as JPEG from your Photos app first." },
          { status: 400 }
        );
      }
    }

    const imagePath = saveSubmissionFile(buffer, saveName);
    createSubmission(imagePath, null, guestName, comment);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
