/**
 * Render-time "reset when it opens" helper (replaces setState-in-effect resets).
 *
 * A picker/dialog wants its UI state reset whenever it opens, and also when the
 * inputs that seed that state change while it is open. The previous effect had
 * deps `[open, ...seeds]` and ran its body only when `open` was true. Keep a
 * `prevKey` in state, compute `openResetKey(open, ...seeds)` each render, and
 * reset when `shouldResetOnOpen(prevKey, key, open)` is true.
 */
export function openResetKey(open: boolean, ...seeds: unknown[]): string {
  return JSON.stringify([open, ...seeds]);
}

/** `prevKey === null` means "first render": an already-open component resets on mount, like the effect did. */
export function shouldResetOnOpen(prevKey: string | null, key: string, open: boolean): boolean {
  return open && prevKey !== key;
}
