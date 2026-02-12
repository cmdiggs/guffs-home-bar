import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getHomies, createHomie } from "@/lib/db";
import { saveHomieImage, validateImageFile } from "@/lib/storage";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const homies = await getHomies();
    return NextResponse.json(homies);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load homies" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const formData = await request.formData();
    const name = (formData.get("name") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    const file = formData.get("file");
    if (!name || !description) {
      return NextResponse.json({ error: "Name and description are required." }, { status: 400 });
    }
    let imagePath: string | null = null;
    if (file && file instanceof File && file.size > 0) {
      const validation = validateImageFile({ type: file.type, size: file.size });
      if (!validation.ok) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      imagePath = saveHomieImage(buffer, file.name);
    }
    const homie = await createHomie(name, "", description, imagePath);
    return NextResponse.json(homie);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create homie" }, { status: 500 });
  }
}
