// Shareable Build URL Encoder/Decoder
// Compact packed format + legacy JSON; keeps old ?build= links working.

export interface ShareableBuild {
  type: "weapon" | "warframe" | "companion" | "modular" | "archwing" | "railjack";
  itemId: string;
  mods: { id: string; rank: number; slotIndex?: number }[];
  arcanes?: string[];
  progenitorElement?: string;
  progenitorBonusPercent?: number;
  // Modular-specific
  modularType?: string;
  parts?: Record<string, string>;
  hasOrokinCatalyst?: boolean;
  isMR30?: boolean;
  slotPolarities?: Record<string, string>;
  // Warframe-specific
  shards?: { id: string; bonus: string }[];
  // Incarnon (weapon builder share codes)
  incarnonEvolutions?: Record<number, number>;
}

/** Local offline ids look like `1730000000000_abc1234`; cloud rows use Prisma cuid. */
export function isLocalBuildId(id: string): boolean {
  return /^\d{10,}_[a-z0-9]+$/i.test(id);
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(hash: string): Uint8Array {
  let b64 = hash.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** URL-safe base64 of UTF-8 JSON (handles emoji / accents that break bare `btoa`). */
export function encodeJsonPayload(data: unknown): string {
  try {
    const json = JSON.stringify(data);
    if (typeof TextEncoder !== "undefined") {
      return bytesToBase64Url(new TextEncoder().encode(json));
    }
    // Legacy fallback: percent-encode then Latin1 for btoa
    return btoa(unescape(encodeURIComponent(json)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  } catch {
    return "";
  }
}

export function decodeJsonPayload(hash: string): unknown | null {
  try {
    const bytes = base64UrlToBytes(hash);
    let json: string;
    if (typeof TextDecoder !== "undefined") {
      json = new TextDecoder().decode(bytes);
    } else {
      let binary = "";
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
      json = decodeURIComponent(escape(binary));
    }
    return JSON.parse(json);
  } catch {
    // Legacy Latin1-only payloads from older shares
    try {
      let b64 = hash.replace(/-/g, "+").replace(/_/g, "/");
      while (b64.length % 4) b64 += "=";
      return JSON.parse(atob(b64));
    } catch {
      return null;
    }
  }
}

const TYPE_TO_CODE: Record<ShareableBuild["type"], string> = {
  weapon: "w",
  warframe: "f",
  companion: "c",
  modular: "m",
  archwing: "a",
  railjack: "r",
};

const CODE_TO_TYPE: Record<string, ShareableBuild["type"]> = {
  w: "weapon",
  f: "warframe",
  c: "companion",
  m: "modular",
  a: "archwing",
  r: "railjack",
};

type PackedMod = [string, number] | [string, number, number];

/**
 * Dense array form:
 * [1, typeCode, itemId, mods, extras?]
 * extras only present when needed: { a, s, pe, pb, mt, p, oc, mr, sp, ie }
 */
export function packShareableBuild(build: ShareableBuild): unknown[] {
  const mods: PackedMod[] = build.mods.map((m) =>
    m.slotIndex == null ? [m.id, m.rank] : [m.id, m.rank, m.slotIndex],
  );

  const extras: Record<string, unknown> = {};
  if (build.arcanes && build.arcanes.length > 0) extras.a = build.arcanes;
  if (build.shards && build.shards.length > 0) {
    extras.s = build.shards.map((sh) => [sh.id, sh.bonus]);
  }
  if (build.progenitorElement) extras.pe = build.progenitorElement;
  if (build.progenitorBonusPercent != null) extras.pb = build.progenitorBonusPercent;
  if (build.modularType) extras.mt = build.modularType;
  if (build.parts && Object.keys(build.parts).length > 0) extras.p = build.parts;
  if (build.hasOrokinCatalyst) extras.oc = 1;
  if (build.isMR30) extras.mr = 1;
  if (build.slotPolarities && Object.keys(build.slotPolarities).length > 0) {
    extras.sp = build.slotPolarities;
  }
  if (build.incarnonEvolutions && Object.keys(build.incarnonEvolutions).length > 0) {
    extras.ie = build.incarnonEvolutions;
  }

  const packed: unknown[] = [1, TYPE_TO_CODE[build.type], build.itemId, mods];
  if (Object.keys(extras).length > 0) packed.push(extras);
  return packed;
}

export function unpackShareableBuild(raw: unknown): ShareableBuild | null {
  if (!Array.isArray(raw) || raw.length < 4) return null;
  const [version, typeCode, itemId, modsRaw, extrasRaw] = raw;
  if (version !== 1 || typeof typeCode !== "string" || typeof itemId !== "string") return null;
  const type = CODE_TO_TYPE[typeCode];
  if (!type || !Array.isArray(modsRaw)) return null;

  const mods: ShareableBuild["mods"] = [];
  for (const entry of modsRaw) {
    if (!Array.isArray(entry) || typeof entry[0] !== "string" || typeof entry[1] !== "number") {
      return null;
    }
    const mod: { id: string; rank: number; slotIndex?: number } = {
      id: entry[0],
      rank: entry[1],
    };
    if (typeof entry[2] === "number") mod.slotIndex = entry[2];
    mods.push(mod);
  }

  const build: ShareableBuild = { type, itemId, mods };
  if (extrasRaw && typeof extrasRaw === "object" && !Array.isArray(extrasRaw)) {
    const e = extrasRaw as Record<string, unknown>;
    if (Array.isArray(e.a) && e.a.every((x) => typeof x === "string")) {
      build.arcanes = e.a as string[];
    }
    if (Array.isArray(e.s)) {
      const shards: { id: string; bonus: string }[] = [];
      for (const row of e.s) {
        if (Array.isArray(row) && typeof row[0] === "string" && typeof row[1] === "string") {
          shards.push({ id: row[0], bonus: row[1] });
        }
      }
      if (shards.length) build.shards = shards;
    }
    if (typeof e.pe === "string") build.progenitorElement = e.pe;
    if (typeof e.pb === "number") build.progenitorBonusPercent = e.pb;
    if (typeof e.mt === "string") build.modularType = e.mt;
    if (e.p && typeof e.p === "object" && !Array.isArray(e.p)) {
      build.parts = e.p as Record<string, string>;
    }
    if (e.oc) build.hasOrokinCatalyst = true;
    if (e.mr) build.isMR30 = true;
    if (e.sp && typeof e.sp === "object" && !Array.isArray(e.sp)) {
      build.slotPolarities = e.sp as Record<string, string>;
    }
    if (e.ie && typeof e.ie === "object" && !Array.isArray(e.ie)) {
      build.incarnonEvolutions = e.ie as Record<number, number>;
    }
  }
  return build;
}

function isLegacyShareObject(value: unknown): value is ShareableBuild {
  return (
    !!value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    typeof (value as ShareableBuild).type === "string" &&
    typeof (value as ShareableBuild).itemId === "string" &&
    Array.isArray((value as ShareableBuild).mods)
  );
}

async function deflateUtf8(text: string): Promise<Uint8Array | null> {
  try {
    if (typeof CompressionStream === "undefined") return null;
    const stream = new CompressionStream("deflate");
    const writer = stream.writable.getWriter();
    await writer.write(new TextEncoder().encode(text));
    await writer.close();
    const reader = stream.readable.getReader();
    const chunks: Uint8Array[] = [];
    let total = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        total += value.length;
      }
    }
    const out = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) {
      out.set(chunk, offset);
      offset += chunk.length;
    }
    return out;
  } catch {
    return null;
  }
}

async function inflateToUtf8(bytes: Uint8Array): Promise<string | null> {
  try {
    if (typeof DecompressionStream === "undefined") return null;
    const stream = new DecompressionStream("deflate");
    const writer = stream.writable.getWriter();
    await writer.write(bytes);
    await writer.close();
    const reader = stream.readable.getReader();
    const chunks: Uint8Array[] = [];
    let total = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        total += value.length;
      }
    }
    const out = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) {
      out.set(chunk, offset);
      offset += chunk.length;
    }
    return new TextDecoder().decode(out);
  } catch {
    return null;
  }
}

