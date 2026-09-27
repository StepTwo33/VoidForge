export const SITE_NAME = "Voidforge";
export const SITE_TAGLINE = "Warframe Build Planner";
export const SITE_DESCRIPTION =
  "Plan and optimize Warframe builds with real-time stat calculations for weapons, warframes, companions, arcanes, and full loadouts.";

/** Canonical public origin for metadata and absolute URLs. */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.AUTH_URL?.trim() ||
    "https://void-forge.org";
  return raw.replace(/\/+$/, "");
}
