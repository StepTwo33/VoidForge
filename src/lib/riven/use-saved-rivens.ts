"use client";

import { useCallback, useEffect, useState } from "react";
import type { SavedRivenEntry } from "@/components/mod-picker";
import { hasClientSession } from "@/lib/auth/client-session";
import {
  getSavedRivens as getCloudSavedRivens,
  saveRiven as saveCloudRiven,
} from "@/lib/riven/saved-rivens";
import {
  evaluateSavedRiven,
  generateRivenId,
  getSavedRivens as getLocalSavedRivens,
  saveRiven as saveLocalRiven,
  type SavedRiven,
} from "@/lib/rivens/riven-storage";
import { rivenRankFromDrain } from "@/lib/riven/riven-validation";
import {
  getEffectiveRivenWeaponType,
  getRivenBaseWeapon,
  getRivenFamilyWeaponIds,
  resolveRivenWeapon,
} from "@/lib/weapons/riven-family";
import { getRivenModIdForWeapon, getRivenWeaponType } from "@/lib/weapons/riven-weapon-type";
import type { Weapon } from "@/lib/types";

function toSavedRivenEntry(r: SavedRiven): SavedRivenEntry {
  const resolvedWeapon = resolveRivenWeapon(r.weaponId);
  let modId = getRivenModIdForWeapon(resolvedWeapon) ?? "riven_rifle";
  if (!resolvedWeapon) {
    const wt = (r.weaponType || "").toLowerCase();
    if (wt.includes("shotgun")) modId = "riven_shotgun";
    else if (wt.includes("pistol")) modId = "riven_pistol";
    else if (wt.includes("melee")) modId = "riven_melee";
    else if (wt.includes("kitgun")) modId = "kitgun_riven_mod";
    else if (wt.includes("zaw")) modId = "zaw_riven_mod";
    else if (wt.includes("companion")) modId = "companion_weapon_riven_mod";
    else if (wt.includes("archgun")) modId = "archgun_riven_mod";
  }

  return {
    id: r.id,
    name: r.name,
    modId,
    stats: r.stats,
    polarity: r.polarity,
    drain: 10 + (r.rank ?? 8),
  };
}

/**
 * Saves a builder-authored riven to the local Riven Library immediately and
 * syncs to `/api/rivens` when signed in. Resolves modular (`kitgun_*` / `zaw_*`)
 * and variant weapon IDs to their canonical base weapon so saving never fails.
 */
export async function saveBuilderRivenToLibrary(
  weapon: Pick<Weapon, "id" | "name" | "category"> & {
    hasRivenSlot?: boolean;
    kitgunChamberCategory?: Weapon["kitgunChamberCategory"];
    arcaneType?: string;
  },
  riven: { name: string; modId: string; stats: Record<string, number>; polarity: string; drain: number },
): Promise<boolean> {
  const resolved = resolveRivenWeapon(weapon.id);
  const baseWeapon = resolved ? getRivenBaseWeapon(resolved) : null;
  const canonicalId = baseWeapon?.id ?? resolved?.id ?? weapon.id;
  const canonicalName = baseWeapon?.name ?? resolved?.name ?? weapon.name;
  const canonicalCategory = baseWeapon?.category ?? resolved?.category ?? weapon.category;
  const effType = getEffectiveRivenWeaponType(baseWeapon ?? resolved ?? weapon) ?? "Rifle";
  const statPool = getRivenWeaponType(baseWeapon ?? resolved ?? weapon) ?? "Rifle";
  const rank = rivenRankFromDrain(riven.drain);

  let cloudSavedId: string | null = null;
  try {
    const cloudSaved = await saveCloudRiven({
      weaponId: canonicalId,
      name: riven.name,
      modId: riven.modId,
      stats: riven.stats,
      polarity: riven.polarity,
      drain: riven.drain,
    });
    if (cloudSaved?.id) cloudSavedId = cloudSaved.id;
  } catch {
    // Cloud sync is best-effort; local save below guarantees persistence.
  }

  try {
    const evalRes = evaluateSavedRiven(canonicalName, statPool, riven.stats, rank, 0, riven.polarity);
    saveLocalRiven({
      id: cloudSavedId ?? generateRivenId(),
      weaponId: canonicalId,
      weaponName: canonicalName,
      weaponCategory: canonicalCategory,
      weaponType: effType,
      name: riven.name,
      stats: riven.stats,
      displayStats: evalRes.displayStats,
      polarity: riven.polarity,
      rank,
      rerolls: 0,
      masteryRank: 12,
      score: evalRes.score,
      grade: evalRes.grade,
      gradeColor: evalRes.color,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return true;
  } catch {
    return cloudSavedId !== null;
  }
}

/**
 * Saved rivens for one weapon (merging local Riven Library and cloud if signed in),
 * plus a refresh hook so "Save to library" in the mod picker shows the new riven straight away.
 */
export function useSavedRivenLibrary(weaponId: string | undefined): {
  list: SavedRivenEntry[];
  signedIn: boolean;
  refresh: () => void;
} {
  const [state, setState] = useState<{ weaponId?: string; list: SavedRivenEntry[] }>({ list: [] });
  const [signedIn, setSignedIn] = useState(false);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let alive = true;
    hasClientSession().then((ok) => {
      if (alive) setSignedIn(ok);
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!weaponId) return;
    const targetWeaponId = weaponId;
    let alive = true;

    async function load() {
      const familyIds = new Set(getRivenFamilyWeaponIds(targetWeaponId));
      familyIds.add(targetWeaponId);

      const map = new Map<string, SavedRivenEntry>();

      // 1. Load local rivens matching this weapon or family
      try {
        const localRivens = getLocalSavedRivens();
        for (const r of localRivens) {
          if (familyIds.has(r.weaponId) || r.weaponId === targetWeaponId) {
            map.set(r.id, toSavedRivenEntry(r));
          }
        }
      } catch {
        // localStorage unavailable
      }

      // 2. Load cloud rivens if signed in
      try {
        const cloudRivens = await getCloudSavedRivens(weaponId);
        for (const c of cloudRivens) {
          map.set(c.id, {
            id: c.id,
            name: c.name,
            modId: c.modId,
            stats: c.stats,
            polarity: c.polarity,
            drain: c.drain,
          });
        }
      } catch {
        // Ignore network failure
      }

      if (alive) {
        setState({ weaponId, list: Array.from(map.values()) });
      }
    }

    load();

    return () => {
      alive = false;
    };
  }, [weaponId, version]);

  const refresh = useCallback(() => setVersion((v) => v + 1), []);
  return { list: weaponId && state.weaponId === weaponId ? state.list : [], signedIn, refresh };
}

/** Saved rivens for one weapon. */
export function useSavedRivens(weaponId: string | undefined): SavedRivenEntry[] {
  return useSavedRivenLibrary(weaponId).list;
}
