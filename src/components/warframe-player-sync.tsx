"use client";

import { useCallback, useState } from "react";
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
import { generateId, saveLoadout } from "@/lib/builds/loadouts";
import type { Loadout } from "@/lib/types";
import { toast } from "sonner";

const PLATFORMS: WarframePlatform[] = ["pc", "ps4", "xb1", "swi"];

type WarframePlayerSyncProps = {
  onImported?: (loadout: Loadout) => void;
  className?: string;
};

export function WarframePlayerSync({ onImported, className }: WarframePlayerSyncProps) {
  const [platform, setPlatform] = useState<WarframePlatform>("pc");
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ArsenalImportPayload | null>(null);

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
    } catch {
      setError("Could not reach Voidforge. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [account, platform]);

  const importLoadout = useCallback(() => {
    if (!result) return;
    const now = Date.now();
    const loadout: Loadout = {
      ...result.loadout,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    saveLoadout(loadout);
    toast.success(`Imported loadout for ${result.account.playerName}`);
    onImported?.(loadout);
  }, [onImported, result]);

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
          className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
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
                "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
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
            className="max-w-md"
            onKeyDown={(e) => {
              if (e.key === "Enter") void retrieve();
            }}
          />
        </div>

        <button
          type="button"
          onClick={() => void retrieve()}
          disabled={loading || !account.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Retrieve loadouts
        </button>

        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-400">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {result && (
        <ImportPreview result={result} onImport={importLoadout} />
      )}
    </div>
  );
}

function ImportPreview({
  result,
  onImport,
}: {
  result: ArsenalImportPayload;
  onImport: () => void;
}) {
  const slots = [
    result.loadout.warframeBuild?.warframeId && "Warframe",
    result.loadout.warframeBuild?.helminthAbilityId && "Helminth",
    result.loadout.modularBuild && `Modular (${result.loadout.modularBuild.slot})`,
    result.loadout.primaryBuild?.weaponId && "Primary",
    result.loadout.secondaryBuild?.weaponId && "Secondary",
    result.loadout.meleeBuild?.weaponId && "Melee",
    result.loadout.companionBuild?.companionId && "Companion",
    result.loadout.archwingBuild?.archwingId && "Archwing",
    result.loadout.archwingBuild?.necramechId && "Necramech",
  ].filter(Boolean) as string[];

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
        <p className="mt-2 text-sm">
          Ready to import: {slots.join(", ") || "No mapped slots"}
        </p>
      </div>

      {warnings.length > 0 && (
        <WarningList warnings={warnings} />
      )}

      <button
        type="button"
        onClick={onImport}
        disabled={slots.length === 0}
        className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
      >
        <Check className="h-4 w-4" />
        Import into Voidforge loadouts
      </button>
    </div>
  );
}

function WarningList({ warnings }: { warnings: ArsenalImportWarning[] }) {
  const preview = warnings.slice(0, 8);
  const extra = warnings.length - preview.length;
  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-200/90">
      <p className="font-medium text-amber-300">{warnings.length} item(s) could not be mapped automatically</p>
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
