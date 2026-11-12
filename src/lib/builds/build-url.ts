// Shareable Build URL Encoder/Decoder
// Compact packed format + legacy JSON; keeps old ?build= links working.

export interface ShareableRivenRoll {
  stats: Record<string, number>;
  polarity?: string;
  drain?: number;
  name?: string;
  libraryId?: string;
}

export interface ShareableCompanionParts {
  kind: string;
  model: string;
  core: string;
  bracket: string;
  gyro?: string;
  stabilizer?: string;
  isGilded?: boolean;
}

export interface ShareableAmpModular {
  modularType?: string;
  parts?: Record<string, string>;
  mods?: ShareableBuild["mods"];
  arcanes?: string[];
  arcaneRanks?: number[];
  hasOrokinCatalyst?: boolean;
  slotPolarities?: Record<string, string>;
  rivenBySlot?: Record<string, ShareableRivenRoll>;
}

export interface ShareableCrewWeapon {
  weaponId: string;
  mods: ShareableBuild["mods"];
  slotPolarities?: Record<string, string>;
  hasOrokinCatalyst?: boolean;
  progenitorElement?: string;
  progenitorBonusPercent?: number;
  rivenBySlot?: Record<string, ShareableRivenRoll>;
}

export interface ShareableCrewSlot {
  role: string;
  source: string;
  profileId: string;
  competency?: Record<string, number>;
  eliteTraitId?: string;
  weaponLoadout?: ShareableCrewWeapon;
}

export interface ShareableRailjackSimulation {
  crimsonFugueStacks?: number;
  cruisingSpeedActive?: boolean;
  protectiveShotsActive?: boolean;
  shieldsDepleted?: boolean;
  activeBattleAbilityId?: string | null;
  activeTacticalAbilityId?: string | null;
}

export interface ShareableRailjack {
  reactorId?: string;
  shieldId?: string;
  engineId?: string;
  platingId?: string;
  reactorTraitId?: string;
  shieldTraitId?: string;
  engineTraitId?: string;
  turretIds?: (string | null)[];
  turretId?: string;
  ordnanceId?: string;
  battleMods?: ShareableBuild["mods"];
  tacticalMods?: ShareableBuild["mods"];
  integratedPolarities?: Record<string, string>;
  battlePolarities?: Record<string, string>;
  tacticalPolarities?: Record<string, string>;
  crewSlots?: (ShareableCrewSlot | null)[];
  eliteCrewId?: string;
  intrinsics?: Record<string, number>;
  simulation?: ShareableRailjackSimulation;
}

export interface ShareableBuild {
  type: "weapon" | "warframe" | "companion" | "modular" | "archwing" | "railjack" | "operator";
  itemId: string;
  mods: { id: string; rank: number; slotIndex?: number }[];
  arcanes?: string[];
  arcaneRanks?: number[];
  progenitorElement?: string;
  progenitorBonusPercent?: number;
  // Modular-specific
  modularType?: string;
  parts?: Record<string, string>;
  hasOrokinCatalyst?: boolean;
  isMR30?: boolean;
  /** Kuva/Tenet/Coda Formas past rank 30 (0–5). Each adds 2 rank, up to 40. */
  adversaryFormas?: number;
  slotPolarities?: Record<string, string>;
  // Warframe-specific
  shards?: { id: string; bonus: string }[];
  // Incarnon (weapon builder share codes)
  incarnonEvolutions?: Record<number, number>;
  /** Round 47: conditional Incarnon perks switched on. */
  incarnonConditionals?: Record<string, boolean>;
  /** Round 47: explicit Genesis-installed choice (Cannonade). */
  incarnonGenesisInstalled?: boolean;
  /**
   * Other forms of a dual-form Warframe (Sevagoth's Shadow, Orion). The default
   * form stays in `mods` / `arcanes` / `slotPolarities`. Absent on older share links.
   */
  dualFormBuilds?: Record<string, ShareableFormSlice>;
  /** Warframe Orokin Reactor. Absent on older share links. */
  hasOrokinReactor?: boolean;
  helminthSlot?: number | null;
  helminthAbilityId?: string | null;
  /** Exalted weapon (Dex Pixia, Exalted Blade, …). Absent on older share links. */
  exalted?: ShareableExaltedSlice;
  /** Second exalted (Titania's Diwata). Absent on older share links. */
  exaltedMelee?: ShareableExaltedSlice;
  arcaneStacksById?: Record<string, number>;
  conditionalModStacksById?: Record<string, number>;
  /** Riven rolls on the primary `mods` list, keyed by slotIndex. */
  rivenBySlot?: Record<string, ShareableRivenRoll>;
  /** Companion / Archwing attached weapon. */
  weaponId?: string;
  weaponMods?: ShareableBuild["mods"];
  weaponSlotPolarities?: Record<string, string>;
  weaponRivenBySlot?: Record<string, ShareableRivenRoll>;
  companionParts?: ShareableCompanionParts;
  customName?: string;
  /** Archwing vs Necramech. */
  archwingMode?: string;
  railjackGunnery?: number;
  /** Railjack ship, Plexus tabs, crew, and simulation (same fields as a saved build). */
  railjack?: ShareableRailjack;
  /** Operator focus school, Amp, and arcanes. */
  focusSchool?: string;
  ampId?: string;
  ampName?: string;
  ampModular?: ShareableAmpModular;
  operatorArcanes?: string[];
  operatorArcaneRanks?: number[];
  ampArcaneIds?: string[];
  ampArcaneRanks?: number[];
}

