import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getSubmissions } from "@/lib/db";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const submissions = await getSubmissions();
    return NextResponse.json(submissions);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load submissions" }, { status: 500 });
  }
}
