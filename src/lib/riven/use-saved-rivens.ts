"use client";

import { useEffect, useState } from "react";
import type { SavedRivenEntry } from "@/components/mod-picker";
import { getSavedRivens } from "@/lib/riven/saved-rivens";

/** Signed-in user's saved rivens for one weapon (empty when signed out). */
export function useSavedRivens(weaponId: string | undefined): SavedRivenEntry[] {
  const [state, setState] = useState<{ weaponId?: string; list: SavedRivenEntry[] }>({ list: [] });
  useEffect(() => {
    if (!weaponId) return;
    let alive = true;
    getSavedRivens(weaponId).then((list) => {
      if (alive) setState({ weaponId, list });
    });
    return () => {
      alive = false;
    };
  }, [weaponId]);
  return weaponId && state.weaponId === weaponId ? state.list : [];
}
