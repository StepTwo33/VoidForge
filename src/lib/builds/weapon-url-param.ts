/**
 * `?weapon=<id>` on /weapon-builder: written when a weapon is picked from the catalog so Back,
 * refresh and copying the address keep the weapon. It only names the weapon (no mods); saved and
 * shared build links keep their own params and always win over it.
 */
export const WEAPON_URL_PARAM = "weapon";

/** Params that load a full build or a loadout slot; when any is present `?weapon=` is not used. */
const BUILD_LINK_PARAMS = ["build", "buildId", "localBuild", "loadout"] as const;

export function hasBuildLinkParam(params: URLSearchParams): boolean {
  return BUILD_LINK_PARAMS.some((k) => params.has(k));
}

/** The weapon id from `?weapon=`, or null when absent/blank or a build link is present. */
export function weaponIdFromParams(params: URLSearchParams): string | null {
  if (hasBuildLinkParam(params)) return null;
  const id = params.get(WEAPON_URL_PARAM)?.trim();
  return id ? id : null;
}

/** `pathname?query#hash` with `?weapon=` set to `weaponId` (or removed when null). Other params are kept. */
export function hrefWithWeaponParam(href: string, weaponId: string | null): string {
  const url = new URL(href, "http://localhost");
  if (weaponId) url.searchParams.set(WEAPON_URL_PARAM, weaponId);
  else url.searchParams.delete(WEAPON_URL_PARAM);
  const qs = url.searchParams.toString();
  return `${url.pathname}${qs ? `?${qs}` : ""}${url.hash}`;
}

/** Href for a fresh catalog pick: drops build-link params (the old build no longer applies) and sets `?weapon=`. */
export function hrefForCatalogPick(href: string, weaponId: string): string {
  const url = new URL(href, "http://localhost");
  for (const k of ["build", "buildId", "localBuild"]) url.searchParams.delete(k);
  return hrefWithWeaponParam(`${url.pathname}?${url.searchParams.toString()}${url.hash}`, weaponId);
}
