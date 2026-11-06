import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/auth/rate-limit";
import {
  isValidScreenshotMagicBytes,
  saveReportScreenshotFile,
} from "@/lib/reports/report-screenshot-files";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const rl = checkRateLimit(`report-upload:${ip}`, 30, 60 * 60 * 1000);
    if (rl.limited) {
      return NextResponse.json(
        { error: "Too many uploads. Please try again later." },
        { status: 429 },
      );
    }

    const formData = await req.formData();
    const file = (formData.get("screenshot") || formData.get("file")) as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, and GIF images are allowed" },
        { status: 400 },
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Image must be under 5MB" }, { status: 400 });
    }

    // Validate magic bytes
    const header = Buffer.from(await file.slice(0, 12).arrayBuffer());
    if (!isValidScreenshotMagicBytes(header)) {
      return NextResponse.json(
        { error: "File does not appear to be a valid image" },
        { status: 400 },
      );
    }

    const rawExt = file.name.split(".").pop()?.toLowerCase() || "";
    const ext = rawExt && ["jpg", "jpeg", "png", "webp", "gif"].includes(rawExt)
      ? rawExt
      : file.type.split("/")[1] === "jpeg"
      ? "jpg"
      : file.type.split("/")[1];

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = await saveReportScreenshotFile(ext, buffer);
    const url = `/api/uploads/reports/${filename}`;

    return NextResponse.json({ url, filename }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to upload screenshot" }, { status: 500 });
  }
}
