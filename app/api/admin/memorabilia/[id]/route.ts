import { NextRequest, NextResponse } from "next/server";
import convert from "heic-convert";
import { isAdmin } from "@/lib/auth";
import { getMemorabiliaById, updateMemorabilia, deleteMemorabilia } from "@/lib/db";
import { saveMemorabiliaImage, validateMemorabiliaImageFile } from "@/lib/storage";

function isHeicFile(file: { type: string; name: string }): boolean {
  const t = file.type?.toLowerCase() ?? "";
  const n = file.name?.toLowerCase() ?? "";
  return t === "image/heic" || t === "image/heif" || n.endsWith(".heic") || n.endsWith(".heif");
}

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number((await params).id);
  if (!Number.isInteger(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const existing = await getMemorabiliaById(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    const formData = await _request.formData();
    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    const file = formData.get("file");
    let imagePath = existing.imagePath;
    if (file && file instanceof File && file.size > 0) {
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
      imagePath = saveMemorabiliaImage(buffer, saveName);
    }
    await updateMemorabilia(id, {
      title: title ?? existing.title,
      description: description ?? existing.description,
      imagePath,
    });
    return NextResponse.json(await getMemorabiliaById(id));
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number((await params).id);
  if (!Number.isInteger(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  if (!(await getMemorabiliaById(id))) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await deleteMemorabilia(id);
  return NextResponse.json({ ok: true });
}
