import { NextResponse } from "next/server";
import { getApprovedSubmissions } from "@/lib/db";

export async function GET() {
  try {
    const submissions = await getApprovedSubmissions();
    return NextResponse.json(submissions);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load photos" }, { status: 500 });
  }
}
