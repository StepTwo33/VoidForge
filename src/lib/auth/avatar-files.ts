import { unlink } from "fs/promises";
import path from "path";

/** Every extension an uploaded avatar can be saved under (see /api/auth/profile/avatar). */
export const AVATAR_EXTS = ["jpg", "png", "webp", "gif"];

/** Where uploaded avatars live; served by /api/uploads/avatars/[filename]. */
export const avatarUploadDir = () => path.join(process.cwd(), "public", "uploads", "avatars");

/** Remove avatar files for a user, optionally keeping one extension (ignores missing files). */
export async function removeAvatarFiles(userId: string, keepExt?: string) {
  await Promise.all(
    AVATAR_EXTS.filter((ext) => ext !== keepExt).map((ext) =>
      unlink(path.join(avatarUploadDir(), `${userId}.${ext}`)).catch(() => {})
    )
  );
}
