/**
 * Round 49 (wiki.warframe.com): Rumblejack slam crit, Flame / Frost Claws retired, Bite / Maul /
 * Swipe (Claws) folded into the real mods, the Beast Claws mod list on the claws, Quick Return /
 * Rebound per-rank bounces.
 */
import { describe, expect, it } from "vitest";
import { allMods, modsMap } from "@/data/mods";
import { allWeapons } from "@/data/weapons";
import { allCompanions, companionsMap } from "@/data/companions";
import { customWeapons } from "@/data/custom-items";
import { MELEE_ATTACK_DATA } from "@/data/melee-attack-data";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { avgCritMultiplier } from "@/lib/calc/crit-utils";
import { countHunterSetPieces, countMechaSetPieces } from "@/lib/calc/set-bonuses";
import { getModStatDisplayLines } from "@/lib/display/mod-display";
import { dropRetiredMods, migrateRenamedMods, RENAMED_MOD_OLD_NAMES, RETIRED_MODS } from "@/lib/mods/known-mods";
import { companionStatModsForBuilder } from "@/lib/mods/companion-precept-eligibility";
import { migrateCompanionPosture } from "@/lib/builds/loadouts";
import {
  CLAW_MODS_FORMERLY_ON_COMPANION,
  migrateClawModsFromCompanion,
  modFitsCompanionWeapon,
} from "@/lib/weapons/companion-weapons";
import type { Loadout } from "@/lib/types";

const weapon = (id: string) => allWeapons.find((w) => w.id === id)!;
const claws = (id: string) => customWeapons.find((w) => w.id === id)!;
const card = (id: string, rank: number) => getModStatDisplayLines(modsMap.get(id)!, rank).map((l) => l.atRank);

describe("Round 49: Rumblejack slam / heavy slam crit 14%", () => {
  it("normal attacks stay 13%; the slam uses the wiki's 14%", () => {
    const w = weapon("rumblejack");
    expect(w.criticalChance).toBe(0.13);
    expect(MELEE_ATTACK_DATA.rumblejack.slam?.criticalChance).toBe(0.14);
    expect(MELEE_ATTACK_DATA.rumblejack.heavySlam?.criticalChance).toBe(0.14);
    const stats = calculateWeaponBuild(w, [], modsMap);
    expect(stats.criticalChance).toBeCloseTo(0.13, 10);
    expect(stats.slamCritChanceRatio).toBeCloseTo(0.14 / 0.13, 10);
    expect(stats.slamAttackDamage).toBeCloseTo(
      stats.totalDamage * stats.slamBaseMultiplier! * avgCritMultiplier(0.14, stats.criticalMultiplier),
      6,
    );
  });
  it("crit mods scale the slam's own base (True Steel R5 +120%: 0.14 × 2.2)", () => {
    const stats = calculateWeaponBuild(weapon("rumblejack"), [{ modId: "true_steel_r3", rank: 5, slotIndex: 0 }], modsMap);
    expect(stats.criticalChance).toBeCloseTo(0.13 * 2.2, 8);
    expect(stats.slamAttackDamage).toBeCloseTo(
      stats.totalDamage * stats.slamBaseMultiplier! * avgCritMultiplier(0.14 * 2.2, stats.criticalMultiplier),
      6,
    );
  });
  it("other weapons keep one crit chance for slams", () => {
    const others = Object.entries(MELEE_ATTACK_DATA).filter(
      ([id, d]) => id !== "rumblejack" && (d.slam?.criticalChance != null || d.heavySlam?.criticalChance != null),
    );
    // Round 50 added the five other wiki weapons with their own slam / heavy slam crit.
    expect(others.map(([id]) => id).sort()).toEqual(["amphis", "kestrel_prime", "prisma_machete", "syam", "vinquibus_melee"]);
    expect(calculateWeaponBuild(weapon("skana"), [], modsMap).slamCritChanceRatio).toBeUndefined();
  });
});

