import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { ensureTursoImageRotationColumns, getWhatsNewById, updateWhatsNew, deleteWhatsNewItem } from "@/lib/db";
import { saveWhatsNewImage, validateWhatsNewImageFile, deleteImage } from "@/lib/storage";

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await ensureTursoImageRotationColumns();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const existing = await getWhatsNewById(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    const formData = await _request.formData();
    const description = (formData.get("description") as string)?.trim();
    const file = formData.get("file");
    let imagePath = existing.imagePath;
    if (file && file instanceof File && file.size > 0) {
      const validation = validateWhatsNewImageFile({
        type: file.type,
        size: file.size,
        name: file.name,
      });
      if (!validation.ok) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      imagePath = await saveWhatsNewImage(buffer, file.name);
      await deleteImage(existing.imagePath);
    }
    await updateWhatsNew(id, {
      description: description ?? existing.description,
      imagePath,
    });
    return NextResponse.json(await getWhatsNewById(id));
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
  const item = await getWhatsNewById(id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await deleteImage(item.imagePath);
  await deleteWhatsNewItem(id);
  return NextResponse.json({ ok: true });
}
