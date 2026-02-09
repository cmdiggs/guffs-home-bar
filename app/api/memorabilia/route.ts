import { NextResponse } from "next/server";
import { getMemorabilia } from "@/lib/db";

export async function GET() {
  try {
    const items = getMemorabilia();
    return NextResponse.json(items);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load memorabilia" }, { status: 500 });
  }
}
