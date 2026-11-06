"use client";

import { useCallback, useEffect, useState } from "react";
import type { SavedRivenEntry } from "@/components/mod-picker";
import { hasClientSession } from "@/lib/auth/client-session";
import { getSavedRivens as getCloudSavedRivens } from "@/lib/riven/saved-rivens";
import { getSavedRivens as getLocalSavedRivens, type SavedRiven } from "@/lib/rivens/riven-storage";
import { getRivenFamilyWeaponIds } from "@/lib/weapons/riven-family";

function toSavedRivenEntry(r: SavedRiven): SavedRivenEntry {
  let modId = "riven_rifle";
  const wt = (r.weaponType || "").toLowerCase();
  if (wt.includes("shotgun")) modId = "riven_shotgun";
  else if (wt.includes("pistol")) modId = "riven_pistol";
  else if (wt.includes("melee")) modId = "riven_melee";
  else if (wt.includes("kitgun")) modId = "kitgun_riven_mod";
  else if (wt.includes("zaw")) modId = "zaw_riven_mod";
  else if (wt.includes("companion")) modId = "companion_weapon_riven_mod";
  else if (wt.includes("archgun")) modId = "archgun_riven_mod";

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
