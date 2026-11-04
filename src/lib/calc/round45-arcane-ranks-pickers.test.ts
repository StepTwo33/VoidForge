/**
 * Round 45 — per-rank arcane values, rank-scaled stack caps, Arcane Intention ability
 * counting, Impetus / Camisado stack overrides, and per-slot arcane pickers.
 * Expected values: wiki.warframe.com arcane pages (fetched 2026-11-03).
 */
import { describe, expect, it } from "vitest";
import { ARCANE_EFFECTS } from "@/data/arcane-effects";
import { allArcanes } from "@/data/arcanes";
import { allMods } from "@/data/mods";
import { allWarframes } from "@/data/warframes";
import { kitgunChambers, kitgunGrips, kitgunLoaders, buildKitgun } from "@/data/modular-weapons";
import { arcaneEffectValuesByRank, arcaneStackCap } from "@/lib/calc/arcane-utils";
import { effectiveArcaneStacks } from "@/lib/calc/arcane-calculator";
import { countIntentionAbilities } from "@/lib/calc/arcane-intention";
import {
  applyWarframeShardsAndArcanes,
  calculateWarframeBuild,
  warframeArcaneStackOverride,
} from "@/lib/calc/calculator";
import { getEffectiveWeapons } from "@/lib/weapons/effective-data";
import { arcanesForSlot, arcaneSlotLabel, getWeaponArcanes } from "@/lib/weapons/weapon-arcane-config";

const line = (id: string, stat: string) => {
  const def = ARCANE_EFFECTS[id];
  const l = def.effects.find((e) => e.stat === stat);
  expect(l, `${id}.${stat}`).toBeDefined();
  return arcaneEffectValuesByRank(l!, def.maxRank);
};

describe("B — per-rank values match the wiki rank tables", () => {
  const cases: [string, string, number[]][] = [
    ["arcane_expertise", "abilityStrengthToShield", [50, 60, 70, 80, 90, 100]],
    ["arcane_power_ramp", "abilityStrength", [2, 3, 4.5, 6, 7.5, 9]],
    ["arcane_intention", "healthFlat", [40, 80, 120, 160, 200, 250]],
    ["theorem_contagion", "vulnerability", [25, 50, 75, 100, 150, 200]],
    ["secondary_fortifier", "overguardDamage", [3, 4, 5, 6, 7, 8]],
    ["secondary_irradiate", "procDamageMultiplier", [80, 100, 120, 140, 160, 180]],
    ["secondary_irradiate", "procAuraRadius", [4.5, 5, 5.5, 6, 6.5, 7]],
    ["primary_overcharge", "multishot", [100, 150, 200, 250, 300, 350]],
    ["primary_compression", "damage", [50, 60, 70, 80, 90, 100]],
    ["primary_compression", "ammoEfficiency", [3, 3.5, 4, 4.5, 5, 5.5]],
    ["primary_plated_round", "buffDuration", [3, 4, 5, 6, 8, 10]],
    ["akimbo_slip_shot", "ammoEfficiency", [15, 25, 35, 45, 55, 65]],
    ["cascadia_empowered", "bonusDamageOnStatus", [250, 350, 450, 550, 650, 750]],
    ["magus_accelerant", "enemyResistanceReduction", [12, 25, 37, 50, 60, 65]],
    ["magus_destruct", "enemyResistanceReduction", [12, 25, 37, 50, 60, 65]],
    ["magus_overload", "damage", [15, 30, 45, 60, 75, 80]],
    ["magus_repair", "operatorToWarframeHeal", [5, 10, 15, 20, 22, 25]],
    ["magus_lockdown", "voidTrapRadius", [3, 6, 9, 12, 13, 15]],
    ["melee_assimilation", "shieldRestorePercent", [5, 10, 15, 20, 25, 30]],
    ["melee_crescendo", "meleeComboInitial", [1, 2, 3, 4, 5, 6]],
    ["melee_doughty", "critPerPunctureTen", [50, 60, 70, 80, 90, 100]],
    ["melee_careen", "meleeDamageBonus", [25, 50, 75, 100, 125, 150]],
    ["primary_bulwark", "damagePerArmorOver", [0.5, 0.6, 0.7, 0.8, 0.9, 1]],
    ["primary_bulwark", "damagePerArmorCap", [250, 300, 350, 400, 450, 500]],
    ["secondary_surge", "maxDamageBonus", [200, 300, 400, 500, 600, 700]],
    ["secondary_enervate", "bigCritThreshold", [1, 2, 3, 4, 5, 6]],
  ];
  it.each(cases)("%s %s", (id, stat, want) => {
    line(id, stat).forEach((v, i) => expect(v).toBeCloseTo(want[i], 4));
  });

  it("B6 Magus Melt: +30% Heat per stack at every rank; stacks 2→7", () => {
    const def = ARCANE_EFFECTS.magus_melt;
    for (const e of def.effects) arcaneEffectValuesByRank(e, def.maxRank).forEach((v) => expect(v).toBeCloseTo(e.maxValue, 6));
    expect(def.effects[0].maxValue).toBe(30);
    expect([0, 1, 2, 3, 4, 5].map((r) => arcaneStackCap(def, r))).toEqual([2, 3, 4, 5, 6, 7]);
  });

  it("B7 Secondary Enervate: +10% crit chance per stack at every rank", () => {
    const def = ARCANE_EFFECTS.secondary_enervate;
    const cc = def.effects.find((e) => e.stat !== "bigCritThreshold")!;
    arcaneEffectValuesByRank(cc, def.maxRank).forEach((v) => expect(v).toBeCloseTo(10, 6));
  });

  it("B3 / B25 rank-scaled stack caps (Ice Storm 10→20, Zid-An Uskos 625→105)", () => {
    expect([0, 5].map((r) => arcaneStackCap(ARCANE_EFFECTS.arcane_ice_storm, r))).toEqual([10, 20]);
    expect([0, 5].map((r) => arcaneStackCap(ARCANE_EFFECTS.zid_an_uskos, r))).toEqual([625, 105]);
    // R0 Ice Storm at full stacks = 10 stacks, not 20 (wiki: +20% at R0).
    const ice = ARCANE_EFFECTS.arcane_ice_storm;
    expect(effectiveArcaneStacks(ice, 1, false, 0)).toBe(10);
    expect(effectiveArcaneStacks(ice, 1, false, 5)).toBe(20);
  });
});