export interface ShareableFormSlice {
  mods: ShareableBuild["mods"];
  arcanes?: string[];
  arcaneRanks?: number[];
  slotPolarities?: Record<string, string>;
}

export interface ShareableExaltedSlice extends ShareableFormSlice {
  stanceModId?: string;
}

/** Local offline ids look like `1730000000000_abc1234`; cloud rows use Prisma cuid. */
export function isLocalBuildId(id: string): boolean {
  return /^\d{10,}_[a-z0-9]+$/i.test(id);
}

export function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function base64UrlToBytes(hash: string): Uint8Array {
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
  operator: "o",
};

const CODE_TO_TYPE: Record<string, ShareableBuild["type"]> = {
  w: "weapon",
  f: "warframe",
  c: "companion",
  m: "modular",
  a: "archwing",
  r: "railjack",
  o: "operator",
};

type PackedMod = [string, number] | [string, number, number];

function packMods(mods: ShareableBuild["mods"]): PackedMod[] {
  return mods.map((m) => (m.slotIndex == null ? [m.id, m.rank] : [m.id, m.rank, m.slotIndex]));
}

function unpackMods(modsRaw: unknown): ShareableBuild["mods"] | null {
  if (!Array.isArray(modsRaw)) return null;
  const mods: ShareableBuild["mods"] = [];
  for (const entry of modsRaw) {
    if (!Array.isArray(entry) || typeof entry[0] !== "string" || typeof entry[1] !== "number") {
      return null;
    }
    const mod: { id: string; rank: number; slotIndex?: number } = { id: entry[0], rank: entry[1] };
    if (typeof entry[2] === "number") mod.slotIndex = entry[2];
    mods.push(mod);
  }
  return mods;
}

function packFormSlice(slice: ShareableFormSlice): Record<string, unknown> | null {
  const row: Record<string, unknown> = {};
  if (slice.mods && slice.mods.length > 0) row.m = packMods(slice.mods);
  if (slice.arcanes && slice.arcanes.some((id) => !!id)) row.a = slice.arcanes;
  if (slice.arcaneRanks && slice.arcaneRanks.length > 0) row.ar = slice.arcaneRanks;
  if (slice.slotPolarities && Object.keys(slice.slotPolarities).length > 0) row.sp = slice.slotPolarities;
  return Object.keys(row).length > 0 ? row : null;
}

function unpackFormSlice(raw: unknown): ShareableFormSlice | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const e = raw as Record<string, unknown>;
  const mods = e.m != null ? unpackMods(e.m) : [];
  if (!mods) return null;
  const slice: ShareableFormSlice = { mods };
  if (Array.isArray(e.a) && e.a.every((x) => typeof x === "string")) slice.arcanes = e.a as string[];
  if (Array.isArray(e.ar) && e.ar.every((x) => typeof x === "number")) slice.arcaneRanks = e.ar as number[];
  if (e.sp && typeof e.sp === "object" && !Array.isArray(e.sp)) {
    slice.slotPolarities = e.sp as Record<string, string>;
  }
  return slice;
}

function formSliceHasContent(slice: ShareableFormSlice): boolean {
  return (
    slice.mods.length > 0 ||
    (slice.arcanes?.some((id) => !!id) ?? false) ||
    (slice.slotPolarities != null && Object.keys(slice.slotPolarities).length > 0)
  );
}

function packExaltedSlice(slice: ShareableExaltedSlice): Record<string, unknown> | null {
  const row = packFormSlice(slice) ?? {};
  if (slice.stanceModId) row.st = slice.stanceModId;
  return Object.keys(row).length > 0 ? row : null;
}

function unpackExaltedSlice(raw: unknown): ShareableExaltedSlice | null {
  const slice = unpackFormSlice(raw);
  if (!slice || !raw || typeof raw !== "object") return null;
  const st = (raw as Record<string, unknown>).st;
  const out: ShareableExaltedSlice = { ...slice };
  if (typeof st === "string" && st) out.stanceModId = st;
  return out;
}

function exaltedSliceHasContent(slice: ShareableExaltedSlice): boolean {
  return formSliceHasContent(slice) || !!slice.stanceModId;
}

/**
 * Dense array form:
 * [1, typeCode, itemId, mods, extras?]
 * extras only present when needed: { a, s, pe, pb, mt, p, oc, mr, af, sp, ie }
 */

function packRivens(map?: Record<string, ShareableRivenRoll>): Record<string, unknown> | undefined {
  if (!map) return undefined;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(map)) {
    if (!v) continue;
    const row: Record<string, unknown> = {};
    if (v.stats && Object.keys(v.stats).length > 0) row.s = v.stats;
    if (v.polarity) row.p = v.polarity;
    if (v.drain != null) row.d = v.drain;
    if (v.name) row.n = v.name;
    if (v.libraryId) row.l = v.libraryId;
    if (Object.keys(row).length > 0) out[k] = row;
  }
  return Object.keys(out).length ? out : undefined;
}

