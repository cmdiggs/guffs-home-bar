import { NextResponse } from "next/server";
import { getHomies } from "@/lib/db";

export async function GET() {
  try {
    const homies = getHomies();
    return NextResponse.json(homies);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load homies" }, { status: 500 });
  }
}
