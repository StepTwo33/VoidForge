import { hasClientSession } from "@/lib/auth/client-session";
import { clampRivenDrain, normalizeRivenPolarity } from "@/lib/riven/riven-validation";

/** Saved riven library (Round 54). Mirrors the cloud half of build-storage: signed-in only. */
export interface SavedRiven {
  id: string;
  weaponId: string;
  name: string;
  modId: string;
  stats: Record<string, number>;
  polarity: string;
  drain: number;
  createdAt: number;
  updatedAt: number;
}

export const SAVED_RIVEN_NAME_MAX = 80;
export const RIVEN_MOD_IDS = [
  "riven_rifle",
  "riven_shotgun",
  "riven_pistol",
  "riven_melee",
  "kitgun_riven_mod",
  "zaw_riven_mod",
  "companion_weapon_riven_mod",
  "archgun_riven_mod",
] as const;

/** Keep only finite numeric stats (max 4) so bad JSON never reaches the builder. */
export function sanitizeRivenStats(raw: unknown): Record<string, number> | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof v !== "number" || !Number.isFinite(v) || !/^[A-Za-z]{1,40}$/.test(k)) return null;
    out[k] = v;
  }
  const n = Object.keys(out).length;
  return n >= 1 && n <= 4 ? out : null;
}

export function parseSavedRivenRow(row: {
  id: string; weaponId: string; name: string; modId: string; stats: string; polarity: string; drain: number;
  createdAt: Date; updatedAt: Date;
}): SavedRiven {
  let stats: Record<string, number> = {};
  try {
    stats = sanitizeRivenStats(JSON.parse(row.stats)) ?? {};
  } catch {
    stats = {};
  }
  return {
    id: row.id,
    weaponId: row.weaponId,
    name: row.name,
    modId: row.modId,
    stats,
    polarity: normalizeRivenPolarity(row.polarity),
    drain: clampRivenDrain(row.drain),
    createdAt: row.createdAt.getTime(),
    updatedAt: row.updatedAt.getTime(),
  };
}

export async function getSavedRivens(weaponId?: string): Promise<SavedRiven[]> {
  try {
    if (!(await hasClientSession())) return [];
    const res = await fetch(weaponId ? `/api/rivens?weaponId=${encodeURIComponent(weaponId)}` : "/api/rivens");
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function saveRiven(
  riven: Omit<SavedRiven, "id" | "createdAt" | "updatedAt"> & { id?: string },
): Promise<SavedRiven | null> {
  try {
    if (!(await hasClientSession())) return null;
    const res = await fetch("/api/rivens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(riven),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function deleteSavedRiven(id: string): Promise<boolean> {
  try {
    if (!(await hasClientSession())) return false;
    const res = await fetch(`/api/rivens/${encodeURIComponent(id)}`, { method: "DELETE" });
    return res.ok;
  } catch {
    return false;
  }
}
