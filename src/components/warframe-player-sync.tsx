"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, Check, ExternalLink, Loader2, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  WARFRAME_ACCOUNT_SETTINGS_URL,
  WARFRAME_PLATFORM_LABELS,
  type WarframePlatform,
} from "@/lib/warframe-arsenal/platforms";
import type { ArsenalImportPayload, ArsenalImportWarning } from "@/lib/warframe-arsenal/map-import";
import { applyImportToLoadout, findImportedLoadouts, generateId, saveLoadout } from "@/lib/builds/loadouts";
import { getSlotLabelName, type LoadoutSlotType } from "@/lib/builds/loadout-slot-helpers";
import { useWeapons } from "@/lib/weapons/use-data";
import { allHelminthAbilities } from "@/data/helminth";
import { archwings, necramechs } from "@/data/archwing";
import type { Loadout } from "@/lib/types";
import { toast } from "sonner";

const PLATFORMS: WarframePlatform[] = ["pc", "ps4", "xb1", "swi"];

/** Last Player Sync platform + account (this device only). */
export const PLAYER_SYNC_PREFS_KEY = "voidforge_player_sync";

function readPrefs(): { platform?: WarframePlatform; account?: string } {
  try {
    const raw = localStorage.getItem(PLAYER_SYNC_PREFS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as { platform?: string; account?: string };
    return {
      platform: PLATFORMS.includes(parsed.platform as WarframePlatform) ? (parsed.platform as WarframePlatform) : undefined,
      account: typeof parsed.account === "string" ? parsed.account : undefined,
    };
  } catch {
    return {};
  }
}

function writePrefs(platform: WarframePlatform, account: string) {
  try {
    localStorage.setItem(PLAYER_SYNC_PREFS_KEY, JSON.stringify({ platform, account }));
  } catch {
    /* storage full / disabled */
  }
}

/** Default name for an import: "<player> — Imported <date>". */
export function importedLoadoutName(playerName: string, date = new Date()): string {
  const day = date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  return `${playerName} — Imported ${day}`;
}

type WarframePlayerSyncProps = {
  onImported?: (loadout: Loadout, info: { updated: boolean }) => void;
  className?: string;
};

export function WarframePlayerSync({ onImported, className }: WarframePlayerSyncProps) {
  const [platform, setPlatform] = useState<WarframePlatform>("pc");
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ArsenalImportPayload | null>(null);
  const [retrievedFor, setRetrievedFor] = useState<{ platform: WarframePlatform; account: string } | null>(null);

  useEffect(() => {
    const prefs = readPrefs();
    queueMicrotask(() => {
      if (prefs.platform) setPlatform(prefs.platform);
      if (prefs.account) setAccount(prefs.account);
    });
  }, []);

  const previousImport = useMemo(() => {
    if (!result || !retrievedFor) return null;
    const matches = findImportedLoadouts(retrievedFor.platform, retrievedFor.account);
    if (matches.length === 0) return null;
    return matches.reduce((a, b) => (b.updatedAt > a.updatedAt ? b : a));
  }, [result, retrievedFor]);

  const retrieve = useCallback(async () => {
    const trimmed = account.trim();
    if (!trimmed) {
      setError("Enter your in-game account name.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const params = new URLSearchParams({ platform, account: trimmed });
      const res = await fetch(`/api/warframe/arsenal?${params.toString()}`);
      const raw = await res.text();
      let data: { error?: string } & Partial<ArsenalImportPayload> = {};
      if (raw) {
        try {
          data = JSON.parse(raw) as typeof data;
        } catch {
          setError(
            res.ok
              ? "Voidforge returned an invalid response. Try again in a moment."
              : `Voidforge request failed (${res.status}). Try again in a moment.`,
          );
          return;
        }
      }
      if (!res.ok) {
        setError(data.error || `Failed to retrieve loadout (${res.status}).`);
        return;
      }
      setResult(data as ArsenalImportPayload);
      setRetrievedFor({ platform, account: trimmed });
      writePrefs(platform, trimmed);
    } catch {
      setError("Could not reach Voidforge. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [account, platform]);

  const importLoadout = useCallback(
    (mode: "new" | "update") => {
      if (!result) return;
      const now = Date.now();
      const imported: Omit<Loadout, "id" | "createdAt" | "updatedAt"> = {
        ...result.loadout,
        name: importedLoadoutName(result.account.playerName),
        ...(result.warnings.length > 0 ? { importWarnings: result.warnings.map((w) => w.label) } : {}),
        ...(retrievedFor ? { importSource: { platform: retrievedFor.platform, account: retrievedFor.account } } : {}),
      };
      if (mode === "update" && previousImport) {
        const updated = applyImportToLoadout(previousImport, imported);
        saveLoadout(updated);
        toast.success(`Updated “${updated.name}”`, { description: `Re-imported from ${result.account.playerName}.` });
        onImported?.(updated, { updated: true });
        return;
      }
      const loadout: Loadout = { ...imported, id: generateId(), createdAt: now, updatedAt: now };
      saveLoadout(loadout);
      toast.success(`Imported loadout for ${result.account.playerName}`);
      onImported?.(loadout, { updated: false });
    },
    [onImported, previousImport, result, retrievedFor],
  );

  return (
    <div className={cn("space-y-5", className)}>
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-[10px] font-semibold tracking-wider text-muted-foreground">ACCOUNT SETTINGS</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          To use Player Sync, enable{" "}
          <strong className="text-foreground">Share Loadout Information with the Warframe Arsenal Twitch Extension</strong>{" "}
          in your Warframe account settings.
        </p>
        <Link
          href={WARFRAME_ACCOUNT_SETTINGS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm text-primary hover:underline"
        >
          Open Warframe account settings
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPlatform(p)}
              className={cn(
                "min-h-11 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                platform === p
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {WARFRAME_PLATFORM_LABELS[p]}
            </button>
          ))}
        </div>

        <div>
          <label className="mb-1.5 block text-xs text-muted-foreground">In-game account name</label>
          <Input
            value={account}
            onChange={(e) => {
              setAccount(e.target.value);
              setError(null);
            }}
            placeholder="Your Warframe display name"
            className="max-w-md min-h-11 w-full text-base sm:text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") void retrieve();
            }}
          />
        </div>

        <button
          type="button"
          onClick={() => void retrieve()}
          disabled={loading || !account.trim()}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 sm:w-auto"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Retrieve loadouts
        </button>

        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-700 dark:text-red-400">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {result && (
        <ImportPreview result={result} previousImport={previousImport} onImport={importLoadout} />
      )}
    </div>
  );
}

