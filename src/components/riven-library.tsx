"use client";

import { useEffect, useMemo, useState } from "react";
import { Edit2, Loader2, Plus, Search, Sparkles, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { ContentPanel } from "@/components/page-shell";
import { PolarityIcon } from "@/components/polarity-icon";
import { RivenEditor } from "@/components/riven-editor";
import { useConfirmDialog } from "@/components/confirm-dialog-provider";
import { hasClientSession } from "@/lib/auth/client-session";
import { DEFAULT_RIVEN_DRAIN, DEFAULT_RIVEN_POLARITY, clampRivenDrain, rivenPolarityError, rivenRankFromDrain, validateRivenStats } from "@/lib/riven/riven-validation";
import Link from "next/link";
import { RIVEN_MOD_IDS, SAVED_RIVEN_NAME_MAX, deleteSavedRiven, getSavedRivens, saveRiven, type SavedRiven } from "@/lib/riven/saved-rivens";
import { getRivenStatsForCategory } from "@/lib/types";
import { getRivenWeaponType } from "@/lib/weapons/riven-weapon-type";
import { useWeapons } from "@/lib/weapons/use-data";
import { cn } from "@/lib/utils";

type Draft = {
  id?: string;
  weaponId: string;
  name: string;
  stats: Record<string, number>;
  polarity: string;
  drain: number;
};

const EMPTY_DRAFT: Draft = { weaponId: "", name: "", stats: {}, polarity: DEFAULT_RIVEN_POLARITY, drain: DEFAULT_RIVEN_DRAIN };

/** Riven catalog id for a weapon (null when the builder has no riven for it, e.g. archguns). */
function rivenModIdFor(weapon: Parameters<typeof getRivenWeaponType>[0]): string | null {
  const type = getRivenWeaponType(weapon);
  const id = type ? `riven_${type.toLowerCase()}` : null;
  return id && (RIVEN_MOD_IDS as readonly string[]).includes(id) ? id : null;
}

export function formatRivenStatLine(key: string, value: number, category: string): string {
  const label = getRivenStatsForCategory(category).find((s) => s.key === key)?.label ?? key;
  return `${value >= 0 ? "+" : ""}${(value * 100).toFixed(1)}% ${label}`;
}

/** /builds "Rivens" section: save riven rolls per weapon and reuse them in the mod picker. */
export function RivenLibrary() {
  const allWeapons = useWeapons();
  const { confirm } = useConfirmDialog();
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [rivens, setRivens] = useState<SavedRiven[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [weaponQuery, setWeaponQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // /builds#rivens (header "Riven Library" link, picker "Manage library"): the build list above
  // loads async and pushes this section down, so re-scroll once it has settled (Round 54b).
  useEffect(() => {
    if (typeof window === "undefined" || window.location.hash !== "#rivens") return;
    const t = window.setTimeout(() => document.getElementById("rivens")?.scrollIntoView({ block: "start" }), 600);
    return () => window.clearTimeout(t);
  }, [signedIn]);

  useEffect(() => {
    let alive = true;
    hasClientSession().then(async (ok) => {
      if (!alive) return;
      setSignedIn(ok);
      if (ok) {
        const list = await getSavedRivens();
        if (alive) setRivens(list);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  const weaponsById = useMemo(() => new Map(allWeapons.map((w) => [w.id, w])), [allWeapons]);
  const rivenWeapons = useMemo(
    () => allWeapons.filter((w) => w.triggerType !== "Zaw Component" && rivenModIdFor(w) !== null),
    [allWeapons],
  );
  const weaponMatches = useMemo(() => {
    const q = weaponQuery.trim().toLowerCase();
    if (!q) return [];
    return rivenWeapons.filter((w) => w.name.toLowerCase().includes(q)).slice(0, 8);
  }, [rivenWeapons, weaponQuery]);

  const draftWeapon = draft?.weaponId ? weaponsById.get(draft.weaponId) : undefined;
  const draftCategory = draftWeapon ? getRivenWeaponType(draftWeapon)?.toLowerCase() ?? "rifle" : "rifle";
  const validation = draft ? validateRivenStats(draft.stats, draftCategory) : null;
  const canSave = !!draft && !!draftWeapon && !!draft.name.trim() && !!validation?.ok && !rivenPolarityError(draft?.polarity) && !saving;

  const handleSave = async () => {
    if (!draft || !draftWeapon || !canSave) return;
    const modId = rivenModIdFor(draftWeapon);
    if (!modId) return;
    setSaving(true);
    const saved = await saveRiven({
      ...(draft.id ? { id: draft.id } : {}),
      weaponId: draftWeapon.id,
      name: draft.name.trim(),
      modId,
      stats: draft.stats,
      polarity: draft.polarity,
      drain: draft.drain,
    });
    setSaving(false);
    if (!saved) {
      toast.error("Could not save riven");
      return;
    }
    setRivens((prev) => [saved, ...prev.filter((r) => r.id !== saved.id)]);
    setDraft(null);
    setWeaponQuery("");
    toast.success(`Saved “${saved.name}”. It shows up in the ${draftWeapon.name} mod picker.`);
  };

  const handleDelete = async (riven: SavedRiven) => {
    const ok = await confirm({
      title: "Delete riven?",
      description: `“${riven.name}” will be removed from your account. Builds that already use it keep their stats.`,
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    setDeletingId(riven.id);
    const done = await deleteSavedRiven(riven.id);
    setDeletingId(null);
    if (done) setRivens((prev) => prev.filter((r) => r.id !== riven.id));
    else toast.error("Could not delete riven");
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
            className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/5 px-3 py-1.5 text-xs font-medium text-purple-700 transition-colors hover:bg-purple-500/10 dark:text-purple-300 pointer-fine:min-h-9"
          >
            Open Card Grid & Thumbnails →
          </Link>
          {signedIn && !draft && (
            <button
              type="button"
              onClick={() => setDraft({ ...EMPTY_DRAFT })}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-purple-500/40 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-800 transition-colors hover:bg-purple-500/20 dark:text-purple-300 pointer-fine:min-h-9"
            >
              <Plus className="h-4 w-4" /> New riven
            </button>
          )}
        </div>
      </div>

      {signedIn === null && (
        <ContentPanel className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading rivens…
        </ContentPanel>
      )}
      {signedIn === false && (
        <ContentPanel className="text-sm text-muted-foreground">Sign in to save rivens to your account.</ContentPanel>
      )}

      {signedIn && draft && (
        <div data-testid="riven-library-form">
        <ContentPanel className="mb-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">{draft.id ? "Edit riven" : "New riven"}</h3>
            <button
              type="button"
              aria-label="Cancel"
              onClick={() => { setDraft(null); setWeaponQuery(""); }}
              className="inline-flex min-h-11 min-w-11 items-center justify-center text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {draftWeapon ? (
            <div className="flex min-h-11 items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/5 px-3">
              <span className="text-sm font-medium">{draftWeapon.name}</span>
              <span className="text-xs text-muted-foreground">{getRivenWeaponType(draftWeapon)} riven</span>
              {!draft.id && (
                <button
                  type="button"
                  onClick={() => setDraft({ ...draft, weaponId: "", stats: {} })}
                  className="ml-auto inline-flex min-h-11 items-center text-xs text-muted-foreground hover:text-foreground"
                >
                  Change
                </button>
              )}
            </div>
          ) : (
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  aria-label="Weapon"
                  placeholder="Search a weapon…"
                  value={weaponQuery}
                  onChange={(e) => setWeaponQuery(e.target.value)}
                  className="min-h-11 pl-9 text-base sm:text-sm"
                />
              </div>
              {weaponMatches.length > 0 && (
                <ul className="mt-1 max-h-64 overflow-y-auto rounded-lg border border-border bg-card p-1" role="listbox">
                  {weaponMatches.map((w) => (
                    <li key={w.id}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={false}
                        onClick={() => {
                          setDraft({ ...draft, weaponId: w.id, stats: {}, name: draft.name || `${w.name} riven` });
                          setWeaponQuery("");
                        }}
                        className="flex min-h-11 w-full items-center justify-between rounded-md px-3 text-left text-sm hover:bg-accent pointer-fine:min-h-9"
                      >
                        {w.name}
                        <span className="text-xs text-muted-foreground">{getRivenWeaponType(w)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {draftWeapon && (
            <>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-muted-foreground">Name</span>
                <Input
                  value={draft.name}
                  maxLength={SAVED_RIVEN_NAME_MAX}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="e.g. Crita-visican"
                  className="min-h-11 text-base sm:text-sm"
                />
              </label>
              <RivenEditor
                poolCategory={draftCategory}
                stats={draft.stats}
                onStatsChange={(stats) => setDraft({ ...draft, stats })}
                polarity={draft.polarity}
                onPolarityChange={(polarity) => setDraft({ ...draft, polarity })}
                drain={draft.drain}
                onDrainChange={(drain) => setDraft({ ...draft, drain })}
                showValidation
              />
              <button
                type="button"
                disabled={!canSave}
                onClick={handleSave}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 text-sm font-medium text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {draft.id ? "Save changes" : "Save riven"}
              </button>
            </>
          )}
        </ContentPanel>
        </div>
      )}

      {signedIn && rivens.length === 0 && !draft && (
        <ContentPanel className="text-sm text-muted-foreground">No saved rivens yet.</ContentPanel>
      )}

      {signedIn && rivens.length > 0 && (
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
                      <p className="truncate text-sm font-semibold">{r.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {weapon?.name ?? r.weaponId} · Rank {rivenRankFromDrain(r.drain)} · drain {clampRivenDrain(r.drain)}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label={`Edit ${r.name}`}
                      onClick={() => setDraft({ id: r.id, weaponId: r.weaponId, name: r.name, stats: r.stats, polarity: r.polarity, drain: r.drain })}
                      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground pointer-fine:min-h-9 pointer-fine:min-w-9"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${r.name}`}
                      disabled={deletingId === r.id}
                      onClick={() => handleDelete(r)}
                      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-red-700 hover:bg-red-500/10 dark:text-red-400 pointer-fine:min-h-9 pointer-fine:min-w-9"
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
                    Open {weapon?.name ?? "weapon"} in the builder
                  </Link>
                </ContentPanel>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
