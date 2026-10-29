import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

// Keep every avatar filesystem call in this module. Turbopack can only see the fixed
// public/uploads/avatars base when the path is built in the same module; joining
// avatarUploadDir() from another file made it trace the whole project
// ("Dynamic filesystem access" build warning). A turbopackIgnore comment on
// process.cwd() makes that worse, so none is used here.

/** Every extension an uploaded avatar can be saved under (see /api/auth/profile/avatar). */
export const AVATAR_EXTS = ["jpg", "png", "webp", "gif"];

/** Where uploaded avatars live; served by /api/uploads/avatars/[filename]. */
export const avatarUploadDir = () => path.join(process.cwd(), "public", "uploads", "avatars");

/** Write <userId>.<ext> into the avatar directory (creating it if needed); returns the filename. */
export async function saveAvatarFile(userId: string, ext: string, data: Buffer): Promise<string> {
  const filename = `${userId}.${ext}`;
  await mkdir(avatarUploadDir(), { recursive: true });
  await writeFile(path.join(avatarUploadDir(), filename), data);
  return filename;
}

/** Remove avatar files for a user, optionally keeping one extension (ignores missing files). */
export async function removeAvatarFiles(userId: string, keepExt?: string) {
  await Promise.all(
    AVATAR_EXTS.filter((ext) => ext !== keepExt).map((ext) =>
      unlink(path.join(avatarUploadDir(), `${userId}.${ext}`)).catch(() => {})
    )
  );
}