describe("Round 49: Flame Claws / Frost Claws retired", () => {
  it("are gone and drop from saved builds as not real mods; Flame Gland / Frost Jaw stay", () => {
    for (const id of ["claw_heat", "claw_cold"]) {
      expect(modsMap.has(id), id).toBe(false);
      expect(RETIRED_MODS[id]?.reason, id).toBe("no_source");
    }
    expect(RETIRED_MODS.claw_heat.name).toBe("Flame Claws");
    expect(RETIRED_MODS.claw_cold.name).toBe("Frost Claws");
    const { mods, dropped } = dropRetiredMods(
      [{ modId: "claw_heat" }, { modId: "claw_cold" }, { modId: "flame_gland" }, { modId: "frost_jaw" }],
      modsMap,
    );
    expect(dropped.map((d) => d.modId)).toEqual(["claw_heat", "claw_cold"]);
    expect(mods.map((m) => m.modId)).toEqual(["flame_gland", "frost_jaw"]);
  });
});

describe("Round 49: Bite / Maul / Swipe (Claws) fold into the real mods", () => {
  it("old ids migrate with rank and slot kept", () => {
    expect(RENAMED_MOD_OLD_NAMES.claw_bite).toBe("Bite (Claws)");
    const { mods, migrated } = migrateRenamedMods(
      [
        { modId: "claw_bite", rank: 10, slotIndex: 0 },
        { modId: "claw_maul", rank: 7, slotIndex: 1 },
        { modId: "claw_swipe", rank: 3, slotIndex: 2 },
      ],
      modsMap,
    );
    expect(mods).toEqual([
      { modId: "bite", rank: 10, slotIndex: 0 },
      { modId: "maul", rank: 7, slotIndex: 1 },
      { modId: "swipe", rank: 3, slotIndex: 2 },
    ]);
    expect(migrated).toHaveLength(3);
    for (const id of ["claw_bite", "claw_maul", "claw_swipe"]) expect(modsMap.has(id), id).toBe(false);
  });
  it("Magnetic Claws is the real mod and stays (wiki: +60% Magnetic, +40% Status Duration, R3)", () => {
    const m = modsMap.get("claw_magnetic")!;
    expect(m.name).toBe("Magnetic Claws");
    expect([m.polarity, m.drain, m.maxRank, m.rarity]).toEqual(["madurai", 4, 3, "rare"]);
    expect(card("claw_magnetic", 3)).toEqual(["+60% Magnetic damage", "+40% Status Duration"]);
  });
});