const frame = (id: string) => allWarframes.find((w) => w.id === id)!;
const arcane = (id: string) => allArcanes.find((a) => a.id === id)!;
const modsMap = new Map(allMods.map((m) => [m.id, m]));
const bare = (id: string) => calculateWarframeBuild(frame(id), [], modsMap);

describe("Arcane Intention — stacks = the frame's eligible channeled abilities (max 4)", () => {
  it("counts Baruuk Elude + Serene Storm = 2", () => {
    expect(countIntentionAbilities(frame("baruuk").abilities)).toBe(2);
  });
  it("Banshee Sound Quake only counts with Gaseous Quake", () => {
    expect(countIntentionAbilities(frame("banshee").abilities)).toBe(0);
    expect(countIntentionAbilities(frame("banshee").abilities, ["Gaseous Quake"])).toBe(1);
  });
  it("Atlas Tectonics drops out with Tectonic Fracture", () => {
    const ab = [{ name: "Tectonics" }, { name: "Rumblers" }];
    expect(countIntentionAbilities(ab)).toBe(2);
    expect(countIntentionAbilities(ab, ["Tectonic Fracture"])).toBe(1);
  });
  it("caps at 4 and ignores duplicates", () => {
    const ab = ["Elude", "Elude", "Serene Storm", "Exalted Blade", "Peacemaker", "Ballistic Battery"].map((name) => ({ name }));
    expect(countIntentionAbilities(ab)).toBe(4);
  });
  it("Baruuk R5: +500 health (2 × 250), not the full-stack +1000", () => {
    const h0 = bare("baruuk").totalHealth;
    const withCtx = applyWarframeShardsAndArcanes(bare("baruuk"), [], [arcane("arcane_intention")], [5], {
      abilities: frame("baruuk").abilities,
    });
    const noCtx = applyWarframeShardsAndArcanes(bare("baruuk"), [], [arcane("arcane_intention")], [5]);
    expect(withCtx.totalHealth - h0).toBeCloseTo(500, 4);
    expect(noCtx.totalHealth - h0).toBeCloseTo(1000, 4);
    expect(withCtx.arcaneStackCounts?.arcane_intention).toBe(2);
  });
});

describe("Impetus / Camisado stack sliders", () => {
  it("override passes straight through for non-Intention arcanes", () => {
    expect(warframeArcaneStackOverride("arcane_impetus", { arcaneStacksById: { arcane_impetus: 7 } })).toBe(7);
    expect(warframeArcaneStackOverride("arcane_impetus", undefined)).toBeUndefined();
  });
  it.each([
    ["arcane_impetus", 14, 7],
    ["arcane_camisado", 10, 5],
  ])("%s: half the stacks gives half the strength (%i → %i)", (id, full, half) => {
    const s0 = bare("excalibur").abilityStrength;
    const fullS = applyWarframeShardsAndArcanes(bare("excalibur"), [], [arcane(id)], [5]);
    const halfS = applyWarframeShardsAndArcanes(bare("excalibur"), [], [arcane(id)], [5], {
      arcaneStacksById: { [id]: half },
    });
    expect(fullS.arcaneStackCounts?.[id]).toBe(full);
    expect(halfS.arcaneStackCounts?.[id]).toBe(half);
    expect(halfS.abilityStrength - s0).toBeCloseTo((fullS.abilityStrength - s0) / 2, 6);
  });
  it("override above the cap is clamped", () => {
    const s = applyWarframeShardsAndArcanes(bare("excalibur"), [], [arcane("arcane_impetus")], [5], {
      arcaneStacksById: { arcane_impetus: 99 },
    });
    expect(s.arcaneStackCounts?.arcane_impetus).toBe(14);
  });
});

