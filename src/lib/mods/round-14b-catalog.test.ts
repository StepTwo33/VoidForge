/**
 * Round 14b catalog clean-up (sources: wiki.warframe.com, fandom as the second source).
 * - Renamed / replaced mods migrate: Shotgun Spazz → Shotgun Barrage (U32), Speed Holster → Holster
 *   Amp (U32), Helminth Ferocity → Proboscis (U20 "Replaced by Proboscis").
 * - Archived augments, unsourced entries, unreleased Primed mods and Focus 2.0 nodes are removed;
 *   old builds drop them with a warning.
 * - The 75 current Focus nodes (5 schools × 10 Ways + 5 Tauron nodes) are all category "operator".
 * - Conclave-only mods (wiki: "limited to player versus player missions") are category "conclave",
 *   which every PvE picker already excludes, and old builds drop them.
 */
import { describe, expect, it } from "vitest";
import { allMods, modsMap } from "@/data/mods";
import { allWeapons } from "@/data/weapons";
import { MOD_INCOMPATIBLE_PAIRS } from "@/data/mod-exclusions";
import { VERIFIED_MOD_BEHAVIORS } from "@/data/mod-behaviors";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { modEligibleForWeaponSlot } from "@/lib/mods/mod-weapon-eligibility";
import { getWeaponModProfile } from "@/lib/mods/weapon-mod-tags";
import { modFitsCompanionWeapon } from "@/lib/weapons/companion-weapons";
import { dropRetiredMods, dropRetiredModsDeep, migrateRenamedMods, RETIRED_MODS } from "@/lib/mods/known-mods";
import { cleanLoadedBuild, cleanLoadedMods, describeRetiredMods } from "@/lib/builds/incompatible-mod-warnings";
import type { SavedBuild } from "@/lib/builds/build-storage";
import type { Weapon } from "@/lib/types";

const weapon = (id: string) => allWeapons.find((w) => w.id === id) as Weapon;
const fitsRegular = (modId: string, weaponId: string, builder: "primary" | "secondary" | "melee") => {
  const w = weapon(weaponId);
  return modEligibleForWeaponSlot(modsMap.get(modId)!, builder, w.category, "regular", getWeaponModProfile(w));
};

const FOCUS_TREES: Record<string, string[]> = {
  // wiki.warframe.com Focus § The Focus Trees (Update 41.0 Tauron Strike nodes included)
  madurai: ["Phoenix Talons", "Power Transfer", "Void Strike", "Void Fuel", "Contamination Wave", "Distilled Contamination", "Chained Sling", "Sling Strength", "Inner Gaze", "Eternal Gaze", "Thara Tauron Strike", "Rain of Arrows", "Surging Storm", "Downpour", "Overwhelming Power"],
  vazarin: ["Mending Unity", "Mending Soul", "Enduring Tides", "Rejuvenating Tides", "Guardian Shell", "Guardian Break", "Void Snare", "Protective Sling", "Void Regen", "Squad Regen", "Nidri Tauron Strike", "Rift Waters", "Eroding Rapids", "Deathless Currents", "Swelling Deluge"],
  naramon: ["Power Spike", "Affinity Spike", "Mind Step", "Far Sling", "Void Levitation", "Lethal Levitation", "Sling Stun", "Killer's Rush", "Opening Slam", "Amp Spike", "Vexoric Tauron Strike", "Spectral Blades", "Flowing Strikes", "Hungering Blades", "Astral Cut"],
  unairu: ["Poise", "Stone Skin", "Last Gasp", "Vengeance", "Magnetic Flare", "Magnetic Boost", "Caustic Strike", "Unairu Wisp", "Reinforced Return", "Static Purge", "Cogron Tauron Strike", "Sundered Bounty", "Seismic Impact", "Tempered Benison", "Great Quake"],
  zenurik: ["Energy Pulse", "Inner Might", "Void Siphon", "Void Flow", "Wellspring", "Hardened Wellspring", "Temporal Drag", "Temporal Shot", "Disarming Sling", "No Quarter", "Lorak Tauron Strike", "Prismatic Beam", "Spectral Pages", "Boundless Energy", "Brilliant Insight"],
};

describe("removed mods", () => {
  it("are gone from the catalog, behaviors and incompatibility data", () => {
    const ids = [...Object.keys(RETIRED_MODS), "shotgun_spazz", "aura_speed_holster", "helminth_ferocity"];
    expect(ids).toHaveLength(41);
    for (const id of ids) {
      expect(modsMap.has(id)).toBe(false);
      expect(VERIFIED_MOD_BEHAVIORS[id]).toBeUndefined();
      expect(MOD_INCOMPATIBLE_PAIRS.flat()).not.toContain(id);
    }
  });

  it("keeps the claw-slot companion mods the tied claws use", () => {
    const claws = { id: "chesa_claws", name: "Chesa Claws", category: "beast_claw", triggerType: "Melee" } as Weapon;
    for (const id of ["claw_bite", "claw_maul", "claw_shred", "claw_swipe", "claw_heat", "claw_cold", "claw_fury"]) {
      expect(modsMap.has(id)).toBe(true);
      expect(modFitsCompanionWeapon(modsMap.get(id)!, claws)).toBe(true);
    }
  });
});

