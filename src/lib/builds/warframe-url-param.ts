/**
 * `?warframe=<id>` on /warframe-builder: written when a warframe is picked from the catalog so Back,
 * refresh and copying the address keep the warframe. It only names the warframe (no mods); saved and
 * shared build links keep their own params and always win over it.
 */
export const WARFRAME_URL_PARAM = "warframe";

/** Params that load a full build or a loadout slot; when any is present `?warframe=` is not used. */
const BUILD_LINK_PARAMS = ["build", "buildId", "localBuild", "loadout"] as const;

export function hasBuildLinkParam(params: URLSearchParams): boolean {
  return BUILD_LINK_PARAMS.some((k) => params.has(k));
}

/** The warframe id from `?warframe=`, or null when absent/blank or a build link is present. */
export function warframeIdFromParams(params: URLSearchParams): string | null {
  if (hasBuildLinkParam(params)) return null;
  const id = params.get(WARFRAME_URL_PARAM)?.trim();
  return id ? id : null;
}

/** `pathname?query#hash` with `?warframe=` set to `warframeId` (or removed when null). Other params are kept. */
export function hrefWithWarframeParam(href: string, warframeId: string | null): string {
  const url = new URL(href, "http://localhost");
  if (warframeId) url.searchParams.set(WARFRAME_URL_PARAM, warframeId);
  else url.searchParams.delete(WARFRAME_URL_PARAM);
  const qs = url.searchParams.toString();
  return `${url.pathname}${qs ? `?${qs}` : ""}${url.hash}`;
}

/** Href for a fresh catalog pick: drops build-link params (the old build no longer applies) and sets `?warframe=`. */
export function hrefForWarframeCatalogPick(href: string, warframeId: string): string {
  const url = new URL(href, "http://localhost");
  for (const k of ["build", "buildId", "localBuild"]) url.searchParams.delete(k);
  return hrefWithWarframeParam(`${url.pathname}?${url.searchParams.toString()}${url.hash}`, warframeId);
}
