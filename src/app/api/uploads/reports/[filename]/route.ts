import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { reportScreenshotUploadDir } from "@/lib/reports/report-screenshot-files";

const MIME_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;

  // Sanitize: only allow alphanumeric, dots, hyphens, underscores — reject path segments
  if (!/^[a-zA-Z0-9._-]+$/.test(filename) || filename.includes("..")) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const mime = MIME_TYPES[ext];
  if (!mime) {
    return NextResponse.json({ error: "Unsupported format" }, { status: 400 });
  }

  const root = reportScreenshotUploadDir();
  const filePath = path.join(root, filename);
  const resolvedRoot = path.resolve(root) + path.sep;
  const resolvedFile = path.resolve(filePath);
  if (!resolvedFile.startsWith(resolvedRoot)) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  try {
    const buffer = await readFile(filePath);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": mime,
        "Cache-Control": "public, max-age=86400, must-revalidate",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
