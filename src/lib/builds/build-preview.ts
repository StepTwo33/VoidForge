import { allHelminthAbilities } from "@/data/helminth";
import { allArchonShards } from "@/data/archon-shards";
import {
  getEffectiveCompanionsMap,
  getEffectiveModsMap,
  getEffectiveWarframesMap,
  getEffectiveWeaponsMap,
} from "@/lib/weapons/effective-data";
import { resolveArcaneById } from "@/lib/builds/build-storage";
import type { WarframeBuildData } from "@/lib/builds/build-storage";
import { dualFormModCountSummary } from "@/lib/builds/dual-form-warframes";
import { getCompanionImage, getWarframeImage, getWeaponImage } from "@/lib/display/images";
import type { EquippedArchonShard, ModSlot } from "@/lib/types";

export interface BuildPreviewChip {
  label: string;
  sublabel?: string;
}

export interface BuildPreviewData {
  itemName: string;
  itemImage: string | null;
  typeLabel: string;
  modChips: BuildPreviewChip[];
  arcaneChips: BuildPreviewChip[];
  extraLines: string[];
  modSummary: string;
}

/** One filled kit slot for loadout display pages. */
export interface LoadoutSlotPreview {
  id: string;
  label: string;
  itemName: string;
  itemImage: string | null;
  modChips: BuildPreviewChip[];
  arcaneChips: BuildPreviewChip[];
  extraLines: string[];
}

function modChipsFromSlots(mods: ModSlot[] | undefined, modsMap = getEffectiveModsMap()): BuildPreviewChip[] {
  const chips: BuildPreviewChip[] = [];
  for (const m of mods ?? []) {
    const mod = modsMap.get(m.modId);
    if (!mod) continue;
    chips.push(m.rank > 0 ? { label: mod.name, sublabel: `R${m.rank}` } : { label: mod.name });
  }
  return chips;
}

function arcaneChipsFromIds(ids: (string | null)[] | undefined): BuildPreviewChip[] {
  const chips: BuildPreviewChip[] = [];
  for (const id of ids ?? []) {
    if (!id) continue;
    const arcane = resolveArcaneById(id);
    chips.push({ label: arcane?.name ?? id });
  }
  return chips;
}

function shardSummary(shards: (EquippedArchonShard | null)[] | undefined): string | null {
  const equipped = (shards ?? []).filter((s): s is EquippedArchonShard => s != null);
  if (equipped.length === 0) return null;
  const parts = equipped.map((s) => {
    const def = allArchonShards.find((sh) => sh.id === s.shardId);
    const name = def?.color ?? s.shardColor;
    const tier = s.shardTier === 2 ? " τ" : "";
    return `${name}${tier}`;
  });
  return `Archon shards: ${parts.join(", ")}`;
}

type WeaponSlotBuild = {
  weaponId: string;
  mods?: ModSlot[];
  stanceModId?: string;
  arcaneIds?: (string | null)[];
};

function weaponSlotPreview(
  id: string,
  label: string,
  build: WeaponSlotBuild | undefined,
  weaponsMap: ReturnType<typeof getEffectiveWeaponsMap>,
  modsMap: ReturnType<typeof getEffectiveModsMap>,
): LoadoutSlotPreview | null {
  if (!build?.weaponId) return null;
  const w = weaponsMap.get(build.weaponId);
  const modChips = modChipsFromSlots(build.mods, modsMap);
  if (build.stanceModId) {
    const stance = modsMap.get(build.stanceModId);
    if (stance) modChips.unshift({ label: stance.name, sublabel: "Stance" });
  }
  return {
    id,
    label,
    itemName: w?.name ?? build.weaponId,
    itemImage: w ? getWeaponImage(w.name, { category: w.category }) : null,
    modChips,
    arcaneChips: arcaneChipsFromIds(build.arcaneIds),
    extraLines: [],
  };
}