function inflateToUtf8Sync(bytes: Uint8Array): string | null {
  try {
    // Node / vitest — keep browser bundle free of zlib by dynamic require.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const zlib = require("zlib") as typeof import("zlib");
    return zlib.inflateSync(Buffer.from(bytes)).toString("utf8");
  } catch {
    return null;
  }
}

function deflateUtf8Sync(text: string): Uint8Array | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const zlib = require("zlib") as typeof import("zlib");
    return new Uint8Array(zlib.deflateSync(Buffer.from(text, "utf8")));
  } catch {
    return null;
  }
}

/** Sync encode: compact packed JSON, zlib-deflated when available (Node), else compact only. */
export function encodeBuild(build: ShareableBuild): string {
  try {
    const packed = packShareableBuild(build);
    const json = JSON.stringify(packed);
    const compressed = deflateUtf8Sync(json);
    if (compressed && compressed.length < json.length) {
      return "z." + bytesToBase64Url(compressed);
    }
    return encodeJsonPayload(packed);
  } catch {
    return "";
  }
}

/** Async encode preferred in the browser — uses CompressionStream when present. */
export async function encodeBuildAsync(build: ShareableBuild): Promise<string> {
  try {
    const packed = packShareableBuild(build);
    const json = JSON.stringify(packed);
    const compressed = (await deflateUtf8(json)) ?? deflateUtf8Sync(json);
    if (compressed && compressed.length < new TextEncoder().encode(json).length) {
      return "z." + bytesToBase64Url(compressed);
    }
    return encodeJsonPayload(packed);
  } catch {
    return "";
  }
}

