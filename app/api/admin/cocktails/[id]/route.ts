import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getCocktailById, updateCocktail, deleteCocktail } from "@/lib/db";
import { saveCocktailImage, validateImageFile } from "@/lib/storage";

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number((await params).id);
  if (!Number.isInteger(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const existing = await getCocktailById(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    const formData = await _request.formData();
    const name = (formData.get("name") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    const friendName = (formData.get("friendName") as string)?.trim() || null;
    const ingredients = (formData.get("ingredients") as string)?.trim() || null;
    const file = formData.get("file");
    let imagePath = existing.imagePath;
    if (file && file instanceof File && file.size > 0) {
      const validation = validateImageFile({ type: file.type, size: file.size });
      if (!validation.ok) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      imagePath = await saveCocktailImage(buffer, file.name);
    }
    await updateCocktail(id, {
      name: name ?? existing.name,
      description: description ?? existing.description,
      imagePath,
      friendName: friendName ?? existing.friendName,
      ingredients: ingredients ?? existing.ingredients,
    });
    return NextResponse.json(await getCocktailById(id));
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
  if (!(await getCocktailById(id))) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await deleteCocktail(id);
  return NextResponse.json({ ok: true });
}