function unpackRivens(raw: unknown): Record<string, ShareableRivenRoll> | undefined {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;
  const out: Record<string, ShareableRivenRoll> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (!v || typeof v !== "object" || Array.isArray(v)) continue;
    const row = v as Record<string, unknown>;
    const roll: ShareableRivenRoll = { stats: {} };
    if (row.s && typeof row.s === "object" && !Array.isArray(row.s)) {
      const stats: Record<string, number> = {};
      for (const [sk, sv] of Object.entries(row.s as Record<string, unknown>)) {
        if (typeof sv === "number") stats[sk] = sv;
      }
      roll.stats = stats;
    }
    if (typeof row.p === "string") roll.polarity = row.p;
    if (typeof row.d === "number") roll.drain = row.d;
    if (typeof row.n === "string") roll.name = row.n;
    if (typeof row.l === "string") roll.libraryId = row.l;
    if (
      Object.keys(roll.stats).length > 0 ||
      roll.polarity ||
      roll.drain != null ||
      roll.name ||
      roll.libraryId
    ) {
      out[k] = roll;
    }
  }
  return Object.keys(out).length ? out : undefined;
}

function packCompanionParts(parts?: ShareableCompanionParts): Record<string, unknown> | undefined {
  if (!parts || !parts.kind || !parts.model) return undefined;
  const o: Record<string, unknown> = {
    kind: parts.kind,
    model: parts.model,
    core: parts.core,
    bracket: parts.bracket,
  };
  if (parts.gyro) o.gyro = parts.gyro;
  if (parts.stabilizer) o.stabilizer = parts.stabilizer;
  if (parts.isGilded != null) o.isGilded = parts.isGilded ? 1 : 0;
  return o;
}

function unpackCompanionParts(raw: unknown): ShareableCompanionParts | undefined {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;
  const o = raw as Record<string, unknown>;
  if (typeof o.kind !== "string" || typeof o.model !== "string") return undefined;
  const parts: ShareableCompanionParts = {
    kind: o.kind,
    model: o.model,
    core: typeof o.core === "string" ? o.core : "",
    bracket: typeof o.bracket === "string" ? o.bracket : "",
  };
  if (typeof o.gyro === "string") parts.gyro = o.gyro;
  if (typeof o.stabilizer === "string") parts.stabilizer = o.stabilizer;
  if (o.isGilded === true || o.isGilded === 1) parts.isGilded = true;
  if (o.isGilded === false || o.isGilded === 0) parts.isGilded = false;
  return parts;
}

function packAmpModular(amb?: ShareableAmpModular): Record<string, unknown> | undefined {
  if (!amb) return undefined;
  const o: Record<string, unknown> = {};
  if (amb.modularType) o.mt = amb.modularType;
  if (amb.parts && Object.keys(amb.parts).length > 0) o.p = amb.parts;
  if (amb.mods && amb.mods.length > 0) o.m = packMods(amb.mods);
  if (amb.arcanes && amb.arcanes.length > 0) o.a = amb.arcanes;
  if (amb.arcaneRanks && amb.arcaneRanks.length > 0) o.ar = amb.arcaneRanks;
  if (amb.hasOrokinCatalyst) o.oc = 1;
  if (amb.slotPolarities && Object.keys(amb.slotPolarities).length > 0) o.sp = amb.slotPolarities;
  const rs = packRivens(amb.rivenBySlot);
  if (rs) o.rs = rs;
  return Object.keys(o).length ? o : undefined;
}

function unpackAmpModular(raw: unknown): ShareableAmpModular | undefined {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;
  const e = raw as Record<string, unknown>;
  const amb: ShareableAmpModular = {};
  if (typeof e.mt === "string") amb.modularType = e.mt;
  if (e.p && typeof e.p === "object" && !Array.isArray(e.p)) {
    amb.parts = e.p as Record<string, string>;
  }
  if (e.m != null) {
    const mods = unpackMods(e.m);
    if (mods) amb.mods = mods;
  }
  if (Array.isArray(e.a) && e.a.every((x) => typeof x === "string")) amb.arcanes = e.a as string[];
  if (Array.isArray(e.ar) && e.ar.every((x) => typeof x === "number")) amb.arcaneRanks = e.ar as number[];
  if (e.oc) amb.hasOrokinCatalyst = true;
  if (e.sp && typeof e.sp === "object" && !Array.isArray(e.sp)) {
    amb.slotPolarities = e.sp as Record<string, string>;
  }
  const rs = unpackRivens(e.rs);
  if (rs) amb.rivenBySlot = rs;
  return Object.keys(amb).length ? amb : undefined;
}

function packStringRecord(rec?: Record<string, string>): Record<string, string> | undefined {
  if (!rec || Object.keys(rec).length === 0) return undefined;
  return rec;
}

function packCrewWeapon(w?: ShareableCrewWeapon): Record<string, unknown> | undefined {
  if (!w || !w.weaponId) return undefined;
  const o: Record<string, unknown> = { wid: w.weaponId };
  if (w.mods && w.mods.length > 0) o.m = packMods(w.mods);
  const sp = packStringRecord(w.slotPolarities);
  if (sp) o.sp = sp;
  if (w.hasOrokinCatalyst) o.oc = 1;
  if (w.progenitorElement) o.pe = w.progenitorElement;
  if (w.progenitorBonusPercent != null) o.pb = w.progenitorBonusPercent;
  const rs = packRivens(w.rivenBySlot);
  if (rs) o.rs = rs;
  return o;
}