export function decodeBuild(hash: string): ShareableBuild | null {
  try {
    let payload: unknown | null = null;

    if (hash.startsWith("z.")) {
      const bytes = base64UrlToBytes(hash.slice(2));
      const json = inflateToUtf8Sync(bytes);
      if (!json) return null;
      payload = JSON.parse(json);
    } else {
      payload = decodeJsonPayload(hash);
    }

    if (!payload) return null;
    if (Array.isArray(payload)) return unpackShareableBuild(payload);
    if (isLegacyShareObject(payload)) return payload;
    return null;
  } catch {
    return null;
  }
}

/** Async decode for `z.` links in the browser (DecompressionStream). */
export async function decodeBuildAsync(hash: string): Promise<ShareableBuild | null> {
  try {
    if (!hash.startsWith("z.")) return decodeBuild(hash);

    const bytes = base64UrlToBytes(hash.slice(2));
    const json = (await inflateToUtf8(bytes)) ?? inflateToUtf8Sync(bytes);
    if (!json) return null;
    const payload = JSON.parse(json) as unknown;
    if (Array.isArray(payload)) return unpackShareableBuild(payload);
    if (isLegacyShareObject(payload)) return payload;
    return null;
  } catch {
    return null;
  }
}

export function buildShareUrl(build: ShareableBuild, encoded?: string): string {
  const code = encoded ?? encodeBuild(build);
  const path = build.type === "weapon" ? "/weapon-builder"
    : build.type === "warframe" ? "/warframe-builder"
    : build.type === "companion" ? "/companion-builder"
    : build.type === "modular" ? "/modular-builder"
    : build.type === "railjack" ? "/railjack-builder"
    : "/archwing-builder";
  return `${path}?build=${code}`;
}

export function extractBuildFromUrl(searchParams: URLSearchParams): ShareableBuild | null {
  const param = searchParams.get("build");
  if (!param) return null;
  return decodeBuild(param);
}

export async function extractBuildFromUrlAsync(
  searchParams: URLSearchParams,
): Promise<ShareableBuild | null> {
  const param = searchParams.get("build");
  if (!param) return null;
  return decodeBuildAsync(param);
}

const BUILDER_PATHS: Record<string, string> = {
  weapon: "/weapon-builder",
  warframe: "/warframe-builder",
  companion: "/companion-builder",
  modular: "/modular-builder",
  archwing: "/archwing-builder",
  railjack: "/railjack-builder",
  loadout: "/loadouts",
};

/** Link from `/build/[id]` into the correct builder with full cloud build data. */
export function buildOpenUrl(type: string, buildId: string): string {
  const path = BUILDER_PATHS[type];
  if (!path) return "#";
  return `${path}?buildId=${encodeURIComponent(buildId)}`;
}

/** Open a locally saved build in the matching builder. */
export function localBuildOpenUrl(type: string, buildId: string): string {
  const path = BUILDER_PATHS[type] ?? "/loadouts";
  if (type === "loadout") return "/loadouts";
  return `${path}?localBuild=${encodeURIComponent(buildId)}`;
}

export { BUILDER_PATHS };