/** Per-slot cards for a public loadout build display. */
export function summarizeLoadoutSlots(data: unknown): LoadoutSlotPreview[] {
  if (!data || typeof data !== "object") return [];
  const ld = data as Record<string, unknown>;
  const modsMap = getEffectiveModsMap();
  const weaponsMap = getEffectiveWeaponsMap();
  const warframesMap = getEffectiveWarframesMap();
  const companionsMap = getEffectiveCompanionsMap();
  const slots: LoadoutSlotPreview[] = [];

  const wfBuild = ld.warframeBuild as WarframeBuildData | undefined;
  if (wfBuild?.warframeId) {
    const wf = warframesMap.get(wfBuild.warframeId);
    const extraLines: string[] = [];
    const shards = shardSummary(wfBuild.shards);
    if (shards) extraLines.push(shards);
    if (wfBuild.helminthAbilityId) {
      const helminth = allHelminthAbilities.find((a) => a.id === wfBuild.helminthAbilityId);
      extraLines.push(`Helminth: ${helminth?.name ?? wfBuild.helminthAbilityId}`);
    }
    if (wfBuild.dualFormBuilds && Object.keys(wfBuild.dualFormBuilds).length > 0) {
      extraLines.push(dualFormModCountSummary(wfBuild));
    }
    slots.push({
      id: "warframe",
      label: "Warframe",
      itemName: wf?.name ?? wfBuild.warframeId,
      itemImage: wf ? getWarframeImage(wf.name) : null,
      modChips: modChipsFromSlots(wfBuild.mods, modsMap),
      arcaneChips: arcaneChipsFromIds(wfBuild.arcaneIds),
      extraLines,
    });
  }

  const primary = weaponSlotPreview(
    "primary",
    "Primary",
    ld.primaryBuild as WeaponSlotBuild | undefined,
    weaponsMap,
    modsMap,
  );
  if (primary) slots.push(primary);

  const secondary = weaponSlotPreview(
    "secondary",
    "Secondary",
    ld.secondaryBuild as WeaponSlotBuild | undefined,
    weaponsMap,
    modsMap,
  );
  if (secondary) slots.push(secondary);

  const melee = weaponSlotPreview(
    "melee",
    "Melee",
    ld.meleeBuild as WeaponSlotBuild | undefined,
    weaponsMap,
    modsMap,
  );
  if (melee) slots.push(melee);

  const modularEntries: Array<{
    slot: string;
    modularType?: string;
    parts?: Record<string, string>;
    mods?: ModSlot[];
    arcaneIds?: (string | null)[];
    customName?: string;
  }> = [];
  const mbMap = ld.modularBuilds as
    | Partial<Record<"primary" | "secondary" | "melee", (typeof modularEntries)[number]>>
    | undefined;
  if (mbMap) {
    for (const slot of ["primary", "secondary", "melee"] as const) {
      const m = mbMap[slot];
      if (m?.modularType) modularEntries.push({ ...m, slot });
    }
  }
  const legacyModular = ld.modularBuild as (typeof modularEntries)[number] | undefined;
  if (legacyModular?.modularType && !modularEntries.some((e) => e.slot === legacyModular.slot)) {
    modularEntries.push(legacyModular);
  }
  for (const modular of modularEntries) {
    const parts = modular.parts ?? {};
    const primaryPartId =
      parts.chamber ?? parts.strike ?? parts.prism ?? Object.values(parts)[0];
    const partWeapon = primaryPartId ? weaponsMap.get(primaryPartId) : undefined;
    const partLines = Object.entries(parts).map(
      ([partSlot, id]) => `${partSlot}: ${weaponsMap.get(id)?.name ?? id}`,
    );
    const slotLabel =
      modular.slot === "primary"
        ? "Modular (Primary)"
        : modular.slot === "secondary"
          ? "Modular (Secondary)"
          : modular.slot === "melee"
            ? "Modular (Melee)"
            : "Modular";
    slots.push({
      id: `modular-${modular.slot ?? "unknown"}`,
      label: slotLabel,
      itemName:
        modular.customName ||
        partWeapon?.name ||
        String(modular.modularType).replace(/_/g, " "),
      itemImage: partWeapon
        ? getWeaponImage(partWeapon.name, { category: partWeapon.category })
        : null,
      modChips: modChipsFromSlots(modular.mods, modsMap),
      arcaneChips: arcaneChipsFromIds(modular.arcaneIds),
      extraLines: partLines,
    });
  }

  const comp = ld.companionBuild as
    | {
        companionId?: string;
        customName?: string;
        mods?: ModSlot[];
        weaponId?: string;
        weaponMods?: ModSlot[];
        arcaneIds?: (string | null)[];
      }
    | undefined;
  if (comp?.companionId) {
    const c = companionsMap.get(comp.companionId);
    const extraLines: string[] = [];
    if (comp.weaponId) {
      const cw = weaponsMap.get(comp.weaponId);
      const weaponModCount = comp.weaponMods?.length ?? 0;
      extraLines.push(
        `Weapon: ${cw?.name ?? comp.weaponId}` +
          (weaponModCount > 0 ? ` (${weaponModCount} mod${weaponModCount === 1 ? "" : "s"})` : ""),
      );
    }
    slots.push({
      id: "companion",
      label: "Companion",
      itemName: comp.customName || c?.name || comp.companionId,
      itemImage: c ? getCompanionImage(c.name) : null,
      modChips: modChipsFromSlots(comp.mods, modsMap),
      arcaneChips: arcaneChipsFromIds(comp.arcaneIds),
      extraLines,
    });
  }

  return slots;
}


