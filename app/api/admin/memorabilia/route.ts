import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getMemorabilia, createMemorabilia } from "@/lib/db";
import { saveMemorabiliaImage, validateImageFile } from "@/lib/storage";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const items = getMemorabilia();
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
    const validation = validateImageFile({ type: file.type, size: file.size });
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const imagePath = saveMemorabiliaImage(buffer, file.name);
    const item = createMemorabilia(title, description, imagePath);
    return NextResponse.json(item);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create memorabilia" }, { status: 500 });
  }
}
