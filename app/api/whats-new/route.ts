import { NextResponse } from "next/server";
import { getWhatsNewItems } from "@/lib/db";

export async function GET() {
  try {
    const items = await getWhatsNewItems();
    return NextResponse.json(items);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load What's New" }, { status: 500 });
  }
}
