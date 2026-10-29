import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { avatarUploadDir, removeAvatarFiles } from "@/lib/auth/avatar-files";

const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("avatar") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Only JPEG, PNG, WebP, and GIF images are allowed" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Image must be under 2MB" }, { status: 400 });
  }

  // Validate file content by checking magic bytes (not just MIME type)
  const header = Buffer.from(await file.slice(0, 12).arrayBuffer());
  const isValidImage =
    (header[0] === 0xFF && header[1] === 0xD8 && header[2] === 0xFF) || // JPEG
    (header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4E && header[3] === 0x47) || // PNG
    (header[0] === 0x47 && header[1] === 0x49 && header[2] === 0x46) || // GIF
    (header[0] === 0x52 && header[1] === 0x49 && header[2] === 0x46 && header[3] === 0x46 &&
      header[8] === 0x57 && header[9] === 0x45 && header[10] === 0x42 && header[11] === 0x50); // WebP

  if (!isValidImage) {
    return NextResponse.json({ error: "File does not appear to be a valid image" }, { status: 400 });
  }

  const ext = file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];
  const filename = `${session.user.id}.${ext}`;
  const uploadDir = avatarUploadDir();
  const filePath = path.join(uploadDir, filename);

  await mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  // Remove stale files from previous uploads with a different extension.
  await removeAvatarFiles(session.user.id, ext);

  const imageUrl = `/api/uploads/avatars/${filename}?t=${Date.now()}`;

  await prisma.user.update({
    where: { id: session.user.id },
    data: { image: imageUrl },
  });

  return NextResponse.json({ image: imageUrl });
}

// DELETE to remove avatar
export async function DELETE() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  await removeAvatarFiles(session.user.id);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { image: null },
  });

  return NextResponse.json({ image: null });
}
