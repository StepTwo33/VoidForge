/**
 * Client-side "am I signed in?" check used before account-only API calls, so signed-out
 * visitors never hit /api/builds and log 401s. /api/auth/session answers 200 either way.
 * The result is cached briefly; sign-in and sign-out reload the page.
 */
const TTL_MS = 10_000;
let cached: { at: number; value: Promise<boolean> } | null = null;

export function hasClientSession(): Promise<boolean> {
  if (typeof window === "undefined" || typeof fetch !== "function") return Promise.resolve(false);
  const now = Date.now();
  if (cached && now - cached.at < TTL_MS) return cached.value;
  const value = fetch("/api/auth/session")
    .then((res) => (res.ok ? res.json() : null))
    .then((data: { user?: unknown } | null) => !!data?.user)
    .catch(() => false);
  cached = { at: now, value };
  return value;
}

/** Test hook / sign-out hook. */
export function resetClientSessionCache(): void {
  cached = null;
}
