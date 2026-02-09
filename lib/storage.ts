import path from "path";
import fs from "fs";

const UPLOADS_DIR = process.env.UPLOADS_PATH ?? path.join(process.cwd(), "public", "uploads");
const SUBMISSIONS_DIR = path.join(UPLOADS_DIR, "submissions");
const COCKTAILS_DIR = path.join(UPLOADS_DIR, "cocktails");
const MEMORABILIA_DIR = path.join(UPLOADS_DIR, "memorabilia");
const HOMIES_DIR = path.join(UPLOADS_DIR, "homies");

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

function ensureDirs() {
  for (const dir of [UPLOADS_DIR, SUBMISSIONS_DIR, COCKTAILS_DIR, MEMORABILIA_DIR, HOMIES_DIR]) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }
}

function safeFilename(original: string): string {
  const ext = path.extname(original) || ".jpg";
  const base = Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 9);
  return base + ext.toLowerCase();
}

export function getSubmissionsDir(): string {
  ensureDirs();
  return SUBMISSIONS_DIR;
}

export function getCocktailsDir(): string {
  ensureDirs();
  return COCKTAILS_DIR;
}

export function getMemorabiliaDir(): string {
  ensureDirs();
  return MEMORABILIA_DIR;
}

export function validateImageFile(file: { type: string; size: number }): { ok: true } | { ok: false; error: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { ok: false, error: "Invalid file type. Use JPEG, PNG, WebP, or GIF." };
  }
  if (file.size > MAX_SIZE_BYTES) {
    return { ok: false, error: "File too large. Maximum size is 10MB." };
  }
  return { ok: true };
}

export function saveSubmissionFile(file: Buffer, originalName: string): string {
  ensureDirs();
  const filename = safeFilename(originalName);
  const filePath = path.join(SUBMISSIONS_DIR, filename);
  fs.writeFileSync(filePath, file);
  return `/uploads/submissions/${filename}`;
}

export function saveCocktailImage(file: Buffer, originalName: string): string {
  ensureDirs();
  const filename = safeFilename(originalName);
  const filePath = path.join(COCKTAILS_DIR, filename);
  fs.writeFileSync(filePath, file);
  return `/uploads/cocktails/${filename}`;
}

export function saveMemorabiliaImage(file: Buffer, originalName: string): string {
  ensureDirs();
  const filename = safeFilename(originalName);
  const filePath = path.join(MEMORABILIA_DIR, filename);
  fs.writeFileSync(filePath, file);
  return `/uploads/memorabilia/${filename}`;
}

export function saveHomieImage(file: Buffer, originalName: string): string {
  ensureDirs();
  const filename = safeFilename(originalName);
  const filePath = path.join(HOMIES_DIR, filename);
  fs.writeFileSync(filePath, file);
  return `/uploads/homies/${filename}`;
}
