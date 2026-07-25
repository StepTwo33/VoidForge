export const SITE_UPDATE_TITLE_MAX = 120;
export const SITE_UPDATE_BODY_MAX = 2000;

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