function unpackCrewWeapon(raw: unknown): ShareableCrewWeapon | undefined {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;
  const e = raw as Record<string, unknown>;
  if (typeof e.wid !== "string" || !e.wid) return undefined;
  const w: ShareableCrewWeapon = { weaponId: e.wid, mods: unpackMods(e.m) ?? [] };
  if (e.sp && typeof e.sp === "object" && !Array.isArray(e.sp)) {
    w.slotPolarities = e.sp as Record<string, string>;
  }
  if (e.oc) w.hasOrokinCatalyst = true;
  if (typeof e.pe === "string") w.progenitorElement = e.pe;
  if (typeof e.pb === "number") w.progenitorBonusPercent = e.pb;
  const rs = unpackRivens(e.rs);
  if (rs) w.rivenBySlot = rs;
  return w;
}

function packCrewSlots(slots?: (ShareableCrewSlot | null)[]): unknown[] | undefined {
  if (!slots || slots.length === 0) return undefined;
  return slots.map((s) => {
    if (!s) return null;
    const o: Record<string, unknown> = { r: s.role, s: s.source, id: s.profileId };
    if (s.competency && Object.keys(s.competency).length > 0) o.c = s.competency;
    if (s.eliteTraitId) o.et = s.eliteTraitId;
    const wl = packCrewWeapon(s.weaponLoadout);
    if (wl) o.w = wl;
    return o;
  });
}

function unpackCrewSlots(raw: unknown): (ShareableCrewSlot | null)[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  return raw.map((row) => {
    if (row == null) return null;
    if (typeof row !== "object" || Array.isArray(row)) return null;
    const e = row as Record<string, unknown>;
    if (typeof e.r !== "string" || typeof e.s !== "string" || typeof e.id !== "string") return null;
    const slot: ShareableCrewSlot = { role: e.r, source: e.s, profileId: e.id };
    if (e.c && typeof e.c === "object" && !Array.isArray(e.c)) {
      const comp: Record<string, number> = {};
      for (const [k, v] of Object.entries(e.c as Record<string, unknown>)) {
        if (typeof v === "number") comp[k] = v;
      }
      if (Object.keys(comp).length > 0) slot.competency = comp;
    }
    if (typeof e.et === "string") slot.eliteTraitId = e.et;
    const wl = unpackCrewWeapon(e.w);
    if (wl) slot.weaponLoadout = wl;
    return slot;
  });
}

function packSimulation(sim?: ShareableRailjackSimulation): Record<string, unknown> | undefined {
  if (!sim) return undefined;
  const o: Record<string, unknown> = {};
  if (sim.crimsonFugueStacks != null) o.cf = sim.crimsonFugueStacks;
  if (sim.cruisingSpeedActive != null) o.cs = sim.cruisingSpeedActive ? 1 : 0;
  if (sim.protectiveShotsActive != null) o.ps = sim.protectiveShotsActive ? 1 : 0;
  if (sim.shieldsDepleted != null) o.sd = sim.shieldsDepleted ? 1 : 0;
  if (sim.activeBattleAbilityId !== undefined) o.ba = sim.activeBattleAbilityId;
  if (sim.activeTacticalAbilityId !== undefined) o.ta = sim.activeTacticalAbilityId;
  return Object.keys(o).length ? o : undefined;
}

function unpackSimulation(raw: unknown): ShareableRailjackSimulation | undefined {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;
  const e = raw as Record<string, unknown>;
  const sim: ShareableRailjackSimulation = {};
  if (typeof e.cf === "number") sim.crimsonFugueStacks = e.cf;
  if (e.cs === 0 || e.cs === 1) sim.cruisingSpeedActive = e.cs === 1;
  if (e.ps === 0 || e.ps === 1) sim.protectiveShotsActive = e.ps === 1;
  if (e.sd === 0 || e.sd === 1) sim.shieldsDepleted = e.sd === 1;
  if (e.ba === null || typeof e.ba === "string") sim.activeBattleAbilityId = e.ba as string | null;
  if (e.ta === null || typeof e.ta === "string") sim.activeTacticalAbilityId = e.ta as string | null;
  return Object.keys(sim).length ? sim : undefined;
}

function packRailjack(rj?: ShareableRailjack): Record<string, unknown> | undefined {
  if (!rj) return undefined;
  const o: Record<string, unknown> = {};
  if (rj.reactorId) o.rc = rj.reactorId;
  if (rj.shieldId) o.sh = rj.shieldId;
  if (rj.engineId) o.en = rj.engineId;
  if (rj.platingId) o.pl = rj.platingId;
  if (rj.reactorTraitId) o.rt = rj.reactorTraitId;
  if (rj.shieldTraitId) o.st = rj.shieldTraitId;
  if (rj.engineTraitId) o.et = rj.engineTraitId;
  if (rj.turretIds && rj.turretIds.length > 0) o.tu = rj.turretIds.map((id) => id ?? null);
  if (rj.turretId) o.tid = rj.turretId;
  if (rj.ordnanceId) o.or = rj.ordnanceId;
  if (rj.battleMods && rj.battleMods.length > 0) o.bm = packMods(rj.battleMods);
  if (rj.tacticalMods && rj.tacticalMods.length > 0) o.tm = packMods(rj.tacticalMods);
  const ip = packStringRecord(rj.integratedPolarities);
  if (ip) o.ip = ip;
  const bp = packStringRecord(rj.battlePolarities);
  if (bp) o.bp = bp;
  const tp = packStringRecord(rj.tacticalPolarities);
  if (tp) o.tp = tp;
  const cr = packCrewSlots(rj.crewSlots);
  if (cr) o.cr = cr;
  if (rj.eliteCrewId) o.el = rj.eliteCrewId;
  if (rj.intrinsics && Object.keys(rj.intrinsics).length > 0) o.in = rj.intrinsics;
  const sm = packSimulation(rj.simulation);
  if (sm) o.sm = sm;
  return Object.keys(o).length ? o : undefined;
}

