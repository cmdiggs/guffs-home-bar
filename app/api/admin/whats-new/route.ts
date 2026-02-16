import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getWhatsNewItems, createWhatsNew } from "@/lib/db";
import { saveWhatsNewImage, validateWhatsNewImageFile } from "@/lib/storage";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const items = await getWhatsNewItems();
    return NextResponse.json(items);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load What's New" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const formData = await request.formData();
    const description = (formData.get("description") as string)?.trim();
    const file = formData.get("file");
    if (!description) {
      return NextResponse.json({ error: "Description is required." }, { status: 400 });
    }
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Image is required." }, { status: 400 });
    }
    const validation = validateWhatsNewImageFile({
      type: file.type,
      size: file.size,
      name: file.name,
    });
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const imagePath = await saveWhatsNewImage(buffer, file.name);
    const item = await createWhatsNew(description, imagePath);
    return NextResponse.json(item);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create What's New item" }, { status: 500 });
  }
}