describe("Round 49: wiki Beast Claws mods go on the claws", () => {
  // wiki.warframe.com Module:Mods/data (Polarity, BaseDrain, MaxRank, Rarity).
  const wiki: Record<string, [string, number, number, string]> = {
    bite: ["madurai", 6, 10, "rare"],
    maul: ["madurai", 4, 10, "uncommon"],
    swipe: ["madurai", 2, 3, "uncommon"],
    brute_conditioning: ["madurai", 4, 10, "uncommon"],
    disabling_conditioning: ["madurai", 4, 10, "uncommon"],
    hunter_synergy: ["madurai", 4, 5, "uncommon"],
    immunity_resistance: ["madurai", 4, 3, "common"],
    magnetic_strike: ["madurai", 2, 3, "common"],
    mecha_overdrive: ["madurai", 6, 5, "rare"],
    strain_fever: ["madurai", 6, 3, "rare"],
    assassin_posture: ["penjaga", -2, 3, "common"],
    balanced_posture: ["penjaga", -2, 3, "common"],
    elusive_posture: ["penjaga", -2, 3, "common"],
    frenzied_posture: ["penjaga", -2, 3, "common"],
    persistent_posture: ["penjaga", -2, 3, "common"],
    protector_posture: ["penjaga", -2, 3, "common"],
  };
  it("are claw mods with the wiki's polarity, drain, max rank and rarity", () => {
    expect([...CLAW_MODS_FORMERLY_ON_COMPANION].sort()).toEqual(Object.keys(wiki).sort());
    for (const [id, [pol, drain, max, rarity]] of Object.entries(wiki)) {
      const m = modsMap.get(id)!;
      expect([m.category, m.subCategory], id).toEqual(["companion_weapon", "beast_weapon"]);
      expect([m.polarity, m.drain, m.maxRank, m.rarity], id).toEqual([pol, drain, max, rarity]);
    }
  });
  it("leave the beast's own mod panel", () => {
    const chesa = companionsMap.get("chesa")!;
    const panel = companionStatModsForBuilder(chesa, allMods, ["beast", ""]).map((m) => m.id);
    for (const id of Object.keys(wiki)) expect(panel, id).not.toContain(id);
  });
  it("fit the claws they belong on (Swipe: Kavat / Vulpaphyla; Mecha Overdrive: Kubrow / Predasite, not Helminth Charger; Strain Fever: Helminth Charger)", () => {
    const fits = (mod: string, claw: string) => modFitsCompanionWeapon(modsMap.get(mod)!, claws(claw));
    for (const c of ["chesa_claws", "smeeta_claws", "vizier_claws", "sly_claws", "helminth_claws"]) {
      for (const id of ["bite", "maul", "brute_conditioning", "hunter_synergy", "magnetic_strike", "immunity_resistance"]) {
        expect(fits(id, c), `${id} on ${c}`).toBe(true);
      }
    }
    expect([fits("swipe", "smeeta_claws"), fits("swipe", "venari_claws"), fits("swipe", "sly_claws")]).toEqual([true, true, true]);
    expect([fits("swipe", "chesa_claws"), fits("swipe", "vizier_claws")]).toEqual([false, false]);
    expect([fits("mecha_overdrive", "chesa_claws"), fits("mecha_overdrive", "vizier_claws")]).toEqual([true, true]);
    expect([fits("mecha_overdrive", "helminth_claws"), fits("mecha_overdrive", "smeeta_claws"), fits("mecha_overdrive", "sly_claws")]).toEqual([false, false, false]);
    expect([fits("strain_fever", "helminth_claws"), fits("strain_fever", "chesa_claws")]).toEqual([true, false]);
  });
  it("cards follow the wiki rank tables", () => {
    expect(card("hunter_synergy", 0)).toEqual(["+5% Crit Link"]);
    expect(card("hunter_synergy", 5)).toEqual(["+30% Crit Link"]);
    expect(modsMap.get("hunter_synergy")!.stats.critLink).toBe(5);
    expect(card("magnetic_strike", 0)).toEqual(["+25% Magnetic Proc Chance"]);
    expect(card("magnetic_strike", 3)).toEqual(["+100% Magnetic Proc Chance"]);
    expect(card("assassin_posture", 3)).toEqual(["+300% Overguard Damage"]);
    expect(card("elusive_posture", 0)).toEqual(["+12.5% Evasion"]);
    expect(card("persistent_posture", 3)).toEqual(["+40% Impact damage"]);
    expect(card("protector_posture", 0)).toEqual(["+15m Range", "+1 Puncture Procs"]);
    expect(card("protector_posture", 3)).toEqual(["+15m Range", "+4 Puncture Procs"]);
    expect(card("brute_conditioning", 10)).toEqual(["+385% Damage"]);
    expect(card("immunity_resistance", 0)).toEqual(["+12.5% Status Damage"]);
  });
  it("Maul / Brute Conditioning still add claw damage; card-only mods don't change claw DPS", () => {
    const w = claws("chesa_claws");
    const base = calculateWeaponBuild(w, [], modsMap);
    expect(calculateWeaponBuild(w, [{ modId: "maul", rank: 10, slotIndex: 0 }], modsMap).moddedBaseDamage).toBeCloseTo(w.damage * 4.3, 5);
    expect(calculateWeaponBuild(w, [{ modId: "brute_conditioning", rank: 10, slotIndex: 0 }], modsMap).moddedBaseDamage).toBeCloseTo(w.damage * 4.85, 5);
    for (const id of ["magnetic_strike", "hunter_synergy", "mecha_overdrive", "assassin_posture", "persistent_posture", "protector_posture", "elusive_posture"]) {
      const m = modsMap.get(id)!;
      const s = calculateWeaponBuild(w, [{ modId: id, rank: m.maxRank, slotIndex: 0 }], modsMap);
      expect(s.burstDps, id).toBeCloseTo(base.burstDps, 6);
    }
  });
  it("Hunter Synergy / Mecha Overdrive on the claws count toward their sets", () => {
    const claw = [{ modId: "hunter_synergy", rank: 5, slotIndex: 0 }, { modId: "mecha_overdrive", rank: 5, slotIndex: 1 }];
    expect(countHunterSetPieces({ companionWeaponMods: claw }, [])).toBe(1);
    expect(countMechaSetPieces([], [], claw)).toBe(1);
    expect(countMechaSetPieces([], claw)).toBe(1);
  });
});

