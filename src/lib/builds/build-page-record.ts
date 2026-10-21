import { cache } from "react";
import { prisma } from "@/lib/prisma";

/**
 * One primary-key lookup per request for /build/<id>. Wrapped in React `cache` so
 * `generateMetadata` and the page share the same query (no second DB round trip).
 * Access control (private builds) is applied by the callers, not here.
 */
export const getBuildPageRecord = cache(async (id: string) => {
  if (!id || id.length > 64) return null;
  return prisma.build.findUnique({
    where: { id },
    include: { user: { select: { username: true, name: true, image: true, supporterAt: true } } },
  });
});