export function summarizeBuildPreview(type: string, data: unknown): BuildPreviewData {
  const modsMap = getEffectiveModsMap();
  const weaponsMap = getEffectiveWeaponsMap();
  const warframesMap = getEffectiveWarframesMap();
  const companionsMap = getEffectiveCompanionsMap();
  const fallback: BuildPreviewData = {
    itemName: "Unknown item",
    itemImage: null,
    typeLabel: type,
    modChips: [],
    arcaneChips: [],
    extraLines: [],
    modSummary: "No mods equipped",
  };

  if (!data || typeof data !== "object") return fallback;
  const d = data as Record<string, unknown>;
  const extraLines: string[] = [];

  switch (type) {
    case "warframe": {
      const wb = data as WarframeBuildData;
      const wf = warframesMap.get(String(wb.warframeId ?? ""));
      const modChips = modChipsFromSlots(wb.mods);
      const arcaneChips = arcaneChipsFromIds(wb.arcaneIds);
      if (wb.dualFormBuilds && Object.keys(wb.dualFormBuilds).length > 0) {
        extraLines.push(dualFormModCountSummary(wb));
      }
      const shards = shardSummary(wb.shards);
      if (shards) extraLines.push(shards);
      if (wb.helminthAbilityId) {
        const helminth = allHelminthAbilities.find((a) => a.id === wb.helminthAbilityId);
        extraLines.push(`Helminth: ${helminth?.name ?? wb.helminthAbilityId}`);
      }
      const count = modChips.length;
      return {
        itemName: wf?.name ?? "Warframe",
        itemImage: wf ? getWarframeImage(wf.name) : null,
        typeLabel: "Warframe",
        modChips,
        arcaneChips,
        extraLines,
        modSummary: count === 0 ? "No mods on default form" : `${count} mod${count === 1 ? "" : "s"} shown (default form)`,
      };
    }
    case "weapon": {
      const w = weaponsMap.get(String(d.weaponId ?? ""));
      const modChips = modChipsFromSlots(d.mods as ModSlot[]);
      const arcaneChips = arcaneChipsFromIds(d.arcaneIds as (string | null)[]);
      if (d.stanceModId) {
        const stance = modsMap.get(String(d.stanceModId));
        if (stance) modChips.unshift({ label: stance.name, sublabel: "Stance" });
      }
      const count = modChips.length;
      return {
        itemName: w?.name ?? "Weapon",
        itemImage: w ? getWeaponImage(w.name, { category: w.category }) : null,
        typeLabel: "Weapon",
        modChips,
        arcaneChips,
        extraLines,
        modSummary: count === 0 ? "No mods equipped" : `${count} mod${count === 1 ? "" : "s"}`,
      };
    }
    case "companion": {
      const c = companionsMap.get(String(d.companionId ?? ""));
      const bodyMods = modChipsFromSlots(d.mods as ModSlot[]);
      const weaponMods = modChipsFromSlots(d.weaponMods as ModSlot[]);
      const arcaneChips = arcaneChipsFromIds(d.arcaneIds as (string | null)[]);
      if (weaponMods.length > 0) {
        extraLines.push(`Companion weapon: ${weaponMods.length} mod${weaponMods.length === 1 ? "" : "s"}`);
      }
      const count = bodyMods.length;
      return {
        itemName: c?.name ?? "Companion",
        itemImage: c ? getCompanionImage(c.name) : null,
        typeLabel: "Companion",
        modChips: bodyMods,
        arcaneChips,
        extraLines,
        modSummary: count === 0 ? "No body mods" : `${count} body mod${count === 1 ? "" : "s"}`,
      };
    }
    case "modular": {
      const parts = d.parts as Record<string, string> | undefined;
      const modChips = modChipsFromSlots(d.mods as ModSlot[]);
      const arcaneChips = arcaneChipsFromIds(d.arcaneIds as (string | null)[]);
      if (parts) {
        const partNames = Object.entries(parts)
          .map(([slot, id]) => `${slot}: ${weaponsMap.get(id)?.name ?? id}`)
          .join(" · ");
        if (partNames) extraLines.push(partNames);
      }
      const count = modChips.length;
      return {
        itemName: String(d.modularType ?? "Modular").replace(/_/g, " "),
        itemImage: null,
        typeLabel: "Modular",
        modChips,
        arcaneChips,
        extraLines,
        modSummary: count === 0 ? "No mods equipped" : `${count} mod${count === 1 ? "" : "s"}`,
      };
    }
    case "archwing": {
      const modChips = modChipsFromSlots(d.frameMods as ModSlot[] | undefined);
      const weaponChips = modChipsFromSlots(d.weaponMods as ModSlot[] | undefined);
      if (weaponChips.length > 0) {
        extraLines.push(`Weapon: ${weaponChips.length} mod${weaponChips.length === 1 ? "" : "s"}`);
      }
      const count = modChips.length;
      return {
        itemName: "Archwing / Necramech",
        itemImage: null,
        typeLabel: "Archwing",
        modChips,
        arcaneChips: [],
        extraLines,
        modSummary: count === 0 ? "No mods equipped" : `${count} mod${count === 1 ? "" : "s"}`,
      };
    }
    case "railjack": {
      const modChips = modChipsFromSlots(d.integratedMods as ModSlot[] | undefined);
      const battleChips = modChipsFromSlots(d.battleMods as ModSlot[] | undefined);
      const tacticalChips = modChipsFromSlots(d.tacticalMods as ModSlot[] | undefined);
      if (battleChips.length > 0) {
        extraLines.push(`Battle: ${battleChips.length} mod${battleChips.length === 1 ? "" : "s"}`);
      }
      if (tacticalChips.length > 0) {
        extraLines.push(`Tactical: ${tacticalChips.length} mod${tacticalChips.length === 1 ? "" : "s"}`);
      }
      const count = modChips.length;
      return {
        itemName: "Railjack",
        itemImage: null,
        typeLabel: "Railjack",
        modChips,
        arcaneChips: [],
        extraLines,
        modSummary: count === 0 ? "No mods equipped" : `${count} mod${count === 1 ? "" : "s"}`,
      };
    }
    case "loadout": {
      const ld = data as Record<string, unknown>;
      const wfBuild = ld.warframeBuild as WarframeBuildData | undefined;
      const wf = wfBuild ? warframesMap.get(wfBuild.warframeId) : undefined;
      const filledSlots = summarizeLoadoutSlots(data).length;
      return {
        itemName: wf?.name ?? (filledSlots > 0 ? "Full loadout" : "Loadout"),
        itemImage: wf ? getWarframeImage(wf.name) : null,
        typeLabel: "Loadout",
        modChips: [],
        arcaneChips: [],
        extraLines: [],
        modSummary:
          filledSlots === 0
            ? "No slots filled"
            : `${filledSlots} slot${filledSlots === 1 ? "" : "s"} configured`,
      };
    }
    default:
      return fallback;
  }
}
