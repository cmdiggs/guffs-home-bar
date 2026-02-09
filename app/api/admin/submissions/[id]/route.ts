import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getSubmissions, updateSubmissionStatus } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number((await params).id);
  if (!Number.isInteger(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const submissions = getSubmissions();
  const submission = submissions.find((s) => s.id === id);
  if (!submission) return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    const body = await request.json();
    const status = body?.status;
    if (status !== "approved" && status !== "denied" && status !== "pending") {
      return NextResponse.json({ error: "status must be approved, denied, or pending" }, { status: 400 });
    }
    updateSubmissionStatus(id, status);
    return NextResponse.json({ ok: true, status });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
