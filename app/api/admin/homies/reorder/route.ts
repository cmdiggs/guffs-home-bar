import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { updateHomiesOrder } from "@/lib/db";

export async function PATCH(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const ids = body?.ids;
    if (!Array.isArray(ids) || ids.some((id: unknown) => typeof id !== "number")) {
      return NextResponse.json({ error: "Body must include ids: number[]" }, { status: 400 });
    }
    await updateHomiesOrder(ids);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to reorder" }, { status: 500 });
  }
}
