/**
 * Round 55: a reliable way back from a builder to the Your Builds library (/builds) with the
 * same type filter, search and scroll. /builds keeps `type` + `q` in its URL, tags row links with
 * `from=builds`, and stores where the user was in sessionStorage (per tab) right before opening a row.
 */

export const BUILDS_LIBRARY_PATH = "/builds";
export const FROM_BUILDS_PARAM = "from";
export const FROM_BUILDS_VALUE = "builds";
export const BUILDS_RETURN_KEY = "vf:builds-return";
/** Set by "Back to your builds" so /builds restores the saved scroll once. */
export const BUILDS_RESTORE_SCROLL_KEY = "vf:builds-restore-scroll";

export const LIBRARY_TYPE_FILTERS = [
  "all",
  "weapon",
  "warframe",
  "companion",
  "modular",
  "archwing",
  "railjack",
  "loadout",
] as const;

export type LibraryTypeFilter = (typeof LIBRARY_TYPE_FILTERS)[number];

export interface BuildsLibraryState {
  type: LibraryTypeFilter;
  q: string;
}

export interface BuildsReturnEntry {
  /** `/builds?...` to return to (type filter + search). */
  href: string;
  /** window.scrollY on /builds when the row was opened. */
  scrollY: number;
  /** Builder pathname the row opened (e.g. `/warframe-builder`). */
  builder: string;
}

function isLibraryTypeFilter(v: string | null): v is LibraryTypeFilter {
  return v != null && (LIBRARY_TYPE_FILTERS as readonly string[]).includes(v);
}

/** Read the /builds filter + search from a query string (`?type=warframe&q=ash`). */
export function parseBuildsLibraryQuery(search: string): BuildsLibraryState {
  const params = new URLSearchParams(search);
  const type = params.get("type");
  return {
    type: isLibraryTypeFilter(type) ? type : "all",
    q: params.get("q") ?? "",
  };
}

/** `/builds` URL for a filter + search; default state is plain `/builds`. */
export function buildsLibraryHref(state: BuildsLibraryState): string {
  const params = new URLSearchParams();
  if (state.type !== "all") params.set("type", state.type);
  const q = state.q.trim();
  if (q) params.set("q", q);
  const qs = params.toString();
  return qs ? `${BUILDS_LIBRARY_PATH}?${qs}` : BUILDS_LIBRARY_PATH;
}

/** Tag a builder URL opened from /builds (keeps existing params and hash). */
export function withFromBuilds(href: string): string {
  const hashAt = href.indexOf("#");
  const hash = hashAt >= 0 ? href.slice(hashAt) : "";
  const base = hashAt >= 0 ? href.slice(0, hashAt) : href;
  const qAt = base.indexOf("?");
  const path = qAt >= 0 ? base.slice(0, qAt) : base;
  const params = new URLSearchParams(qAt >= 0 ? base.slice(qAt + 1) : "");
  params.set(FROM_BUILDS_PARAM, FROM_BUILDS_VALUE);
  return `${path}?${params.toString()}${hash}`;
}

export function isFromBuilds(search: string): boolean {
  return new URLSearchParams(search).get(FROM_BUILDS_PARAM) === FROM_BUILDS_VALUE;
}

/** Pathname of an app-relative href (`/weapon-builder?buildId=x` → `/weapon-builder`). */
export function hrefPathname(href: string): string {
  const end = href.search(/[?#]/);
  return end >= 0 ? href.slice(0, end) : href;
}

/** Validate a stored return entry; only same-site /builds URLs are accepted. */
export function parseBuildsReturn(raw: string | null | undefined): BuildsReturnEntry | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as Partial<BuildsReturnEntry>;
    if (typeof v.href !== "string" || typeof v.builder !== "string") return null;
    if (v.href !== BUILDS_LIBRARY_PATH && !v.href.startsWith(`${BUILDS_LIBRARY_PATH}?`)) return null;
    const scrollY = typeof v.scrollY === "number" && Number.isFinite(v.scrollY) && v.scrollY > 0 ? v.scrollY : 0;
    return { href: v.href, scrollY, builder: v.builder };
  } catch {
    return null;
  }
}

export type BuildsReturnLinkState =
  | { kind: "back"; href: string }
  | { kind: "library"; href: string }
  | null;

/**
 * What a builder shows: "Back to your builds" when this builder was opened from /builds
 * (URL tag or this tab's return entry for this builder), else "Your builds" for signed-in
 * users, else nothing.
 */
export function resolveBuildsReturnLink(opts: {
  pathname: string;
  search: string;
  entry: BuildsReturnEntry | null;
  signedIn: boolean;
}): BuildsReturnLinkState {
  const { pathname, search, entry, signedIn } = opts;
  const entryMatches = entry != null && entry.builder === pathname;
  if (entryMatches) return { kind: "back", href: entry.href };
  if (isFromBuilds(search)) return { kind: "back", href: BUILDS_LIBRARY_PATH };
  if (signedIn) return { kind: "library", href: BUILDS_LIBRARY_PATH };
  return null;
}
