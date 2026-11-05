"use client";

import { useCallback, useEffect, useState } from "react";
import type { SavedRivenEntry } from "@/components/mod-picker";
import { hasClientSession } from "@/lib/auth/client-session";
import { getSavedRivens } from "@/lib/riven/saved-rivens";

/**
 * Signed-in user's saved rivens for one weapon, plus whether they are signed in and a refresh
 * hook so "Save to library" in the mod picker shows the new riven straight away (Round 54b).
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
    let alive = true;
    getSavedRivens(weaponId).then((list) => {
      if (alive) setState({ weaponId, list });
    });
    return () => {
      alive = false;
    };
  }, [weaponId, version]);
  const refresh = useCallback(() => setVersion((v) => v + 1), []);
  return { list: weaponId && state.weaponId === weaponId ? state.list : [], signedIn, refresh };
}

/** Signed-in user's saved rivens for one weapon (empty when signed out). */
export function useSavedRivens(weaponId: string | undefined): SavedRivenEntry[] {
  return useSavedRivenLibrary(weaponId).list;
}
