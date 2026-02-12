import path from "path";
import fs from "fs";
import sharp from "sharp";
import { put } from "@vercel/blob";
import decode from "heic-decode";

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

const isProduction = process.env.VERCEL_ENV === "production" || !!process.env.BLOB_READ_WRITE_TOKEN;

function ensureDirs() {
  if (isProduction) return; // No need to create dirs in production
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
 * Detect if buffer is HEIC format
 */
function isHeicBuffer(buffer: Buffer): boolean {
  // HEIC files start with specific bytes
  const header = buffer.toString('hex', 4, 12);
  return header === '6674797068656963' || header === '667479706d696631'; // 'ftypheic' or 'ftypmif1'
}

/**
 * Compress and optimize image using sharp
 * Converts HEIC to JPEG first if needed, then resizes and compresses
 */
async function compressImage(buffer: Buffer): Promise<Buffer> {
  let inputBuffer = buffer;

  // Check if it's HEIC and convert to raw pixel data first
  if (isHeicBuffer(buffer)) {
    try {
      const { width, height, data } = await decode({ buffer });
      // Convert HEIC raw pixels to PNG, then sharp can handle it
      inputBuffer = await sharp(data, {
        raw: {
          width,
          height,
          channels: 4, // RGBA
        },
      })
        .png()
        .toBuffer();
    } catch (error) {
      console.error("HEIC decode failed:", error);
      throw new Error("Failed to process HEIC image");
    }
  }

  // Now compress with sharp
  return sharp(inputBuffer)
    .resize(MAX_WIDTH, MAX_WIDTH, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: COMPRESSION_QUALITY, mozjpeg: true })
    .toBuffer();
}

/**
 * Save file to Vercel Blob in production, or local filesystem in development
 */
async function saveFile(buffer: Buffer, originalName: string, folder: string): Promise<string> {
  const compressedBuffer = await compressImage(buffer);
  const filename = safeFilename(originalName);

  if (isProduction) {
    // Production: Upload to Vercel Blob
    try {
      const blob = await put(`${folder}/${filename}`, compressedBuffer, {
        access: "public",
        contentType: "image/jpeg",
      });
      return blob.url;
    } catch (error) {
      console.error("Vercel Blob upload failed:", error);
      throw new Error(`Failed to upload to Vercel Blob: ${error}`);
    }
  } else {
    // Development: Save to local filesystem
    ensureDirs();
    const localDir = path.join(UPLOADS_DIR, folder);
    const filePath = path.join(localDir, filename);
    fs.writeFileSync(filePath, compressedBuffer);
    return `/uploads/${folder}/${filename}`;
  }
}

export async function saveSubmissionFile(file: Buffer, originalName: string): Promise<string> {
  return saveFile(file, originalName, "submissions");
}

export async function saveCocktailImage(file: Buffer, originalName: string): Promise<string> {
  return saveFile(file, originalName, "cocktails");
}

export async function saveMemorabiliaImage(file: Buffer, originalName: string): Promise<string> {
  return saveFile(file, originalName, "memorabilia");
}

export async function saveHomieImage(file: Buffer, originalName: string): Promise<string> {
  return saveFile(file, originalName, "homies");
}
