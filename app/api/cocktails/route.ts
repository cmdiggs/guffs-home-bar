import { NextResponse } from "next/server";
import { getCocktails } from "@/lib/db";

export async function GET() {
  try {
    const cocktails = await getCocktails();
    return NextResponse.json(cocktails);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load cocktails" }, { status: 500 });
  }
}
