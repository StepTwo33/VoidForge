"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { Edit2, Loader2, Plus, Sparkles, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { ContentPanel } from "@/components/page-shell";
import { PolarityIcon } from "@/components/polarity-icon";
import { useConfirmDialog } from "@/components/confirm-dialog-provider";
import { hasClientSession } from "@/lib/auth/client-session";
import Link from "next/link";
import {
  deleteSavedRiven as deleteCloudRiven,
  getSavedRivens as getCloudRivens,
  saveRiven as saveCloudRiven,
} from "@/lib/riven/saved-rivens";
import {
  getSavedRivens as getLocalSavedRivens,
  saveRiven as saveLocalStorageRiven,
  deleteRiven as deleteLocalStorageRiven,
  evaluateSavedRiven,
  type SavedRiven,
} from "@/lib/rivens/riven-storage";
import { RivenDialog } from "@/components/rivens/riven-dialog";
import { getRivenStatsForCategory, type Weapon } from "@/lib/types";
import { getRivenWeaponType, isZawWeapon, isKitgunWeapon } from "@/lib/weapons/riven-weapon-type";
import { getEffectiveRivenWeaponType } from "@/lib/weapons/riven-family";
import { useWeapons } from "@/lib/weapons/use-data";
import { cn } from "@/lib/utils";

/** Riven catalog id for a weapon (null when the builder has no riven for it). */
function rivenModIdFor(weapon: Weapon | Parameters<typeof getRivenWeaponType>[0] | undefined | null): string | null {
  if (!weapon) return null;
  if (isZawWeapon(weapon)) return "zaw_riven_mod";
  if (isKitgunWeapon(weapon)) return "kitgun_riven_mod";
  const cat = (weapon.category || "").toLowerCase();
  if (cat === "sentinel_weapon" || cat === "hound_weapon") return "companion_weapon_riven_mod";
  const type = getRivenWeaponType(weapon);
  return type ? `riven_${type.toLowerCase()}` : null;
}

export function formatRivenStatLine(key: string, value: number, category: string): string {
  const label = getRivenStatsForCategory(category).find((s) => s.key === key)?.label ?? key;
  if (key.startsWith("faction")) {
    return `${(1 + value).toFixed(2)}x ${label}`;
  }
  return `${value >= 0 ? "+" : ""}${(value * 100).toFixed(1)}% ${label}`;
}

