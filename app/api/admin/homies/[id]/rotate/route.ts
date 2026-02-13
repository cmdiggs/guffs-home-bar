import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getHomieById, updateHomie } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number((await params).id);
  if (!Number.isInteger(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const existing = await getHomieById(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    const body = await request.json();
    const imageRotation = body?.imageRotation;
    if (typeof imageRotation !== "number" || ![0, 90, 180, 270].includes(imageRotation)) {
      return NextResponse.json({ error: "imageRotation must be 0, 90, 180, or 270" }, { status: 400 });
    }
    await updateHomie(id, { imageRotation });
    return NextResponse.json(await getHomieById(id));
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update rotation" }, { status: 500 });
  }
}
