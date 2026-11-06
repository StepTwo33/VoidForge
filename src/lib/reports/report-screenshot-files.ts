import { mkdir, unlink, writeFile } from "fs/promises";
import crypto from "crypto";
import path from "path";

/** Allowed file extensions for report screenshots. */
export const ALLOWED_SCREENSHOT_EXTS = ["jpg", "jpeg", "png", "webp", "gif"];

/** Directory where report screenshots are stored on disk. */
export const reportScreenshotUploadDir = () =>
  path.join(process.cwd(), "public", "uploads", "reports");

/**
 * Validate that buffer starts with valid magic bytes for JPEG, PNG, GIF, or WebP.
 */
export function isValidScreenshotMagicBytes(header: Buffer): boolean {
  if (header.length < 12) return false;

  const isJpeg = header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
  const isPng = header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4e && header[3] === 0x47;
  const isGif = header[0] === 0x47 && header[1] === 0x49 && header[2] === 0x46;
  const isWebp =
    header[0] === 0x52 &&
    header[1] === 0x49 &&
    header[2] === 0x46 &&
    header[3] === 0x46 &&
    header[8] === 0x57 &&
    header[9] === 0x45 &&
    header[10] === 0x42 &&
    header[11] === 0x50;

  return isJpeg || isPng || isGif || isWebp;
}

/**
 * Save an uploaded screenshot into the reports upload directory.
 * Returns the generated filename.
 */
export async function saveReportScreenshotFile(ext: string, data: Buffer): Promise<string> {
  const normalizedExt = ext.toLowerCase() === "jpeg" ? "jpg" : ext.toLowerCase();
  const randomSuffix = crypto.randomBytes(8).toString("hex");
  const filename = `report_${Date.now()}_${randomSuffix}.${normalizedExt}`;

  const dir = reportScreenshotUploadDir();
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), data);

  return filename;
}

/**
 * Safely remove a report screenshot file by filename.
 */
export async function removeReportScreenshotFile(filename: string): Promise<void> {
  if (!/^[a-zA-Z0-9._-]+$/.test(filename) || filename.includes("..")) {
    return;
  }
  const dir = reportScreenshotUploadDir();
  const targetPath = path.join(dir, filename);
  await unlink(targetPath).catch(() => {});
}