const PREVIEW_SLOTS: { slot: LoadoutSlotType; label: string }[] = [
  { slot: "warframe", label: "Warframe" },
  { slot: "primary", label: "Primary" },
  { slot: "secondary", label: "Secondary" },
  { slot: "melee", label: "Melee" },
  { slot: "companion", label: "Companion" },
];

function ImportPreview({
  result,
  previousImport,
  onImport,
}: {
  result: ArsenalImportPayload;
  previousImport: Loadout | null;
  onImport: (mode: "new" | "update") => void;
}) {
  const weapons = useWeapons();
  const weaponsMap = useMemo(() => new Map(weapons.map((w) => [w.id, w])), [weapons]);
  const items = useMemo(() => {
    const l = { ...result.loadout, id: "preview", createdAt: 0, updatedAt: 0 } as Loadout;
    const out: { label: string; name: string }[] = [];
    for (const { slot, label } of PREVIEW_SLOTS) {
      const name = getSlotLabelName(l, slot, weaponsMap);
      if (name) out.push({ label, name });
      if (slot === "warframe" && l.warframeBuild?.helminthAbilityId) {
        const id = l.warframeBuild.helminthAbilityId;
        out.push({ label: "Helminth", name: allHelminthAbilities.find((a) => a.id === id)?.name ?? id });
      }
    }
    const aw = l.archwingBuild;
    if (aw?.archwingId) out.push({ label: "Archwing", name: archwings.find((a) => a.id === aw.archwingId)?.name ?? aw.archwingId });
    if (aw?.necramechId) out.push({ label: "Necramech", name: necramechs.find((n) => n.id === aw.necramechId)?.name ?? aw.necramechId });
    return out;
  }, [result.loadout, weaponsMap]);

  const warnings = result.warnings;

  return (
    <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-5 space-y-4">
      <div>
        <h3 className="text-sm font-semibold">{result.account.playerName}</h3>
        <p className="text-xs text-muted-foreground">
          MR {result.account.masteryRank}
          {result.account.focusSchool ? ` · ${result.account.focusSchool}` : ""}
          {" · "}Updated {new Date(result.account.lastUpdated).toLocaleString()}
        </p>
        {items.length > 0 ? (
          <>
            <p className="mt-2 text-sm">Ready to import:</p>
            <ul className="mt-1 grid gap-x-4 gap-y-0.5 text-sm sm:grid-cols-2" data-testid="import-preview-items">
              {items.map((it) => (
                <li key={it.label} className="flex min-w-0 gap-1.5">
                  <span className="shrink-0 text-muted-foreground">{it.label}:</span>
                  <span className="truncate font-medium">{it.name}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="mt-2 text-sm">Ready to import: No mapped slots</p>
        )}
      </div>

      {warnings.length > 0 && (
        <WarningList warnings={warnings} />
      )}

      {previousImport ? (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            You imported this account before as <span className="font-medium text-foreground">“{previousImport.name}”</span>.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => onImport("update")}
              disabled={items.length === 0}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-50 sm:w-auto"
            >
              <RefreshCw className="h-4 w-4" />
              Update existing loadout
            </button>
            <button
              type="button"
              onClick={() => onImport("new")}
              disabled={items.length === 0}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50 sm:w-auto"
            >
              <Check className="h-4 w-4" />
              Import as new
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => onImport("new")}
          disabled={items.length === 0}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-50 sm:w-auto"
        >
          <Check className="h-4 w-4" />
          Import into Voidforge loadouts
        </button>
      )}
    </div>
  );
}

function WarningList({ warnings }: { warnings: ArsenalImportWarning[] }) {
  const preview = warnings.slice(0, 8);
  const extra = warnings.length - preview.length;
  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-900 dark:text-amber-200/90">
      <p className="font-medium text-amber-900 dark:text-amber-200">{warnings.length} item(s) could not be mapped automatically</p>
      <ul className="mt-2 list-inside list-disc space-y-0.5">
        {preview.map((w, i) => (
          <li key={`${w.kind}-${w.label}-${i}`}>
            {w.kind}: {w.label}
          </li>
        ))}
        {extra > 0 && <li>…and {extra} more</li>}
      </ul>
    </div>
  );
}
