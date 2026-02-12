import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getHomieById, updateHomie, deleteHomie } from "@/lib/db";
import { saveHomieImage, validateImageFile } from "@/lib/storage";

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number((await params).id);
  if (!Number.isInteger(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const existing = await getHomieById(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    const formData = await _request.formData();
    const name = (formData.get("name") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    const file = formData.get("file");
    let imagePath: string | null = existing.imagePath;
    if (file && file instanceof File && file.size > 0) {
      const validation = validateImageFile({ type: file.type, size: file.size });
      if (!validation.ok) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      imagePath = saveHomieImage(buffer, file.name);
    }
    await updateHomie(id, {
      name: name ?? existing.name,
      title: "",
      description: description ?? existing.description,
      imagePath,
    });
    return NextResponse.json(await getHomieById(id));
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
  if (!(await getHomieById(id))) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await deleteHomie(id);
  return NextResponse.json({ ok: true });
}