describe("Focus trees", () => {
  it("catalog operator nodes are exactly the 75 current nodes", () => {
    const current = Object.values(FOCUS_TREES).flat().sort();
    expect(current).toHaveLength(75);
    const operator = allMods.filter((m) => m.category === "operator").map((m) => m.name).sort();
    expect(operator).toEqual(current);
  });

  it("Power Spike, Affinity Spike, Flowing Strikes, Spectral Blades, Astral Cut and Killer's Rush leave the weapon pickers", () => {
    for (const id of ["power_spike", "affinity_spike", "flowing_strikes", "spectral_blades", "astral_cut", "killers_rush"]) {
      expect(modsMap.get(id)!.category).toBe("operator");
      expect(fitsRegular(id, "skana", "melee")).toBe(false);
    }
  });

  it("Tektolyst Artifacts only offer the 20 Artifact mods", () => {
    const historic = allMods.filter((m) => m.category === "tektolyst").map((m) => m.name);
    expect(historic).toHaveLength(20);
    expect(historic.some((n) => /Tauron Strike|Temporal Shot|Prismatic Beam/.test(n))).toBe(false);
  });
});

describe("Conclave-only mods", () => {
  it("are category conclave and not offered on their PvE weapon", () => {
    for (const id of ["comet_rounds", "hydraulic_gauge", "gorgon_frenzy", "rising_steel", "adept_surge"]) {
      expect(modsMap.get(id)!.category).toBe("conclave");
    }
    expect(fitsRegular("comet_rounds", "braton", "primary")).toBe(false);
    expect(fitsRegular("gorgon_frenzy", "gorgon", "primary")).toBe(false);
  });

  it("PvE-and-Conclave mods stay (Double Tap: 'a PvE and Conclave Weapon Augment Mod')", () => {
    expect(modsMap.get("double_tap")!.category).not.toBe("conclave");
    expect(fitsRegular("double_tap", "latron", "primary")).toBe(true);
  });
});

describe("old builds", () => {
  it("migrate renamed mods, clamp the rank and refresh cached display fields", () => {
    const { mods, migrated } = migrateRenamedMods(
      [
        { modId: "shotgun_spazz", modName: "Shotgun Spazz", rank: 5, slotIndex: 0 },
        { modId: "aura_speed_holster", modName: "Speed Holster", rank: 3, slotIndex: 1 },
        { modId: "helminth_ferocity", modName: "Helminth Ferocity", rank: 5, slotIndex: 2 },
      ],
      modsMap,
    );
    expect(mods.map((m) => [m.modId, m.modName, m.rank])).toEqual([
      ["shotgun_barrage", "Shotgun Barrage", 5],
      ["holster_amp", "Holster Amp", 3],
      ["proboscis", "Proboscis", 3], // Proboscis max rank 3
    ]);
    expect(migrated).toHaveLength(3);
  });

  it("drop removed and Conclave-only mods with a reason", () => {
    const list = [
      { modId: "serration", rank: 10, slotIndex: 0 },
      { modId: "comet_rounds", rank: 3, slotIndex: 1 },
      { modId: "mind_sprint", rank: 5, slotIndex: 2 },
      { modId: "augment_ember_fire_fright", rank: 3, slotIndex: 3 },
    ];
    const { mods, dropped } = dropRetiredMods(list, modsMap);
    expect(mods.map((m) => m.modId)).toEqual(["serration"]);
    expect(describeRetiredMods(dropped)).toEqual([
      "Comet Rounds (Conclave only)",
      "Mind Sprint (old Focus 2.0 node)",
      "Fire Fright (removed from the game)",
    ]);
    const keep = [{ modId: "serration", rank: 10, slotIndex: 0 }];
    expect(dropRetiredMods(keep, modsMap).mods).toBe(keep);
    const data = { warframeBuild: { mods: list } };
    expect(dropRetiredModsDeep(data, modsMap).data.warframeBuild.mods.map((m) => m.modId)).toEqual(["serration"]);
  });

  it("hand-worked: Strun with Shotgun Spazz + Shotgun Barrage loads as one Barrage (×1.9 fire rate, not ×2.8)", () => {
    const strun = weapon("strun");
    const kept = cleanLoadedMods([
      { modId: "shotgun_spazz", rank: 5, slotIndex: 0 },
      { modId: "shotgun_barrage", rank: 5, slotIndex: 1 },
    ]);
    expect(kept.map((m) => m.modId)).toEqual(["shotgun_barrage"]);
    const stats = calculateWeaponBuild(strun, kept, modsMap);
    expect(stats.fireRate).toBeCloseTo(strun.fireRate * (1 + 0.15 * 6), 8);
  });

  it("cleanLoadedBuild migrates, then drops, in a saved warframe build", () => {
    const build = {
      id: "b1",
      name: "old",
      type: "warframe",
      itemId: "excalibur",
      data: { mods: [
        { modId: "aura_speed_holster", rank: 3, slotIndex: 0 },
        { modId: "primed_streamline", rank: 10, slotIndex: 1 },
        { modId: "adept_surge", rank: 3, slotIndex: 2 },
        { modId: "streamline_r3", rank: 5, slotIndex: 3 },
      ] },
      createdAt: "",
      updatedAt: "",
    } as unknown as SavedBuild;
    const out = cleanLoadedBuild(build).data as { mods: { modId: string }[] };
    expect(out.mods.map((m) => m.modId)).toEqual(["holster_amp", "streamline_r3"]);
  });
});