/** /builds "Rivens" section: save riven rolls per weapon and reuse them in the mod picker. */
export function RivenLibrary() {
  const allWeapons = useWeapons();
  const { confirm } = useConfirmDialog();
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [rivens, setRivens] = useState<SavedRiven[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRiven, setEditingRiven] = useState<SavedRiven | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const weaponsById = useMemo(() => new Map(allWeapons.map((w) => [w.id, w])), [allWeapons]);

  const refreshRivens = useCallback(async () => {
    const local = getLocalSavedRivens();
    try {
      const ok = await hasClientSession();
      setSignedIn(ok);
      if (ok) {
        const cloud = await getCloudRivens();
        if (cloud.length > 0) {
          const map = new Map<string, SavedRiven>(local.map((r) => [r.id, r]));
          for (const c of cloud) {
            const w = allWeapons.find((x) => x.id === c.weaponId);
            const wType = w ? getEffectiveRivenWeaponType(w) ?? "Rifle" : "Rifle";
            const evalRes = evaluateSavedRiven(w?.name ?? c.weaponId, wType, c.stats, 8, 0, c.polarity);
            map.set(c.id, {
              id: c.id,
              name: c.name,
              weaponId: c.weaponId,
              weaponName: w?.name ?? c.weaponId,
              weaponCategory: w?.category ?? "primary",
              weaponType: wType,
              polarity: c.polarity,
              rank: 8,
              rerolls: 0,
              masteryRank: 12,
              stats: c.stats,
              displayStats: evalRes.displayStats,
              score: evalRes.score,
              grade: evalRes.grade,
              gradeColor: evalRes.color,
              createdAt: c.createdAt,
              updatedAt: c.updatedAt,
            });
          }
          setRivens(Array.from(map.values()));
          return;
        }
      }
    } catch {
      // Fallback to local
    }
    setRivens(local);
  }, [allWeapons]);

  useEffect(() => {
    refreshRivens();
  }, [refreshRivens]);

  // /builds#rivens: re-scroll once content settles
  useEffect(() => {
    if (typeof window === "undefined" || window.location.hash !== "#rivens") return;
    const t = window.setTimeout(() => document.getElementById("rivens")?.scrollIntoView({ block: "start" }), 600);
    return () => window.clearTimeout(t);
  }, []);

  const handleSaveRiven = async (saved: SavedRiven) => {
    saveLocalStorageRiven(saved);
    try {
      if (signedIn) {
        const weapon = weaponsById.get(saved.weaponId);
        const modId = rivenModIdFor(weapon);
        if (modId) {
          await saveCloudRiven({
            id: saved.id.startsWith("riven_") ? undefined : saved.id,
            weaponId: saved.weaponId,
            name: saved.name,
            modId,
            stats: saved.stats,
            polarity: saved.polarity,
            drain: 18,
          });
        }
      }
    } catch {
      // Local save succeeded
    }
    setDialogOpen(false);
    setEditingRiven(null);
    refreshRivens();
    toast.success(`Saved “${saved.name}”. It shows up in the weapon mod picker.`);
  };

  const handleDelete = async (riven: SavedRiven) => {
    const ok = await confirm({
      title: "Delete riven?",
      description: `“${riven.name}” will be removed from your saved rivens. Builds that already use it keep their stats.`,
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    setDeletingId(riven.id);
    deleteLocalStorageRiven(riven.id);
    try {
      if (signedIn) {
        await deleteCloudRiven(riven.id);
      }
    } catch {
      // Local delete succeeded
    }
    setDeletingId(null);
    refreshRivens();
    toast.success("Riven deleted");
  };

  return (
    <section id="rivens" className="mt-8 scroll-mt-20" aria-labelledby="rivens-heading" data-testid="riven-library">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 id="rivens-heading" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <Sparkles className="h-4 w-4 text-purple-700 dark:text-purple-400" />
            Rivens
          </h2>
          <p className="text-xs text-muted-foreground">Save your riven rolls once, then equip them from that weapon&apos;s mod picker.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/riven-library"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/5 px-3 py-1.5 text-xs font-medium text-purple-700 transition-colors hover:bg-purple-500/10 pointer-fine:min-h-9 dark:text-purple-300"
          >
            Open Card Grid & Details <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            onClick={() => {
              setEditingRiven(null);
              setDialogOpen(true);
            }}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-purple-500/40 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-800 transition-colors hover:bg-purple-500/20 pointer-fine:min-h-9 dark:text-purple-300"
          >
            <Plus className="h-4 w-4" /> New riven
          </button>
        </div>
      </div>

      {rivens.length === 0 ? (
        <ContentPanel className="text-sm text-muted-foreground">
          No saved rivens yet. Click &ldquo;New riven&rdquo; above to create or roll one.
        </ContentPanel>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2" data-testid="riven-library-list">
          {rivens.map((r) => {
            const weapon = weaponsById.get(r.weaponId);
            const category = weapon ? getRivenWeaponType(weapon)?.toLowerCase() ?? "rifle" : "rifle";
            return (
              <li key={r.id}>
                <ContentPanel className="flex h-full flex-col gap-2 !p-3">
                  <div className="flex items-start gap-2">
                    {r.polarity !== "universal" && <PolarityIcon polarity={r.polarity} className="mt-0.5 h-4 w-4" />}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-sm font-semibold">{r.name}</p>
                        {r.grade && (
                          <span
                            className="rounded px-1.5 py-0.2 text-[10px] font-bold uppercase tracking-wider"
                            style={{
                              backgroundColor: `${r.gradeColor}22`,
                              color: r.gradeColor,
                              border: `1px solid ${r.gradeColor}55`,
                            }}
                          >
                            {r.grade}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {r.weaponName || weapon?.name || r.weaponId} · MR {r.masteryRank} · {r.rerolls} rolls
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label={`Edit ${r.name}`}
                      onClick={() => {
                        setEditingRiven(r);
                        setDialogOpen(true);
                      }}
                      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground pointer-fine:min-h-9 pointer-fine:min-w-9"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${r.name}`}
                      disabled={deletingId === r.id}
                      onClick={() => handleDelete(r)}
                      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-red-700 hover:bg-red-500/10 pointer-fine:min-h-9 pointer-fine:min-w-9 dark:text-red-400"
                    >
                      {deletingId === r.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </button>
                  </div>
                  <ul className="space-y-0.5 text-xs">
                    {Object.entries(r.stats).map(([k, v]) => (
                      <li key={k} className={cn("text-purple-800 dark:text-purple-300", v < 0 && "text-red-700 dark:text-red-400")}>
                        {formatRivenStatLine(k, v, category)}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/weapon-builder?weapon=${encodeURIComponent(r.weaponId)}`}
                    className="mt-auto inline-flex min-h-11 items-center self-start text-xs text-primary hover:underline pointer-fine:min-h-0"
                  >
                    Open {r.weaponName || weapon?.name || "weapon"} in builder →
                  </Link>
                </ContentPanel>
              </li>
            );
          })}
        </ul>
      )}

      <RivenDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingRiven(null);
        }}
        onSave={handleSaveRiven}
        initialRiven={editingRiven}
      />
    </section>
  );
}
