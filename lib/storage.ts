import path from "path";
import fs from "fs";
import sharp from "sharp";

const UPLOADS_DIR = process.env.UPLOADS_PATH ?? path.join(process.cwd(), "public", "uploads");
const SUBMISSIONS_DIR = path.join(UPLOADS_DIR, "submissions");
const COCKTAILS_DIR = path.join(UPLOADS_DIR, "cocktails");
const MEMORABILIA_DIR = path.join(UPLOADS_DIR, "memorabilia");
const HOMIES_DIR = path.join(UPLOADS_DIR, "homies");

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/heic", "image/heif"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

// Compression settings
const COMPRESSION_QUALITY = 85; // High quality JPEG compression
const MAX_WIDTH = 2000; // Max width to prevent huge images

function ensureDirs() {
  for (const dir of [UPLOADS_DIR, SUBMISSIONS_DIR, COCKTAILS_DIR, MEMORABILIA_DIR, HOMIES_DIR]) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }
}

function safeFilename(original: string): string {
  const base = Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 9);
  return base + ".jpg"; // Always save as JPEG after compression
}

function isHeicFile(file: { type: string; name?: string }): boolean {
  const name = (file.name ?? "").toLowerCase();
  return (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    name.endsWith(".heic") ||
    name.endsWith(".heif") ||
    (file.type === "" && (name.endsWith(".heic") || name.endsWith(".heif")))
  );
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

export function validateImageFile(file: {
  type: string;
  size: number;
  name?: string;
}): { ok: true } | { ok: false; error: string } {
  const isHeic = isHeicFile(file);
  const allowed = isHeic || ALLOWED_TYPES.includes(file.type);
  if (!allowed) {
    return { ok: false, error: "Invalid file type. Use JPEG, PNG, WebP, GIF, or HEIC (iPhone photos)." };
  }
  if (file.size > MAX_SIZE_BYTES) {
    return { ok: false, error: "File too large. Maximum size is 10MB." };
  }
  return { ok: true };
}

/** For share-your-visit uploads: allows HEIC/HEIF from iPhones (converted to JPEG on server). */
export function validateSubmissionImageFile(file: {
  type: string;
  size: number;
  name?: string;
}): { ok: true } | { ok: false; error: string } {
  return validateImageFile(file);
}

/** For collection/memorabilia uploads: allows HEIC/HEIF (converted to JPEG on server). */
export function validateMemorabiliaImageFile(file: {
  type: string;
  size: number;
  name?: string;
}): { ok: true } | { ok: false; error: string } {
  return validateImageFile(file);
}

/** For cocktail uploads: allows HEIC/HEIF (converted to JPEG on server). */
export function validateCocktailImageFile(file: {
  type: string;
  size: number;
  name?: string;
}): { ok: true } | { ok: false; error: string } {
  return validateImageFile(file);
}

/** For homie uploads: allows HEIC/HEIF (converted to JPEG on server). */
export function validateHomieImageFile(file: {
  type: string;
  size: number;
  name?: string;
}): { ok: true } | { ok: false; error: string } {
  return validateImageFile(file);
}

/**
 * Compress and optimize image using sharp
 * Converts HEIC to JPEG, resizes if too large, and compresses
 */
async function compressImage(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .resize(MAX_WIDTH, MAX_WIDTH, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: COMPRESSION_QUALITY, mozjpeg: true })
    .toBuffer();
}

export async function saveSubmissionFile(file: Buffer, originalName: string): Promise<string> {
  ensureDirs();
  const compressedBuffer = await compressImage(file);
  const filename = safeFilename(originalName);
  const filePath = path.join(SUBMISSIONS_DIR, filename);
  fs.writeFileSync(filePath, compressedBuffer);
  return `/uploads/submissions/${filename}`;
}

export async function saveCocktailImage(file: Buffer, originalName: string): Promise<string> {
  ensureDirs();
  const compressedBuffer = await compressImage(file);
  const filename = safeFilename(originalName);
  const filePath = path.join(COCKTAILS_DIR, filename);
  fs.writeFileSync(filePath, compressedBuffer);
  return `/uploads/cocktails/${filename}`;
}

export async function saveMemorabiliaImage(file: Buffer, originalName: string): Promise<string> {
  ensureDirs();
  const compressedBuffer = await compressImage(file);
  const filename = safeFilename(originalName);
  const filePath = path.join(MEMORABILIA_DIR, filename);
  fs.writeFileSync(filePath, compressedBuffer);
  return `/uploads/memorabilia/${filename}`;
}

export async function saveHomieImage(file: Buffer, originalName: string): Promise<string> {
  ensureDirs();
  const compressedBuffer = await compressImage(file);
  const filename = safeFilename(originalName);
  const filePath = path.join(HOMIES_DIR, filename);
  fs.writeFileSync(filePath, compressedBuffer);
  return `/uploads/homies/${filename}`;
}
