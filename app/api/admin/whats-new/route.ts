import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getWhatsNew, upsertWhatsNew } from "@/lib/db";
import { saveWhatsNewImage, validateWhatsNewImageFile } from "@/lib/storage";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const row = await getWhatsNew();
    return NextResponse.json(row);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load What's New" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const formData = await request.formData();
    const description = (formData.get("description") as string)?.trim();
    const file = formData.get("file");
    const existing = await getWhatsNew();

    if (!existing && (!file || !(file instanceof File) || file.size === 0)) {
      return NextResponse.json({ error: "Image and description are required for first setup." }, { status: 400 });
    }
    if (!description) {
      return NextResponse.json({ error: "Description is required." }, { status: 400 });
    }

    let imagePath: string;
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
    } else if (existing) {
      imagePath = existing.imagePath;
    } else {
      return NextResponse.json({ error: "Image is required for first setup." }, { status: 400 });
    }

    const updated = await upsertWhatsNew(imagePath, description);
    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
