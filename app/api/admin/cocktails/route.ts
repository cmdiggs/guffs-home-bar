import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getCocktails, createCocktail } from "@/lib/db";
import { saveCocktailImage, validateImageFile } from "@/lib/storage";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const cocktails = getCocktails();
    return NextResponse.json(cocktails);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load cocktails" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const formData = await request.formData();
    const name = (formData.get("name") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    const friendName = (formData.get("friendName") as string)?.trim() || null;
    const ingredients = (formData.get("ingredients") as string)?.trim() || null;
    const file = formData.get("file");
    if (!name || !description) {
      return NextResponse.json({ error: "Name and description are required." }, { status: 400 });
    }
    let imagePath: string;
    if (file && file instanceof File) {
      const validation = validateImageFile({ type: file.type, size: file.size });
      if (!validation.ok) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      imagePath = saveCocktailImage(buffer, file.name);
    } else {
      imagePath = "/guffs-logo.svg";
    }
    const cocktail = createCocktail(name, description, imagePath, 0, friendName, ingredients);
    return NextResponse.json(cocktail);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create cocktail" }, { status: 500 });
  }
}