function unpackRailjack(raw: unknown): ShareableRailjack | undefined {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;
  const e = raw as Record<string, unknown>;
  const rj: ShareableRailjack = {};
  if (typeof e.rc === "string") rj.reactorId = e.rc;
  if (typeof e.sh === "string") rj.shieldId = e.sh;
  if (typeof e.en === "string") rj.engineId = e.en;
  if (typeof e.pl === "string") rj.platingId = e.pl;
  if (typeof e.rt === "string") rj.reactorTraitId = e.rt;
  if (typeof e.st === "string") rj.shieldTraitId = e.st;
  if (typeof e.et === "string") rj.engineTraitId = e.et;
  if (Array.isArray(e.tu)) {
    rj.turretIds = e.tu.map((id) => (typeof id === "string" ? id : null));
  }
  if (typeof e.tid === "string") rj.turretId = e.tid;
  if (typeof e.or === "string") rj.ordnanceId = e.or;
  if (e.bm != null) {
    const bm = unpackMods(e.bm);
    if (bm) rj.battleMods = bm;
  }
  if (e.tm != null) {
    const tm = unpackMods(e.tm);
    if (tm) rj.tacticalMods = tm;
  }
  if (e.ip && typeof e.ip === "object" && !Array.isArray(e.ip)) {
    rj.integratedPolarities = e.ip as Record<string, string>;
  }
  if (e.bp && typeof e.bp === "object" && !Array.isArray(e.bp)) {
    rj.battlePolarities = e.bp as Record<string, string>;
  }
  if (e.tp && typeof e.tp === "object" && !Array.isArray(e.tp)) {
    rj.tacticalPolarities = e.tp as Record<string, string>;
  }
  const cr = unpackCrewSlots(e.cr);
  if (cr) rj.crewSlots = cr;
  if (typeof e.el === "string") rj.eliteCrewId = e.el;
  if (e.in && typeof e.in === "object" && !Array.isArray(e.in)) {
    const inn: Record<string, number> = {};
    for (const [k, v] of Object.entries(e.in as Record<string, unknown>)) {
      if (typeof v === "number") inn[k] = v;
    }
    if (Object.keys(inn).length > 0) rj.intrinsics = inn;
  }
  const sm = unpackSimulation(e.sm);
  if (sm) rj.simulation = sm;
  return Object.keys(rj).length ? rj : undefined;
}

