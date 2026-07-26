export const SITE_UPDATE_TITLE_MAX = 120;
/** Soft ceiling for abuse prevention. No HTML maxLength — paste must not be silently cut. */
export const SITE_UPDATE_BODY_MAX = 100_000;

export type SiteUpdatePayload = {
  title: string;
  body: string;
  published: boolean;
  featured: boolean;
};

export function parseSiteUpdatePayload(
  raw: unknown,
): { ok: true; data: SiteUpdatePayload } | { ok: false; error: string } {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "Invalid payload" };
  }
  const b = raw as Record<string, unknown>;
  const title = typeof b.title === "string" ? b.title.trim() : "";
  const text = typeof b.body === "string" ? b.body.trim() : "";
  const published = b.published !== false;
  const featured = b.featured === true;
  if (!title || !text) {
    return { ok: false, error: "Title and body are required" };
  }
  if (title.length > SITE_UPDATE_TITLE_MAX) {
    return {
      ok: false,
      error: `Title must be ${SITE_UPDATE_TITLE_MAX} characters or fewer`,
    };
  }
  if (text.length > SITE_UPDATE_BODY_MAX) {
    return {
      ok: false,
      error: `Body must be ${SITE_UPDATE_BODY_MAX.toLocaleString()} characters or fewer`,
    };
  }
  return { ok: true, data: { title, body: text, published, featured } };
}

export interface SiteUpdateSummary {
  id: string;
  title: string;
  body: string;
  published: boolean;
  featured: boolean;
  createdAt: number;
  updatedAt: number;
  author: {
    username: string;
    profileSlug?: string | null;
  };
}

export function formatSiteUpdateTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 14) return `${days}d ago`;
  return new Date(ts).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: days > 365 ? "numeric" : undefined,
  });
}
