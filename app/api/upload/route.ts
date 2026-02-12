import { NextResponse } from "next/server";
import { createSubmission } from "@/lib/db";
import { saveSubmissionFile, validateSubmissionImageFile } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const guestName = (formData.get("guestName") as string)?.trim() || null;
    const comment = (formData.get("comment") as string)?.trim() || null;

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const validation = validateSubmissionImageFile({
      type: file.type,
      size: file.size,
      name: file.name,
    });
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const imagePath = await saveSubmissionFile(buffer, file.name);
    await createSubmission(imagePath, null, guestName, comment);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