export function packShareableBuild(build: ShareableBuild): unknown[] {
  const mods: PackedMod[] = packMods(build.mods);

  const extras: Record<string, unknown> = {};
  if (build.arcanes && build.arcanes.length > 0) extras.a = build.arcanes;
  if (build.arcaneRanks && build.arcaneRanks.length > 0) extras.ar = build.arcaneRanks;
  if (build.shards && build.shards.length > 0) {
    extras.s = build.shards.map((sh) => [sh.id, sh.bonus]);
  }
  if (build.progenitorElement) extras.pe = build.progenitorElement;
  if (build.progenitorBonusPercent != null) extras.pb = build.progenitorBonusPercent;
  if (build.modularType) extras.mt = build.modularType;
  if (build.parts && Object.keys(build.parts).length > 0) extras.p = build.parts;
  if (build.hasOrokinCatalyst) extras.oc = 1;
  if (build.isMR30) extras.mr = 1;
  if (build.adversaryFormas != null && build.adversaryFormas > 0) extras.af = build.adversaryFormas;
  if (build.slotPolarities && Object.keys(build.slotPolarities).length > 0) {
    extras.sp = build.slotPolarities;
  }
  if (build.incarnonEvolutions && Object.keys(build.incarnonEvolutions).length > 0) {
    extras.ie = build.incarnonEvolutions;
  }
  const onConditionals = Object.keys(build.incarnonConditionals ?? {}).filter(
    (k) => build.incarnonConditionals?.[k] === true,
  );
  if (onConditionals.length > 0) extras.ic = onConditionals;
  if (build.incarnonGenesisInstalled != null) extras.ig = build.incarnonGenesisInstalled ? 1 : 0;
  if (build.dualFormBuilds) {
    const df: Record<string, unknown> = {};
    for (const [id, slice] of Object.entries(build.dualFormBuilds)) {
      const row = packFormSlice(slice);
      if (row) df[id] = row;
    }
    if (Object.keys(df).length > 0) extras.df = df;
  }
  if (build.hasOrokinReactor) extras.hr = 1;
  if (build.helminthSlot != null || build.helminthAbilityId) {
    extras.h = [build.helminthSlot ?? null, build.helminthAbilityId ?? null];
  }
  if (build.exalted) {
    const row = packExaltedSlice(build.exalted);
    if (row) extras.x = row;
  }
  if (build.exaltedMelee) {
    const row = packExaltedSlice(build.exaltedMelee);
    if (row) extras.xm = row;
  }
  if (build.arcaneStacksById && Object.keys(build.arcaneStacksById).length > 0) {
    extras.as = build.arcaneStacksById;
  }
  if (build.conditionalModStacksById && Object.keys(build.conditionalModStacksById).length > 0) {
    extras.cm = build.conditionalModStacksById;
  }
  const packedRivens = packRivens(build.rivenBySlot);
  if (packedRivens) extras.rs = packedRivens;
  if (build.weaponId) extras.wid = build.weaponId;
  if (build.weaponMods && build.weaponMods.length > 0) extras.wm = packMods(build.weaponMods);
  if (build.weaponSlotPolarities && Object.keys(build.weaponSlotPolarities).length > 0) {
    extras.wsp = build.weaponSlotPolarities;
  }
  const packedWeaponRivens = packRivens(build.weaponRivenBySlot);
  if (packedWeaponRivens) extras.wrs = packedWeaponRivens;
  const packedParts = packCompanionParts(build.companionParts);
  if (packedParts) extras.cp = packedParts;
  if (build.customName) extras.cn = build.customName;
  if (build.archwingMode) extras.md = build.archwingMode;
  if (build.railjackGunnery != null && build.railjackGunnery > 0) extras.rg = build.railjackGunnery;
  const packedRj = packRailjack(build.railjack);
  if (packedRj) extras.rj = packedRj;
  if (build.focusSchool) extras.fs = build.focusSchool;
  if (build.ampId) extras.aid = build.ampId;
  if (build.ampName) extras.an = build.ampName;
  const packedAmp = packAmpModular(build.ampModular);
  if (packedAmp) extras.amb = packedAmp;
  if (build.operatorArcanes && build.operatorArcanes.length > 0) extras.oa = build.operatorArcanes;
  if (build.operatorArcaneRanks && build.operatorArcaneRanks.length > 0) extras.oar = build.operatorArcaneRanks;
  if (build.ampArcaneIds && build.ampArcaneIds.length > 0) extras.aa = build.ampArcaneIds;
  if (build.ampArcaneRanks && build.ampArcaneRanks.length > 0) extras.aar = build.ampArcaneRanks;

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

  const mods = unpackMods(modsRaw);
  if (!mods) return null;

  const build: ShareableBuild = { type, itemId, mods };
  if (extrasRaw && typeof extrasRaw === "object" && !Array.isArray(extrasRaw)) {
    const e = extrasRaw as Record<string, unknown>;
    if (Array.isArray(e.a) && e.a.every((x) => typeof x === "string")) {
      build.arcanes = e.a as string[];
    }
    if (Array.isArray(e.ar) && e.ar.every((x) => typeof x === "number")) {
      build.arcaneRanks = e.ar as number[];
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
    if (typeof e.af === "number") build.adversaryFormas = e.af;
    if (e.sp && typeof e.sp === "object" && !Array.isArray(e.sp)) {
      build.slotPolarities = e.sp as Record<string, string>;
    }
    if (e.ie && typeof e.ie === "object" && !Array.isArray(e.ie)) {
      build.incarnonEvolutions = e.ie as Record<number, number>;
    }
    if (Array.isArray(e.ic)) {
      const on: Record<string, boolean> = {};
      for (const k of e.ic) if (typeof k === "string") on[k] = true;
      build.incarnonConditionals = on;
    }
    if (e.ig === 0 || e.ig === 1) build.incarnonGenesisInstalled = e.ig === 1;
    if (e.df && typeof e.df === "object" && !Array.isArray(e.df)) {
      const df: Record<string, ShareableFormSlice> = {};
      for (const [id, raw] of Object.entries(e.df as Record<string, unknown>)) {
        const slice = unpackFormSlice(raw);
        if (slice) df[id] = slice;
      }
      if (Object.keys(df).length > 0) build.dualFormBuilds = df;
    }
    if (e.hr) build.hasOrokinReactor = true;
    if (Array.isArray(e.h)) {
      const slot = e.h[0];
      const ability = e.h[1];
      if (typeof slot === "number") build.helminthSlot = slot;
      else if (slot === null) build.helminthSlot = null;
      if (typeof ability === "string" && ability) build.helminthAbilityId = ability;
    }
    if (e.x) {
      const slice = unpackExaltedSlice(e.x);
      if (slice) build.exalted = slice;
    }
    if (e.xm) {
      const slice = unpackExaltedSlice(e.xm);
      if (slice) build.exaltedMelee = slice;
    }
    if (e.as && typeof e.as === "object" && !Array.isArray(e.as)) {
      const as: Record<string, number> = {};
      for (const [k, v] of Object.entries(e.as as Record<string, unknown>)) {
        if (typeof v === "number") as[k] = v;
      }
      if (Object.keys(as).length > 0) build.arcaneStacksById = as;
    }
    if (e.cm && typeof e.cm === "object" && !Array.isArray(e.cm)) {
      const cm: Record<string, number> = {};
      for (const [k, v] of Object.entries(e.cm as Record<string, unknown>)) {
        if (typeof v === "number") cm[k] = v;
      }
      if (Object.keys(cm).length > 0) build.conditionalModStacksById = cm;
    }
    const rs = unpackRivens(e.rs);
    if (rs) build.rivenBySlot = rs;
    if (typeof e.wid === "string" && e.wid) build.weaponId = e.wid;
    if (e.wm != null) {
      const wm = unpackMods(e.wm);
      if (wm) build.weaponMods = wm;
    }
    if (e.wsp && typeof e.wsp === "object" && !Array.isArray(e.wsp)) {
      build.weaponSlotPolarities = e.wsp as Record<string, string>;
    }
    const wrs = unpackRivens(e.wrs);
    if (wrs) build.weaponRivenBySlot = wrs;
    const cp = unpackCompanionParts(e.cp);
    if (cp) build.companionParts = cp;
    if (typeof e.cn === "string" && e.cn) build.customName = e.cn;
    if (typeof e.md === "string" && e.md) build.archwingMode = e.md;
    if (typeof e.rg === "number") build.railjackGunnery = e.rg;
    const rj = unpackRailjack(e.rj);
    if (rj) build.railjack = rj;
    if (typeof e.fs === "string" && e.fs) build.focusSchool = e.fs;
    if (typeof e.aid === "string" && e.aid) build.ampId = e.aid;
    if (typeof e.an === "string" && e.an) build.ampName = e.an;
    const amb = unpackAmpModular(e.amb);
    if (amb) build.ampModular = amb;
    if (Array.isArray(e.oa) && e.oa.every((x) => typeof x === "string")) {
      build.operatorArcanes = e.oa as string[];
    }
    if (Array.isArray(e.oar) && e.oar.every((x) => typeof x === "number")) {
      build.operatorArcaneRanks = e.oar as number[];
    }
    if (Array.isArray(e.aa) && e.aa.every((x) => typeof x === "string")) {
      build.ampArcaneIds = e.aa as string[];
    }
    if (Array.isArray(e.aar) && e.aar.every((x) => typeof x === "number")) {
      build.ampArcaneRanks = e.aar as number[];
    }
  }
  return build;
}

function modsToShare(mods: { modId: string; rank: number; slotIndex?: number }[]): ShareableBuild["mods"] {
  return mods.map((m) => ({
    id: m.modId,
    rank: m.rank,
    ...(m.slotIndex != null ? { slotIndex: m.slotIndex } : {}),
  }));
}

function polaritiesToShare(p?: Record<number | string, string>): Record<string, string> | undefined {
  if (!p) return undefined;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(p)) {
    if (v) out[String(k)] = v;
  }
  return Object.keys(out).length ? out : undefined;
}

