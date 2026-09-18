"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Library } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PageShell, ContentPanel, PanelHeading } from "@/components/page-shell";
import {
  CODEX_SECTIONS,
  CODEX_MOD_CATEGORIES,
  CODEX_ARCANE_SLOTS,
  CODEX_CATEGORY_SECTIONS,
  parseCodexSection,
  type CodexSection,
} from "@/lib/codex/codex-sections";
import {
  CODEX_WEAPON_CATEGORY_FILTERS,
  CODEX_COMPANION_TYPE_FILTERS,
  CODEX_HIDDEN_WEAPON_CATEGORIES,
  filterCodexWeapons,
  matchesCodexSearch,
} from "@/lib/codex/codex-catalog";
import { weaponHasRadialAttacks } from "@/lib/weapons/weapon-radial-utils";
import {
  isCodexListedMod,
  matchesModBrowserCategory,
  type ModBrowserCategoryId,
} from "@/lib/mods/mod-browser-categories";
import {
  getArcaneCoverageInfo,
  getArcaneSlotCategory,
  ARCANE_TRIGGER_FILTERS,
} from "@/lib/codex/arcane-browser-meta";
import { getArcaneDisplayInfo } from "@/lib/display/arcane-display";
import { getExaltedWeaponsForWarframe } from "@/lib/weapons/exalted-weapons";
import {
  useMods,
  useArcanes,
  useArchonShards,
  useArcaneEffects,
  useWeapons,
  useWarframes,
  useCompanions,
  useArchwings,
  useNecramechs,
} from "@/lib/weapons/use-data";
import { Mod } from "@/lib/types";
import {
  CodexWeaponRow,
  CodexWarframeRow,
  CodexCompanionRow,
  CodexArchwingRow,
  CodexNecramechRow,
  WeaponDetailPanel,
  WarframeDetailPanel,
  CompanionDetailPanel,
  ArchwingDetailPanel,
  NecramechDetailPanel,
} from "@/components/codex-entity-panels";
import {
  CodexDetailCard,
  CodexModRow,
  CodexArcaneRow,
  CodexShardRow,
  ModDetailPanel,
  ArcaneDetailPanel,
  ShardDetailPanel,
} from "@/components/codex-item-panels";
import { cn } from "@/lib/utils";
import { accentTone } from "@/lib/display/accent-tones";

const POLARITIES = ["All", "madurai", "vazarin", "naramon", "zenurik", "unairu", "penjaga", "umbra"] as const;
const RARITIES = ["All", "Common", "Uncommon", "Rare", "Legendary"] as const;

function CodexPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const section = parseCodexSection(searchParams.get("section"));
  const categoryParam = searchParams.get("category") || "all";
  const modCategory = (section === "mods" ? categoryParam : "all") as ModBrowserCategoryId;
  const weaponCategory = section === "weapons" ? categoryParam : "all";
  const companionType = section === "companions" ? categoryParam : "all";
  const arcaneSlot = searchParams.get("slot") || "all";
  const weaponAoeOnly = searchParams.get("aoe") === "1";
  const selectedId = searchParams.get("id");

  const { mods } = useMods();
  const arcanes = useArcanes();
  const shards = useArchonShards();
  const arcaneEffects = useArcaneEffects();
  const weapons = useWeapons();
  const warframes = useWarframes();
  const companions = useCompanions();
  const archwings = useArchwings();
  const necramechs = useNecramechs();

  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("q") ?? "");
  const [polarityFilter, setPolarityFilter] = useState<(typeof POLARITIES)[number]>("All");
  const [rarityFilter, setRarityFilter] = useState<(typeof RARITIES)[number]>("All");
  const [arcaneTrigger, setArcaneTrigger] = useState<string>("all");
  const [previewRank, setPreviewRank] = useState<number | null>(null);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) setSearchQuery(q);
  }, [searchParams]);

  const setParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") params.delete(key);
        else params.set(key, value);
      }
      router.replace(`/codex?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const codexReturnTo = useMemo(() => {
    const q = searchParams.toString();
    return q ? `/codex?${q}` : "/codex";
  }, [searchParams]);

  const selectSection = (s: CodexSection) => {
    setSearchQuery("");
    setParams({
      section: s,
      category: CODEX_CATEGORY_SECTIONS.has(s) ? "all" : null,
      slot: s === "arcanes" ? "all" : null,
      aoe: s === "weapons" ? null : null,
      id: null,
    });
  };

  const filteredMods = useMemo(() => {
    let list = mods.filter(isCodexListedMod);
    const hasSearch = searchQuery.trim().length > 0;
    // When searching, scan all mods — don't hide augments because Aura tab is selected.
    if (!hasSearch && modCategory !== "all") {
      list = list.filter((m) => matchesModBrowserCategory(m, modCategory));
    }
    if (polarityFilter !== "All") {
      list = list.filter((m) => m.polarity === polarityFilter);
    }
    if (rarityFilter !== "All") {
      list = list.filter((m) => m.rarity.toLowerCase() === rarityFilter.toLowerCase());
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q),
      );
    }
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [mods, modCategory, polarityFilter, rarityFilter, searchQuery]);

  const arcaneCoverageById = useMemo(() => {
    const map = new Map<string, ReturnType<typeof getArcaneCoverageInfo>>();
    for (const arcane of arcanes) {
      map.set(arcane.id, getArcaneCoverageInfo(arcane, arcaneEffects));
    }
    return map;
  }, [arcanes, arcaneEffects]);

  const filteredArcanes = useMemo(() => {
    let list = [...arcanes];
    if (arcaneSlot !== "all") {
      list = list.filter((a) => getArcaneSlotCategory(a) === arcaneSlot);
    }
    if (arcaneTrigger !== "all") {
      list = list.filter((a) => arcaneEffects[a.id]?.trigger === arcaneTrigger);
    }
    if (rarityFilter !== "All") {
      list = list.filter((a) => a.rarity.toLowerCase() === rarityFilter.toLowerCase());
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q),
      );
    }
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [arcanes, arcaneSlot, arcaneTrigger, rarityFilter, searchQuery, arcaneEffects]);

  const filteredShards = useMemo(() => {
    let list = [...shards];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q),
      );
    }
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [shards, searchQuery]);

  const filteredWeapons = useMemo(
    () => filterCodexWeapons(weapons, weaponCategory, searchQuery, { aoeOnly: weaponAoeOnly }),
    [weapons, weaponCategory, searchQuery, weaponAoeOnly],
  );

  const weaponAoeCount = useMemo(
    () => weapons.filter((w) => !CODEX_HIDDEN_WEAPON_CATEGORIES.has(w.category) && weaponHasRadialAttacks(w)).length,
    [weapons],
  );

  const filteredWarframes = useMemo(() => {
    let list = [...warframes];
    if (searchQuery.trim()) {
      list = list.filter((w) =>
        matchesCodexSearch(searchQuery, [w.name, w.id, w.description, w.passive]),
      );
    }
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [warframes, searchQuery]);

  const filteredCompanions = useMemo(() => {
    let list = [...companions];
    if (companionType !== "all") {
      list = list.filter((c) => c.type === companionType);
    }
    if (searchQuery.trim()) {
      list = list.filter((c) =>
        matchesCodexSearch(searchQuery, [c.name, c.id, c.description, c.precept, c.type]),
      );
    }
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [companions, companionType, searchQuery]);

  const filteredArchwings = useMemo(() => {
    let list = [...archwings];
    if (searchQuery.trim()) {
      list = list.filter((a) =>
        matchesCodexSearch(searchQuery, [a.name, a.id, a.description]),
      );
    }
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [archwings, searchQuery]);

  const filteredNecramechs = useMemo(() => {
    let list = [...necramechs];
    if (searchQuery.trim()) {
      list = list.filter((n) =>
        matchesCodexSearch(searchQuery, [n.name, n.id, n.description]),
      );
    }
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [necramechs, searchQuery]);

  const selectedMod = section === "mods" && selectedId ? mods.find((m) => m.id === selectedId) : null;
  const selectedArcane =
    section === "arcanes" && selectedId ? arcanes.find((a) => a.id === selectedId) : null;
  const selectedShard =
    section === "shards" && selectedId ? shards.find((s) => s.id === selectedId) : null;
  const selectedWeapon =
    section === "weapons" && selectedId ? weapons.find((w) => w.id === selectedId) : null;
  const selectedWarframe =
    section === "warframes" && selectedId ? warframes.find((w) => w.id === selectedId) : null;
  const selectedWarframeExalted = useMemo(
    () => (selectedWarframe ? getExaltedWeaponsForWarframe(selectedWarframe.id, weapons) : []),
    [selectedWarframe, weapons],
  );
  const selectedCompanion =
    section === "companions" && selectedId ? companions.find((c) => c.id === selectedId) : null;
  const selectedArchwing =
    section === "archwings" && selectedId ? archwings.find((a) => a.id === selectedId) : null;
  const selectedNecramech =
    section === "necramechs" && selectedId ? necramechs.find((n) => n.id === selectedId) : null;

  const arcaneRank =
    selectedArcane && previewRank !== null
      ? previewRank
      : selectedArcane?.maxRank ?? 0;

  const arcaneDisplay =
    selectedArcane && selectedArcane
      ? getArcaneDisplayInfo(selectedArcane, arcaneRank, { totalArmor: 750, persistenceActive: true }, arcaneEffects)
      : null;

  const listCount =
    section === "mods"
      ? filteredMods.length
      : section === "arcanes"
        ? filteredArcanes.length
        : section === "shards"
          ? filteredShards.length
          : section === "weapons"
            ? filteredWeapons.length
            : section === "warframes"
              ? filteredWarframes.length
              : section === "companions"
                ? filteredCompanions.length
                : section === "archwings"
                  ? filteredArchwings.length
                  : filteredNecramechs.length;

  const hasSelection = Boolean(
    selectedMod ||
    selectedArcane ||
    selectedShard ||
    selectedWeapon ||
    selectedWarframe ||
    selectedCompanion ||
    selectedArchwing ||
    selectedNecramech,
  );

  return (
    <div
      className={cn(
        "mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1600px] flex-col px-4 py-4 sm:px-6",
        hasSelection && "pb-[min(88dvh,40rem)] sm:pb-[min(75vh,32rem)]",
      )}
    >
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-amber-500/10 p-2 text-amber-800 dark:text-amber-400">
            <Library className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Codex</h1>
            <p className="text-xs text-muted-foreground">Browse and verify game data across the full database</p>
          </div>
        </div>
        <div className="relative ml-auto min-w-0 w-full flex-1 sm:min-w-[200px] sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search codex..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-border/60 bg-background/50 pl-9"
          />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
        {/* Left sidebar — sections + subcategories */}
        <aside className={cn("flex shrink-0 flex-col gap-3 lg:sticky lg:top-[calc(3.5rem+env(safe-area-inset-top,0px)+0.75rem)] lg:w-52 lg:max-h-[calc(100dvh-3.5rem-env(safe-area-inset-top,0px)-1.5rem)] lg:self-start lg:overflow-y-auto lg:overscroll-contain lg:pb-4", hasSelection && "hidden lg:flex")}>
          <ContentPanel className="shrink-0 overflow-visible p-2">
            <PanelHeading>Sections</PanelHeading>
            <nav className="mt-2 space-y-0.5">
              {CODEX_SECTIONS.map((s) => {
                const Icon = s.icon;
                const active = section === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => selectSection(s.id)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors",
                      active
                        ? accentTone.amber.chipActive
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {s.label}
                  </button>
                );
              })}
            </nav>
          </ContentPanel>

          {section === "mods" && (
            <ContentPanel className="shrink-0 overflow-visible p-2">
              <PanelHeading>Mod type</PanelHeading>
              <nav className="mt-2 max-h-[40vh] space-y-0.5 overflow-y-auto overscroll-contain lg:max-h-none lg:overflow-visible">
                {CODEX_MOD_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setParams({ category: cat.id, id: null })}
                    className={cn(
                      "block w-full rounded-md px-2.5 py-2.5 text-left text-xs transition-colors sm:py-1.5",
                      modCategory === cat.id
                        ? accentTone.indigo.chipActive
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </nav>
            </ContentPanel>
          )}

          {section === "weapons" && (
            <ContentPanel className="shrink-0 overflow-visible p-2">
              <PanelHeading>Weapon type</PanelHeading>
              <nav className="mt-2 max-h-[40vh] space-y-0.5 overflow-y-auto overscroll-contain lg:max-h-none lg:overflow-visible">
                {CODEX_WEAPON_CATEGORY_FILTERS.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setParams({ category: cat.id, id: null })}
                    className={cn(
                      "block w-full rounded-md px-2.5 py-2.5 text-left text-xs transition-colors sm:py-1.5",
                      weaponCategory === cat.id
                        ? accentTone.blue.chipActive
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </nav>
              <div className="mt-3 border-t border-border pt-2">
                <PanelHeading>AoE filter</PanelHeading>
                <nav className="mt-2 space-y-0.5">
                  <button
                    type="button"
                    onClick={() => setParams({ aoe: null, id: null })}
                    className={cn(
                      "block w-full rounded-md px-2.5 py-2.5 text-left text-xs transition-colors sm:py-1.5",
                      !weaponAoeOnly
                        ? accentTone.blue.chipActive
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                    )}
                  >
                    All weapons
                  </button>
                  <button
                    type="button"
                    onClick={() => setParams({ aoe: "1", id: null })}
                    className={cn(
                      "block w-full rounded-md px-2.5 py-2.5 text-left text-xs transition-colors sm:py-1.5",
                      weaponAoeOnly
                        ? accentTone.orange.chipActive
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                    )}
                  >
                    Has radial / AoE ({weaponAoeCount})
                  </button>
                </nav>
              </div>
            </ContentPanel>
          )}

          {section === "companions" && (
            <ContentPanel className="shrink-0 overflow-visible p-2">
              <PanelHeading>Companion type</PanelHeading>
              <nav className="mt-2 space-y-0.5">
                {CODEX_COMPANION_TYPE_FILTERS.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setParams({ category: cat.id, id: null })}
                    className={cn(
                      "block w-full rounded-md px-2.5 py-2.5 text-left text-xs transition-colors sm:py-1.5",
                      companionType === cat.id
                        ? accentTone.orange.chipActive
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </nav>
            </ContentPanel>
          )}

          {section === "arcanes" && (
            <ContentPanel className="shrink-0 overflow-visible p-2">
              <PanelHeading>Slot</PanelHeading>
              <nav className="mt-2 space-y-0.5">
                <button
                  type="button"
                  onClick={() => setParams({ slot: "all", id: null })}
                  className={cn(
                    "block w-full rounded-md px-2.5 py-2.5 text-left text-xs transition-colors sm:py-1.5",
                    arcaneSlot === "all"
                      ? accentTone.purple.chipActive
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                >
                  All
                </button>
                {CODEX_ARCANE_SLOTS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setParams({ slot: f.id, id: null })}
                    className={cn(
                      "block w-full rounded-md px-2.5 py-2.5 text-left text-xs transition-colors sm:py-1.5",
                      arcaneSlot === f.id
                        ? accentTone.purple.chipActive
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </nav>
            </ContentPanel>
          )}
        </aside>

        {/* Entry list — page scrolls; detail card floats in viewport */}
        <ContentPanel padding={false} className="min-w-0 flex-1">
          <div className="border-b border-border px-3 py-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">
                <span className="font-mono font-medium text-foreground">{listCount}</span> entries
              </span>
              {section === "mods" && (
                <>
                  {POLARITIES.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPolarityFilter(p)}
                      className={cn(
                        "rounded px-2 py-0.5 text-[10px] capitalize transition-colors",
                        polarityFilter === p
                          ? accentTone.indigo.chipStrong
                          : "text-muted-foreground hover:bg-muted/50",
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </>
              )}
              {section === "arcanes" && (
                <select
                  value={arcaneTrigger}
                  onChange={(e) => setArcaneTrigger(e.target.value)}
                  className="rounded border border-border bg-background px-2 py-0.5 text-[10px]"
                >
                  {ARCANE_TRIGGER_FILTERS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
              )}
              {(section === "mods" || section === "arcanes") && (
                <select
                  value={rarityFilter}
                  onChange={(e) => setRarityFilter(e.target.value as (typeof RARITIES)[number])}
                  className="ml-auto rounded border border-border bg-background px-2 py-0.5 text-[10px]"
                >
                  {RARITIES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {section === "mods" &&
              filteredMods.map((mod) => (
                <CodexModRow
                  key={mod.id}
                  mod={mod}
                  selected={selectedId === mod.id}
                  onSelect={() => {
                    setPreviewRank(null);
                    setParams({ id: mod.id });
                  }}
                />
              ))}
            {section === "arcanes" &&
              filteredArcanes.map((arcane) => {
                const coverage = arcaneCoverageById.get(arcane.id);
                return (
                  <CodexArcaneRow
                    key={arcane.id}
                    arcane={arcane}
                    selected={selectedId === arcane.id}
                    hasIssues={(coverage?.issues.length ?? 0) > 0}
                    onSelect={() => {
                      setPreviewRank(arcane.maxRank);
                      setParams({ id: arcane.id });
                    }}
                  />
                );
              })}
            {section === "shards" &&
              filteredShards.map((shard) => (
                <CodexShardRow
                  key={shard.id}
                  shard={shard}
                  selected={selectedId === shard.id}
                  onSelect={() => setParams({ id: shard.id })}
                />
              ))}
            {section === "weapons" &&
              filteredWeapons.map((weapon) => (
                <CodexWeaponRow
                  key={weapon.id}
                  weapon={weapon}
                  selected={selectedId === weapon.id}
                  onSelect={() => setParams({ id: weapon.id })}
                />
              ))}
            {section === "warframes" &&
              filteredWarframes.map((warframe) => (
                <CodexWarframeRow
                  key={warframe.id}
                  warframe={warframe}
                  selected={selectedId === warframe.id}
                  onSelect={() => setParams({ id: warframe.id })}
                />
              ))}
            {section === "companions" &&
              filteredCompanions.map((companion) => (
                <CodexCompanionRow
                  key={companion.id}
                  companion={companion}
                  selected={selectedId === companion.id}
                  onSelect={() => setParams({ id: companion.id })}
                />
              ))}
            {section === "archwings" &&
              filteredArchwings.map((archwing) => (
                <CodexArchwingRow
                  key={archwing.id}
                  archwing={archwing}
                  selected={selectedId === archwing.id}
                  onSelect={() => setParams({ id: archwing.id })}
                />
              ))}
            {section === "necramechs" &&
              filteredNecramechs.map((necramech) => (
                <CodexNecramechRow
                  key={necramech.id}
                  necramech={necramech}
                  selected={selectedId === necramech.id}
                  onSelect={() => setParams({ id: necramech.id })}
                />
              ))}
          </div>
        </ContentPanel>
      </div>

      {(selectedMod || selectedArcane || selectedShard || selectedWeapon || selectedWarframe || selectedCompanion || selectedArchwing || selectedNecramech) && (
        <CodexDetailCard onClose={() => setParams({ id: null })}>
          {selectedMod && <ModDetailPanel mod={selectedMod} compact returnTo={codexReturnTo} />}
          {selectedArcane && arcaneDisplay && (
            <ArcaneDetailPanel
              key={`${selectedArcane.id}-${arcaneRank}`}
              arcane={selectedArcane}
              display={arcaneDisplay}
              coverage={arcaneCoverageById.get(selectedArcane.id)!}
              effects={arcaneEffects[selectedArcane.id]}
              rank={arcaneRank}
              onRankChange={setPreviewRank}
              compact
              returnTo={codexReturnTo}
            />
          )}
          {selectedShard && <ShardDetailPanel shard={selectedShard} compact returnTo={codexReturnTo} />}
          {selectedWeapon && <WeaponDetailPanel weapon={selectedWeapon} compact returnTo={codexReturnTo} />}
          {selectedWarframe && (
            <WarframeDetailPanel
              warframe={selectedWarframe}
              exaltedWeapons={selectedWarframeExalted}
              compact
              returnTo={codexReturnTo}
            />
          )}
          {selectedCompanion && <CompanionDetailPanel companion={selectedCompanion} compact returnTo={codexReturnTo} />}
          {selectedArchwing && <ArchwingDetailPanel archwing={selectedArchwing} compact returnTo={codexReturnTo} />}
          {selectedNecramech && <NecramechDetailPanel necramech={selectedNecramech} compact returnTo={codexReturnTo} />}
        </CodexDetailCard>
      )}
    </div>
  );
}

export default function CodexPage() {
  return (
    <PageShell>
      <Suspense
        fallback={
          <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
            Loading codex…
          </div>
        }
      >
        <CodexPageContent />
      </Suspense>
    </PageShell>
  );
}