describe("Round 49: old builds move claw mods from the beast onto the claws", () => {
  const chesa = companionsMap.get("chesa")!;
  it("moves them to free claw slots (posture to slot 8) and keeps the rest", () => {
    const mods = [
      { modId: "bite", rank: 10, slotIndex: 0 },
      { modId: "link_redirection", rank: 10, slotIndex: 1 },
      { modId: "assassin_posture", rank: 3, slotIndex: 2 },
    ];
    const weaponMods = [{ modId: "maul", rank: 10, slotIndex: 0 }];
    const out = migrateClawModsFromCompanion(mods, weaponMods, chesa);
    expect(out.mods.map((m) => m.modId)).toEqual(["link_redirection"]);
    expect(out.weaponMods.map((m) => `${m.slotIndex}:${m.modId}:${m.rank}`)).toEqual(["0:maul:10", "1:bite:10", "8:assassin_posture:3"]);
    expect(out.moved).toEqual(["bite", "assassin_posture"]);
    const again = migrateClawModsFromCompanion(out.mods, out.weaponMods, chesa);
    expect(again.mods).toBe(out.mods);
    expect(again.weaponMods).toBe(out.weaponMods);
  });
  it("drops a copy already on the claws; leaves mods the claws can't take or have no room for", () => {
    const full = Array.from({ length: 8 }, (_, i) => ({ modId: `x${i}`, rank: 0, slotIndex: i }));
    const out = migrateClawModsFromCompanion(
      [{ modId: "maul", rank: 10, slotIndex: 0 }, { modId: "swipe", rank: 3, slotIndex: 1 }, { modId: "bite", rank: 10, slotIndex: 2 }],
      [...full.slice(0, 7), { modId: "maul", rank: 10, slotIndex: 7 }],
      chesa,
    );
    expect(out.droppedDuplicates).toEqual(["maul"]);
    expect(out.mods.map((m) => m.modId)).toEqual(["swipe", "bite"]); // Swipe is Kavat-only; claws full
    expect(out.moved).toEqual([]);
  });
  it("only applies to beasts", () => {
    const sentinel = allCompanions.find((c) => c.type === "sentinel")!;
    const mods = [{ modId: "bite", rank: 10, slotIndex: 0 }];
    expect(migrateClawModsFromCompanion(mods, [], sentinel).mods).toBe(mods);
  });
  it("runs on stored loadouts and is idempotent", () => {
    const lo = {
      companionBuild: {
        companionId: "chesa",
        mods: [{ modId: "hunter_synergy", rank: 5, slotIndex: 3 }, { modId: "elusive_posture", rank: 3, slotIndex: 4 }],
        weaponMods: [],
        hasReactor: false,
        hasCatalyst: false,
      },
    } as unknown as Pick<Loadout, "companionBuild">;
    const migrated = migrateCompanionPosture(lo);
    expect(migrated.companionBuild!.mods).toEqual([]);
    expect(migrated.companionBuild!.weaponMods.map((m) => `${m.slotIndex}:${m.modId}`)).toEqual(["0:hunter_synergy", "8:elusive_posture"]);
    expect(migrateCompanionPosture(migrated)).toBe(migrated);
  });
});

describe("Round 49: Quick Return / Rebound per-rank bounces (wiki stat tables)", () => {
  it("1 bounce per rank: Quick Return -1..-4, Rebound +1..+4", () => {
    expect(modsMap.get("quick_return")!.stats.ricochetBounces).toBe(-1);
    expect(modsMap.get("rebound")!.stats.ricochetBounces).toBe(1);
    expect([0, 1, 2, 3].map((r) => card("quick_return", r)[0])).toEqual(["-1 bounces", "-2 bounces", "-3 bounces", "-4 bounces"]);
    expect([0, 1, 2, 3].map((r) => card("rebound", r)[0])).toEqual(["+1 bounces", "+2 bounces", "+3 bounces", "+4 bounces"]);
    for (const id of ["quick_return", "rebound"]) {
      const m = modsMap.get(id)!;
      expect([m.polarity, m.drain, m.maxRank, m.rarity], id).toEqual(["naramon", 4, 3, "common"]);
    }
  });
});