function arcanesToShare(ids?: (string | null)[]): string[] | undefined {
  if (!ids || ids.length === 0) return undefined;
  return ids.map((id) => id ?? "");
}

type ShareMod = { modId: string; rank: number; slotIndex?: number };

function exaltedToShare(
  mods?: ShareMod[],
  polarities?: Record<number | string, string>,
  arcaneIds?: (string | null)[],
  arcaneRanks?: number[],
  stanceModId?: string,
): ShareableExaltedSlice | undefined {
  const slice: ShareableExaltedSlice = {
    mods: modsToShare(mods ?? []),
    arcanes: arcanesToShare(arcaneIds),
    arcaneRanks,
    slotPolarities: polaritiesToShare(polarities),
  };
  if (stanceModId) slice.stanceModId = stanceModId;
  return exaltedSliceHasContent(slice) ? slice : undefined;
}

/** Share payload for a Warframe, including any second form, Helminth, and exalted weapons. */
export function warframeBuildToShare(opts: {
  warframeId: string;
  mods: ShareMod[];
  arcaneIds?: (string | null)[];
  arcaneRanks?: number[];
  slotPolarities?: Record<number | string, string>;
  shards?: { id: string; bonus: string }[];
  dualFormBuilds?: Record<string, {
    mods: ShareMod[];
    arcaneIds?: (string | null)[];
    arcaneRanks?: number[];
    slotPolarities?: Record<number | string, string>;
  }>;
  hasOrokinReactor?: boolean;
  isMR30?: boolean;
  helminthSlot?: number | null;
  helminthAbilityId?: string | null;
  exaltedMods?: ShareMod[];
  exaltedSlotPolarities?: Record<number | string, string>;
  exaltedArcaneIds?: (string | null)[];
  exaltedArcaneRanks?: number[];
  exaltedStanceModId?: string;
  exaltedMeleeMods?: ShareMod[];
  exaltedMeleeSlotPolarities?: Record<number | string, string>;
  exaltedMeleeArcaneIds?: (string | null)[];
  exaltedMeleeArcaneRanks?: number[];
  exaltedMeleeStanceModId?: string;
  arcaneStacksById?: Record<string, number>;
  conditionalModStacksById?: Record<string, number>;
}): ShareableBuild {
  const build: ShareableBuild = {
    type: "warframe",
    itemId: opts.warframeId,
    mods: modsToShare(opts.mods ?? []),
  };
  const arcanes = arcanesToShare(opts.arcaneIds);
  if (arcanes) build.arcanes = arcanes;
  if (opts.arcaneRanks && opts.arcaneRanks.length > 0) build.arcaneRanks = opts.arcaneRanks;
  const sp = polaritiesToShare(opts.slotPolarities);
  if (sp) build.slotPolarities = sp;
  if (opts.shards && opts.shards.length > 0) build.shards = opts.shards;
  if (opts.hasOrokinReactor) build.hasOrokinReactor = true;
  if (opts.isMR30) build.isMR30 = true;
  if (opts.helminthSlot != null) build.helminthSlot = opts.helminthSlot;
  if (opts.helminthAbilityId) build.helminthAbilityId = opts.helminthAbilityId;
  const exalted = exaltedToShare(
    opts.exaltedMods,
    opts.exaltedSlotPolarities,
    opts.exaltedArcaneIds,
    opts.exaltedArcaneRanks,
    opts.exaltedStanceModId,
  );
  if (exalted) build.exalted = exalted;
  const exaltedMelee = exaltedToShare(
    opts.exaltedMeleeMods,
    opts.exaltedMeleeSlotPolarities,
    opts.exaltedMeleeArcaneIds,
    opts.exaltedMeleeArcaneRanks,
    opts.exaltedMeleeStanceModId,
  );
  if (exaltedMelee) build.exaltedMelee = exaltedMelee;
  if (opts.arcaneStacksById && Object.keys(opts.arcaneStacksById).length > 0) {
    build.arcaneStacksById = opts.arcaneStacksById;
  }
  if (opts.conditionalModStacksById && Object.keys(opts.conditionalModStacksById).length > 0) {
    build.conditionalModStacksById = opts.conditionalModStacksById;
  }
  if (opts.dualFormBuilds) {
    const df: Record<string, ShareableFormSlice> = {};
    for (const [id, slice] of Object.entries(opts.dualFormBuilds)) {
      const shareSlice: ShareableFormSlice = {
        mods: modsToShare(slice.mods ?? []),
        arcanes: arcanesToShare(slice.arcaneIds),
        arcaneRanks: slice.arcaneRanks,
        slotPolarities: polaritiesToShare(slice.slotPolarities),
      };
      if (formSliceHasContent(shareSlice)) df[id] = shareSlice;
    }
    if (Object.keys(df).length > 0) build.dualFormBuilds = df;
  }
  return build;
}

