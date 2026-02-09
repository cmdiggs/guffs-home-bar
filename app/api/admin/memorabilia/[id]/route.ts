import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getMemorabiliaById, updateMemorabilia, deleteMemorabilia } from "@/lib/db";
import { saveMemorabiliaImage, validateImageFile } from "@/lib/storage";

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number((await params).id);
  if (!Number.isInteger(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const existing = getMemorabiliaById(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    const formData = await _request.formData();
    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    const file = formData.get("file");
    let imagePath = existing.imagePath;
    if (file && file instanceof File && file.size > 0) {
      const validation = validateImageFile({ type: file.type, size: file.size });
      if (!validation.ok) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      imagePath = saveMemorabiliaImage(buffer, file.name);
    }
    updateMemorabilia(id, {
      title: title ?? existing.title,
      description: description ?? existing.description,
      imagePath,
    });
    return NextResponse.json(getMemorabiliaById(id));
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
  if (!getMemorabiliaById(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  deleteMemorabilia(id);
  return NextResponse.json({ ok: true });
}
