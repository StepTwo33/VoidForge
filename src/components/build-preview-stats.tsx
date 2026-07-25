"use client";

import { useMemo } from "react";
import { AbilityTTKPanel } from "@/components/ability-ttk-panel";
import { LoadoutDamagePanel } from "@/components/loadout-damage-panel";
import { WarframeStatsPanel, WeaponStatsPanel } from "@/components/stats-panel";
import {
  resolvePublicBuildWarframePreview,
  resolvePublicBuildWeaponPreview,
} from "@/lib/builds/build-stats";
import type { LoadoutBuildData } from "@/lib/builds/loadouts";
import { useMods, useWeapons } from "@/lib/weapons/use-data";
import type { EquippedMod, Loadout } from "@/lib/types";

function StatsDivider() {
  return <div className="w-full h-px bg-border my-8" />;
}

function WeaponPreviewSection({
  label,
  weapon,
  stats,
  baseStats,
  isMelee,
}: {
  label: string;
  weapon: NonNullable<ReturnType<typeof resolvePublicBuildWeaponPreview>>["weapon"];
  stats: NonNullable<ReturnType<typeof resolvePublicBuildWeaponPreview>>["stats"];
  baseStats: NonNullable<ReturnType<typeof resolvePublicBuildWeaponPreview>>["baseStats"];
  isMelee: boolean;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label} — calculated stats
      </h2>
      <WeaponStatsPanel
        stats={stats}
        baseStats={baseStats}
        weapon={weapon}
        isMelee={isMelee}
      />
    </section>
  );
}

export function BuildPreviewStats({ type, data }: { type: string; data: unknown }) {
  const allWeapons = useWeapons();
  const { modsMap } = useMods();

  const warframePreview = useMemo(
    () => (type === "warframe" ? resolvePublicBuildWarframePreview(data, allWeapons) : null),
    [type, data, allWeapons],
  );

  const loadoutPreview = useMemo((): Loadout | null => {
    if (type !== "loadout" || !data || typeof data !== "object") return null;
    return {
      id: "preview",
      name: "Preview",
      createdAt: 0,
      updatedAt: 0,
      ...(data as LoadoutBuildData),
    };
  }, [type, data]);

  const weaponPreview = useMemo(
    () =>
      type !== "warframe" && type !== "loadout"
        ? resolvePublicBuildWeaponPreview(type, data, allWeapons)
        : null,
    [type, data, allWeapons],
  );

  const equippedMods = useMemo((): EquippedMod[] | undefined => {
    if (!warframePreview) return undefined;
    return warframePreview.modSlots.map((m) => {
      const mod = modsMap.get(m.modId);
      return {
        modId: m.modId,
        modName: mod?.name ?? "",
        rank: m.rank,
        slotIndex: m.slotIndex,
        polarity: mod?.polarity,
        drain: mod?.drain,
      };
    });
  }, [warframePreview, modsMap]);

  if (!warframePreview && !weaponPreview && !loadoutPreview) return null;

  return (
    <>
      <StatsDivider />

      {loadoutPreview && <LoadoutDamagePanel loadout={loadoutPreview} />}

      {warframePreview && (
        <div className="space-y-6">
          <section className="space-y-3">
            <h2 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {warframePreview.warframe.name} — survivability &amp; ability mods
            </h2>
            <WarframeStatsPanel
              stats={warframePreview.stats}
              warframe={warframePreview.warframe}
              equippedMods={equippedMods}
              allMods={modsMap}
              equippedShards={warframePreview.shards}
              equippedArcanes={warframePreview.arcanes}
              arcaneRanks={warframePreview.arcaneRanks}
            />
          </section>

          {warframePreview.abilityEntries.length > 0 && (
            <AbilityTTKPanel entries={warframePreview.abilityEntries} />
          )}

          {warframePreview.exalted && (
            <WeaponPreviewSection
              label={warframePreview.exalted.label}
              weapon={warframePreview.exalted.weapon}
              stats={warframePreview.exalted.stats}
              baseStats={warframePreview.exalted.baseStats}
              isMelee={warframePreview.exalted.isMelee}
            />
          )}
          {warframePreview.exaltedMelee && (
            <WeaponPreviewSection
              label={warframePreview.exaltedMelee.label}
              weapon={warframePreview.exaltedMelee.weapon}
              stats={warframePreview.exaltedMelee.stats}
              baseStats={warframePreview.exaltedMelee.baseStats}
              isMelee={warframePreview.exaltedMelee.isMelee}
            />
          )}
        </div>
      )}

      {weaponPreview && (
        <WeaponPreviewSection
          label={weaponPreview.label}
          weapon={weaponPreview.weapon}
          stats={weaponPreview.stats}
          baseStats={weaponPreview.baseStats}
          isMelee={weaponPreview.isMelee}
        />
      )}
    </>
  );
}
