"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getSavedBuilds, type SavedBuild } from "@/lib/builds/build-storage";
import { deleteYoursSavedBuild, mergeBuilderSavedBuilds } from "@/lib/builds/yours-builds";

/**
 * Saved builds for one builder (Saved builds tab + Load dialog). Round 55: builders used to read
 * only this device's localStorage, so account builds listed on /builds were missing here. Shows
 * device rows at once, then the full device + account merge (same source as /builds).
 */
export function useBuilderSavedBuilds(type: SavedBuild["type"]) {
  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>(() => getSavedBuilds(type));
  const requestRef = useRef(0);

  const refreshSavedBuilds = useCallback(async () => {
    const request = ++requestRef.current;
    setSavedBuilds(getSavedBuilds(type));
    const merged = await mergeBuilderSavedBuilds(type);
    if (request === requestRef.current) setSavedBuilds(merged);
  }, [type]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data-fetch effect: device rows show first, account rows merge in when the request returns
    void refreshSavedBuilds();
  }, [refreshSavedBuilds]);

  const deleteSavedBuild = useCallback(
    async (id: string) => {
      const ok = await deleteYoursSavedBuild(id);
      await refreshSavedBuilds();
      return ok;
    },
    [refreshSavedBuilds],
  );

  return { savedBuilds, refreshSavedBuilds, deleteSavedBuild };
}
