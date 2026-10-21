/**
 * Loadout hash share links: `/loadouts?shared=<code>` carries the whole kit in the URL
 * (deflated JSON), so sharing works without an account and without making anything public.
 */
import type { Loadout } from "@/lib/types";
import { loadoutToBuildData, normalizeLoadoutBuildData, type LoadoutBuildData } from "@/lib/builds/loadouts";
import { base64UrlToBytes, bytesToBase64Url, deflateUtf8, deflateUtf8Sync, encodeJsonPayload, decodeJsonPayload, inflateToUtf8, inflateToUtf8Sync } from "@/lib/builds/build-url";

const SLOT_KEYS = [
  "warframeBuild",
  "primaryBuild",
  "secondaryBuild",
  "meleeBuild",
  "companionBuild",
  "modularBuilds",
  "modularBuild",
  "archwingBuild",
] as const;

export interface SharedLoadout {
  name: string;
  data: LoadoutBuildData;
}

function packLoadout(loadout: Loadout): unknown {
  return { v: 1, n: loadout.name, d: loadoutToBuildData(loadout) };
}

function unpackLoadout(raw: unknown): SharedLoadout | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const r = raw as { v?: unknown; n?: unknown; d?: unknown };
  if (r.v !== 1 || !r.d || typeof r.d !== "object" || Array.isArray(r.d)) return null;
  const src = r.d as Record<string, unknown>;
  const data: Record<string, unknown> = {};
  for (const k of SLOT_KEYS) {
    const v = src[k];
    if (v && typeof v === "object" && !Array.isArray(v)) data[k] = v;
  }
  if (Object.keys(data).length === 0) return null;
  const name = typeof r.n === "string" && r.n.trim() ? r.n.trim().slice(0, 120) : "Shared loadout";
  return { name, data: normalizeLoadoutBuildData(data as LoadoutBuildData) };
}

/** Encode a loadout for `?shared=`. Uses CompressionStream in the browser, zlib in Node. */
export async function encodeLoadoutShare(loadout: Loadout): Promise<string> {
  const packed = packLoadout(loadout);
  const json = JSON.stringify(packed);
  const compressed = (await deflateUtf8(json)) ?? deflateUtf8Sync(json);
  if (compressed && compressed.length < new TextEncoder().encode(json).length) {
    return "z." + bytesToBase64Url(compressed);
  }
  return encodeJsonPayload(packed);
}

export async function decodeLoadoutShare(code: string): Promise<SharedLoadout | null> {
  try {
    if (code.startsWith("z.")) {
      const bytes = base64UrlToBytes(code.slice(2));
      const json = (await inflateToUtf8(bytes)) ?? inflateToUtf8Sync(bytes);
      if (!json) return null;
      return unpackLoadout(JSON.parse(json));
    }
    return unpackLoadout(decodeJsonPayload(code));
  } catch {
    return null;
  }
}

export function loadoutSharePath(code: string): string {
  return `/loadouts?shared=${code}`;
}