const W = new Map(getEffectiveWeapons().map((w) => [w.id, w]));
const ids = (list: { id: string }[]) => new Set(list.map((a) => a.id));
const pickerIds = (wid: string) => ids(getWeaponArcanes(W.get(wid)!).arcanes);

describe("A — class-restricted arcane pickers (wiki Module:Weapons Class)", () => {
  it("Longbow Sharpshot: bows only, not crossbows", () => {
    expect(pickerIds("paris_prime").has("longbow_sharpshot")).toBe(true);
    expect(pickerIds("lenz").has("longbow_sharpshot")).toBe(true);
    expect(pickerIds("nagantaka_prime").has("longbow_sharpshot")).toBe(false);
    expect(pickerIds("zhuge_prime").has("longbow_sharpshot")).toBe(false);
    expect(pickerIds("braton").has("longbow_sharpshot")).toBe(false);
  });
  it("Shotgun Vendetta: shotguns + Corvas / Mandonel archguns", () => {
    expect(pickerIds("kuva_hek").has("shotgun_vendetta")).toBe(true);
    expect(pickerIds("phantasma_prime").has("shotgun_vendetta")).toBe(true);
    expect(pickerIds("braton").has("shotgun_vendetta")).toBe(false);
    expect(pickerIds("corvas_prime").has("shotgun_vendetta")).toBe(true);
    expect(pickerIds("imperator").has("shotgun_vendetta")).toBe(false);
  });
  it("Akimbo Slip Shot: dual pistols / dual shotguns + Dual Decurions", () => {
    expect(pickerIds("akstiletto_prime").has("akimbo_slip_shot")).toBe(true);
    expect(pickerIds("twin_rogga").has("akimbo_slip_shot")).toBe(true);
    expect(pickerIds("lato").has("akimbo_slip_shot")).toBe(false);
    const decurion = getWeaponArcanes(W.get("prisma_dual_decurions")!);
    expect(ids(arcanesForSlot(decurion, 1)).has("akimbo_slip_shot")).toBe(true);
  });
});

describe("Archgun / Kitgun / Zaw slot pools", () => {
  it("archgun: slot 1 primary, slot 2 secondary (wiki Archgun Arcane Adapter)", () => {
    const c = getWeaponArcanes(W.get("imperator")!);
    expect(c.slots).toBe(2);
    expect(arcaneSlotLabel(c, 0)).toBe("Primary Arcane");
    expect(arcaneSlotLabel(c, 1)).toBe("Secondary Arcane");
    expect(ids(arcanesForSlot(c, 0)).has("primary_merciless")).toBe(false);
    expect(ids(arcanesForSlot(c, 0)).has("arcane_primary_merciless")).toBe(true);
    expect(ids(arcanesForSlot(c, 1)).has("arcane_secondary_merciless")).toBe(true);
    expect(ids(arcanesForSlot(c, 0)).has("arcane_secondary_merciless")).toBe(false);
  });

  const kit = (chamber: string, grip: "primary" | "secondary") => {
    const c = kitgunChambers.find((x) => x.id === chamber)!;
    const g = kitgunGrips.find((x) => x.type === grip)!;
    return buildKitgun(c, g, kitgunLoaders[0]);
  };
  it("shotgun-chamber primary kitgun gets primary arcanes, not secondary", () => {
    const c = getWeaponArcanes(kit("catchmoon_chamber", "primary"));
    const s0 = ids(arcanesForSlot(c, 0));
    expect(arcaneSlotLabel(c, 0)).toBe("Primary Arcane");
    expect(s0.has("arcane_primary_merciless")).toBe(true);
    expect(s0.has("arcane_secondary_merciless")).toBe(false);
    expect(arcaneSlotLabel(c, 1)).toBe("Kitgun Arcane");
    expect(ids(arcanesForSlot(c, 1)).has("pax_charge")).toBe(true);
    expect(ids(arcanesForSlot(c, 1)).has("arcane_primary_merciless")).toBe(false);
  });
  it("secondary kitgun: slot 1 secondary, slot 2 kitgun", () => {
    const c = getWeaponArcanes(kit("gaze_chamber", "secondary"));
    expect(ids(arcanesForSlot(c, 0)).has("arcane_secondary_merciless")).toBe(true);
    expect(ids(arcanesForSlot(c, 0)).has("pax_charge")).toBe(false);
    expect(ids(arcanesForSlot(c, 1)).has("residual_boils")).toBe(true);
  });
  it("zaw: slot 1 melee, slot 2 exodia", () => {
    const strike = getEffectiveWeapons().find((w) => w.category === "zaw_strike");
    const zaw = strike ?? ({ id: "zaw_test", name: "Zaw", category: "zaw_strike" } as never);
    const c = getWeaponArcanes(zaw);
    expect(ids(arcanesForSlot(c, 0)).has("exodia_might")).toBe(false);
    expect(ids(arcanesForSlot(c, 1)).has("exodia_might")).toBe(true);
    expect(arcaneSlotLabel(c, 0)).toBe("Melee Arcane");
    expect(arcaneSlotLabel(c, 1)).toBe("Exodia Arcane");
  });
});
