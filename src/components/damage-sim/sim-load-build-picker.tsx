"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { SavedBuild } from "@/lib/builds/build-storage";
import { mergeYoursBuilds, ownershipBadge } from "@/lib/builds/yours-builds";
import {
  applyWeaponBuildToSim,
  type AppliedSimBuild,
  type SimWeaponBuildData,
} from "@/lib/calc/damage-sim-load";

type Tab = "yours" | "community";

interface CommunityHit {
  id: string;
  name: string;
  itemId: string;
  upvoteCount: number;
  author: { username: string };
}

export function SimLoadBuildPicker({
  onLoaded,
  loadedLabel,
  statusDamageBonus,
  factionBonuses,
  applyHeadshots,
  onApplyHeadshotsChange,
}: {
  onLoaded: (applied: AppliedSimBuild) => void;
  loadedLabel: string | null;
  statusDamageBonus: number;
  factionBonuses: Record<string, number>;
  applyHeadshots: boolean;
  onApplyHeadshotsChange: (v: boolean) => void;
}) {
  const [tab, setTab] = useState<Tab>("yours");
  const [query, setQuery] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [yoursBuilds, setYoursBuilds] = useState<SavedBuild[]>([]);
  const [community, setCommunity] = useState<CommunityHit[]>([]);
  const [loadingYours, setLoadingYours] = useState(true);
  const [loadingCommunity, setLoadingCommunity] = useState(false);
  const [loadingPick, setLoadingPick] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(query.trim()), 250);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingYours(true);
      const merged = await mergeYoursBuilds("weapon");
      if (cancelled) return;
      setYoursBuilds(merged);
      setLoadingYours(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (tab !== "community") return;
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setLoadingCommunity(true);
    setError(null);
    const params = new URLSearchParams({
      type: "weapon",
      sort: "recent",
      limit: "20",
    });
    if (debouncedQ) params.set("q", debouncedQ);
    fetch(`/api/builds/public?${params}`, { signal: ac.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Failed to load"))))
      .then((data: { builds?: CommunityHit[] }) => {
        setCommunity(data.builds ?? []);
        setLoadingCommunity(false);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setCommunity([]);
        setLoadingCommunity(false);
        setError("Couldn’t load community builds.");
      });
    return () => ac.abort();
  }, [tab, debouncedQ]);

  const filteredYours = useMemo(() => {
    if (!debouncedQ) return yoursBuilds;
    const q = debouncedQ.toLowerCase();
    return yoursBuilds.filter((b) => b.name.toLowerCase().includes(q));
  }, [yoursBuilds, debouncedQ]);

  const pickYours = useCallback(
    (build: SavedBuild) => {
      setError(null);
      const applied = applyWeaponBuildToSim(build.name, build.data as SimWeaponBuildData);
      if (!applied) {
        setError("That build couldn’t be loaded into the simulator.");
        return;
      }
      onLoaded(applied);
    },
    [onLoaded],
  );

  const pickCommunity = useCallback(
    async (hit: CommunityHit) => {
      setLoadingPick(hit.id);
      setError(null);
      try {
        const res = await fetch(`/api/builds/${hit.id}`);
        if (!res.ok) throw new Error("not found");
        const json = (await res.json()) as { name: string; data: SimWeaponBuildData };
        const applied = applyWeaponBuildToSim(json.name, json.data);
        if (!applied) {
          setError("That build couldn’t be loaded into the simulator.");
          return;
        }
        onLoaded(applied);
      } catch {
        setError("Couldn’t fetch that community build.");
      } finally {
        setLoadingPick(null);
      }
    },
    [onLoaded],
  );

  return (
    <div className="space-y-3">
      <div className="flex gap-1 rounded-lg border border-border/60 bg-muted/20 p-1">
        {(
          [
            { id: "yours" as const, label: "Yours" },
            { id: "community" as const, label: "Community" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "min-h-9 flex-1 rounded-md px-3 text-xs font-medium transition-colors",
              tab === t.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={tab === "yours" ? "Search yours…" : "Search community weapon builds…"}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-h-11 pl-9"
        />
      </div>

      <div className="max-h-[min(40vh,14rem)] overflow-y-auto rounded-lg border border-border/60 bg-background/40">
        {tab === "yours" && (
          <>
            {loadingYours ? (
              <div className="flex items-center justify-center gap-2 p-6 text-xs text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading…
              </div>
            ) : filteredYours.length === 0 ? (
              <p className="p-4 text-center text-xs text-muted-foreground">
                {yoursBuilds.length === 0
                  ? "No weapon builds in Yours. Save one in the Weapon Builder, or try Community."
                  : "No builds match your search."}
              </p>
            ) : (
              <ul className="divide-y divide-border/40 p-1">
                {filteredYours.map((b) => (
                  <li key={b.id}>
                    <button
                      type="button"
                      onClick={() => pickYours(b)}
                      className="flex w-full min-h-11 items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-xs transition-colors hover:bg-amber-500/5"
                    >
                      <span className="min-w-0 truncate font-medium">{b.name}</span>
                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        {ownershipBadge(b.id)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {tab === "community" && (
          <>
            {loadingCommunity ? (
              <div className="flex items-center justify-center gap-2 p-6 text-xs text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Searching…
              </div>
            ) : community.length === 0 ? (
              <p className="p-4 text-center text-xs text-muted-foreground">
                {debouncedQ ? "No community weapon builds match." : "No community weapon builds yet."}
              </p>
            ) : (
              <ul className="divide-y divide-border/40 p-1">
                {community.map((b) => (
                  <li key={b.id}>
                    <button
                      type="button"
                      disabled={loadingPick === b.id}
                      onClick={() => void pickCommunity(b)}
                      className="flex w-full min-h-11 items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-xs transition-colors hover:bg-amber-500/5 disabled:opacity-60"
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{b.name}</span>
                        <span className="text-[10px] text-muted-foreground">
                          @{b.author.username}
                          {b.upvoteCount > 0 ? ` · ${b.upvoteCount}↑` : ""}
                        </span>
                      </span>
                      {loadingPick === b.id && <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      {error && <p className="text-xs text-red-700 dark:text-red-400">{error}</p>}

      {loadedLabel && (
        <p className="rounded-md border border-cyan-500/25 bg-cyan-500/5 px-2.5 py-1.5 text-[11px] text-cyan-800 dark:text-cyan-300">
          Loaded: {loadedLabel}
          {(statusDamageBonus > 0 || Object.keys(factionBonuses).length > 0) && (
            <span className="text-muted-foreground">
              {" "}
              · status dmg +{(statusDamageBonus * 100).toFixed(0)}%
              {Object.keys(factionBonuses).length > 0 && " · faction mods active"}
            </span>
          )}
        </p>
      )}

      <label className="flex min-h-11 cursor-pointer items-center gap-2 text-xs text-muted-foreground">
        <input
          type="checkbox"
          checked={applyHeadshots}
          onChange={(e) => onApplyHeadshotsChange(e.target.checked)}
          className="h-4 w-4 rounded border-border accent-primary"
        />
        Headshots (2× × Acuity bonuses from build)
      </label>
    </div>
  );
}