/** Convert a shared exalted slice back into the builder's slot records. */
export function shareExaltedToBuildSlice(slice: ShareableExaltedSlice): {
  mods: { modId: string; rank: number; slotIndex: number }[];
  slotPolarities: Record<number, string>;
  arcaneIds: (string | null)[];
  arcaneRanks: number[];
  stanceModId?: string;
} {
  const form = shareFormToBuildSlice(slice);
  return {
    ...form,
    ...(slice.stanceModId ? { stanceModId: slice.stanceModId } : {}),
  };
}

/** Convert a shared form slice back into the builder's dual-form record. */
export function shareFormToBuildSlice(slice: ShareableFormSlice): {
  mods: { modId: string; rank: number; slotIndex: number }[];
  slotPolarities: Record<number, string>;
  arcaneIds: (string | null)[];
  arcaneRanks: number[];
} {
  return {
    mods: (slice.mods ?? []).map((m, i) => ({
      modId: m.id,
      rank: m.rank,
      slotIndex: m.slotIndex ?? i,
    })),
    slotPolarities: Object.fromEntries(
      Object.entries(slice.slotPolarities ?? {}).map(([k, v]) => [Number(k), v]),
    ),
    arcaneIds: [0, 1].map((i) => {
      const id = slice.arcanes?.[i];
      return id ? id : null;
    }),
    arcaneRanks: [0, 1].map((i) =>
      typeof slice.arcaneRanks?.[i] === "number" ? slice.arcaneRanks![i]! : 5,
    ),
  };
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

/**
 * Browser deflate via CompressionStream. Reads while writing (pipeThrough + Response): awaiting
 * writer.write/close before reading deadlocks, because the readable side has no buffer.
 */
export async function deflateUtf8(text: string): Promise<Uint8Array | null> {
  try {
    if (typeof CompressionStream === "undefined" || typeof Response === "undefined" || typeof Blob === "undefined") {
      return null;
    }
    const stream = new Blob([text]).stream().pipeThrough(new CompressionStream("deflate"));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  } catch {
    return null;
  }
}

export async function inflateToUtf8(bytes: Uint8Array): Promise<string | null> {
  try {
    if (typeof DecompressionStream === "undefined" || typeof Response === "undefined" || typeof Blob === "undefined") {
      return null;
    }
    // Copy into a fresh ArrayBuffer-backed view — TS DOM typings reject Uint8Array<ArrayBufferLike>.
    const input = new Uint8Array(bytes.length);
    input.set(bytes);
    const stream = new Blob([input]).stream().pipeThrough(new DecompressionStream("deflate"));
    return await new Response(stream).text();
  } catch {
    return null;
  }
}

/**
 * Node's built-in zlib (server / vitest only). Looked up at runtime through
 * `process.getBuiltinModule` instead of `require("zlib")`: a static require is resolved by the
 * client bundler, which then ships the zlib + Buffer + stream polyfills (~69 KB gzipped) on every
 * page that imports this module. Browsers use CompressionStream via the async helpers above.
 */
function nodeZlib(): typeof import("zlib") | null {
  const proc = (globalThis as { process?: { getBuiltinModule?: (id: string) => unknown } }).process;
  const mod = proc?.getBuiltinModule?.("node:zlib");
  return (mod as typeof import("zlib") | undefined) ?? null;
}

export function inflateToUtf8Sync(bytes: Uint8Array): string | null {
  try {
    const zlib = nodeZlib();
    if (!zlib) return null;
    return new TextDecoder().decode(zlib.inflateSync(bytes));
  } catch {
    return null;
  }
}

export function deflateUtf8Sync(text: string): Uint8Array | null {
  try {
    const zlib = nodeZlib();
    if (!zlib) return null;
    return new Uint8Array(zlib.deflateSync(new TextEncoder().encode(text)));
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
    : build.type === "operator" ? "/operator-builder"
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
  operator: "/operator-builder",
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
