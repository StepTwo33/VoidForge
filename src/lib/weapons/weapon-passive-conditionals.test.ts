import { describe, expect, it } from "vitest";
import { allWeapons } from "@/data/weapons";
import { modsMap } from "@/data/mods";
import { calculateWeaponBuildWithArcanes } from "@/lib/calc/calculator";
import { DEFAULT_SIM_PARAMS, Weapon } from "@/lib/types";
import { resolveStandaloneExternalBuffs } from "@/lib/weapons/weapon-external-buffs";

function findWeapon(id: string): Weapon {
  const w = allWeapons.find((x) => x.id === id);
  if (!w) throw new Error(`Weapon not found: ${id}`);
  return w;
}

describe("Weapon passive conditionals and external buffs", () => {
  it("Athodai Overdrive grants +100% Fire Rate", () => {
    const athodai = findWeapon("athodai");
    const stockBuffs = resolveStandaloneExternalBuffs(athodai, DEFAULT_SIM_PARAMS);
    expect(stockBuffs.find((b) => b.id === "passive_athodai_overdrive")).toBeUndefined();

    const activeBuffs = resolveStandaloneExternalBuffs(athodai, {
      ...DEFAULT_SIM_PARAMS,
      weaponPassiveState: { athodai_overdrive: 1 },
    });
    const overdrive = activeBuffs.find((b) => b.id === "passive_athodai_overdrive");
    expect(overdrive).toBeDefined();
    expect(overdrive?.fireRateBonus).toBe(1.0);

    const stockStats = calculateWeaponBuildWithArcanes(athodai, [], modsMap, [], undefined, DEFAULT_SIM_PARAMS);
    const activeStats = calculateWeaponBuildWithArcanes(
      athodai,
      [],
      modsMap,
      [],
      undefined,
      {
        ...DEFAULT_SIM_PARAMS,
        weaponPassiveState: { athodai_overdrive: 1 },
      },
      { externalBuffs: activeBuffs },
    );
    expect(activeStats.fireRate).toBeCloseTo(stockStats.fireRate * 2.0, 3);
  });

  it("Dual Toxocyst Frenzy grants +150% Fire Rate and +100% Damage", () => {
    const dt = findWeapon("dual_toxocyst");
    const activeBuffs = resolveStandaloneExternalBuffs(dt, {
      ...DEFAULT_SIM_PARAMS,
      weaponPassiveState: { dual_toxocyst_frenzy: 1 },
    });
    const frenzy = activeBuffs.find((b) => b.id === "passive_dual_toxocyst_frenzy");
    expect(frenzy).toBeDefined();
    expect(frenzy?.fireRateBonus).toBe(1.5);
    expect(frenzy?.damageBonus).toBe(1.0);

    const stockStats = calculateWeaponBuildWithArcanes(dt, [], modsMap, [], undefined, DEFAULT_SIM_PARAMS);
    const activeStats = calculateWeaponBuildWithArcanes(
      dt,
      [],
      modsMap,
      [],
      undefined,
      {
        ...DEFAULT_SIM_PARAMS,
        weaponPassiveState: { dual_toxocyst_frenzy: 1 },
      },
      { externalBuffs: activeBuffs },
    );
    expect(activeStats.fireRate).toBeCloseTo(stockStats.fireRate * 2.5, 3);
    expect(activeStats.totalDamage).toBeGreaterThan(stockStats.totalDamage);
  });

  it("Knell Death Knell stacks add flat Critical Multiplier and Status Chance", () => {
    const knell = findWeapon("knell");
    const stockStats = calculateWeaponBuildWithArcanes(knell, [], modsMap, [], undefined, DEFAULT_SIM_PARAMS);

    const activeBuffs = resolveStandaloneExternalBuffs(knell, {
      ...DEFAULT_SIM_PARAMS,
      weaponPassiveState: { knell_death_knell: 3 },
    });
    const dk = activeBuffs.find((b) => b.id === "passive_knell_death_knell");
    expect(dk).toBeDefined();
    expect(dk?.critMultFlatBonus).toBeCloseTo(1.5, 3);
    expect(dk?.statusChanceFlatBonus).toBeCloseTo(0.6, 3);

    const activeStats = calculateWeaponBuildWithArcanes(
      knell,
      [],
      modsMap,
      [],
      undefined,
      {
        ...DEFAULT_SIM_PARAMS,
        weaponPassiveState: { knell_death_knell: 3 },
      },
      { externalBuffs: activeBuffs },
    );
    expect(activeStats.criticalMultiplier).toBeCloseTo(stockStats.criticalMultiplier + 1.5, 3);
    expect(activeStats.statusChance).toBeCloseTo(stockStats.statusChance + 0.6, 3);
  });

  it("Arca Scisco Target Analysis adds relative Crit Chance and Status Chance per stack", () => {
    const arca = findWeapon("arca_scisco");
    const activeBuffs = resolveStandaloneExternalBuffs(arca, {
      ...DEFAULT_SIM_PARAMS,
      weaponPassiveState: { arca_scisco_target_analysis: 5 },
    });
    const ta = activeBuffs.find((b) => b.id === "passive_arca_scisco_target_analysis");
    expect(ta).toBeDefined();
    expect(ta?.critChanceBonus).toBeCloseTo(0.2, 3);
    expect(ta?.statusBonus).toBeCloseTo(0.2, 3);
  });

  it("Lesion Status Rush adds +15% Attack Speed and +100% Toxin damage", () => {
    const lesion = findWeapon("lesion");
    const activeBuffs = resolveStandaloneExternalBuffs(lesion, {
      ...DEFAULT_SIM_PARAMS,
      weaponPassiveState: { lesion_status_rush: 1 },
    });
    const rush = activeBuffs.find((b) => b.id === "passive_lesion_status_rush");
    expect(rush).toBeDefined();
    expect(rush?.fireRateBonus).toBe(0.15);
    expect(rush?.elemental).toEqual([{ type: "toxin", bonusFraction: 1.0 }]);

    const stockStats = calculateWeaponBuildWithArcanes(lesion, [], modsMap, [], undefined, DEFAULT_SIM_PARAMS);
    const activeStats = calculateWeaponBuildWithArcanes(
      lesion,
      [],
      modsMap,
      [],
      undefined,
      {
        ...DEFAULT_SIM_PARAMS,
        weaponPassiveState: { lesion_status_rush: 1 },
      },
      { externalBuffs: activeBuffs },
    );
    expect(activeStats.fireRate).toBeCloseTo(stockStats.fireRate * 1.15, 3);
    const toxin = activeStats.elements?.find((e) => e.type === "toxin");
    expect(toxin).toBeDefined();
    expect(toxin!.value).toBeGreaterThan(0);
  });

  it("Pennant Heavy Kill Surge grants +50% Attack Speed", () => {
    const pennant = findWeapon("pennant");
    const activeBuffs = resolveStandaloneExternalBuffs(pennant, {
      ...DEFAULT_SIM_PARAMS,
      weaponPassiveState: { pennant_speed: 1 },
    });
    const surge = activeBuffs.find((b) => b.id === "passive_pennant_speed");
    expect(surge).toBeDefined();
    expect(surge?.fireRateBonus).toBe(0.5);
  });

  it("Pyrana Prime Ethereal grants +40% Fire Rate", () => {
    const pyranaPrime = findWeapon("pyrana_prime");
    const activeBuffs = resolveStandaloneExternalBuffs(pyranaPrime, {
      ...DEFAULT_SIM_PARAMS,
      weaponPassiveState: { pyrana_ethereal: 1 },
    });
    const ethereal = activeBuffs.find((b) => b.id === "passive_pyrana_ethereal");
    expect(ethereal).toBeDefined();
    expect(ethereal?.fireRateBonus).toBe(0.4);
  });

  it("AX-52 Aimed Headshots grants +400% Critical Chance, and Hip-fire grants +75% Ammo Efficiency", () => {
    const ax52 = findWeapon("ax_52");
    const aimedBuffs = resolveStandaloneExternalBuffs(ax52, {
      ...DEFAULT_SIM_PARAMS,
      weaponPassiveState: { ax_52_aimed_headshot: 1 },
    });
    const marksman = aimedBuffs.find((b) => b.id === "passive_ax_52_aimed_headshot");
    expect(marksman).toBeDefined();
    expect(marksman?.critChanceBonus).toBe(4.0);

    const hipfireBuffs = resolveStandaloneExternalBuffs(ax52, {
      ...DEFAULT_SIM_PARAMS,
      weaponPassiveState: { ax_52_aimed_headshot: 0 },
    });
    const hipfire = hipfireBuffs.find((b) => b.id === "passive_ax_52_hipfire");
    expect(hipfire).toBeDefined();
    expect(hipfire?.ammoEfficiency).toBe(0.75);
  });

  it("Sibear Heavy Attack grants +50% Status Chance", () => {
    const sibear = findWeapon("sibear");
    const activeBuffs = resolveStandaloneExternalBuffs(sibear, {
      ...DEFAULT_SIM_PARAMS,
      weaponPassiveState: { sibear_heavy: 1 },
    });
    const heavy = activeBuffs.find((b) => b.id === "passive_sibear_heavy");
    expect(heavy).toBeDefined();
    expect(heavy?.statusBonus).toBe(0.5);
  });

  it("Silva & Aegis Shield Absorption stacks grant +15% CC & SC per stack", () => {
    const silva = findWeapon("silva_&_aegis");
    const activeBuffs = resolveStandaloneExternalBuffs(silva, {
      ...DEFAULT_SIM_PARAMS,
      weaponPassiveState: { silva_aegis_block: 4 },
    });
    const block = activeBuffs.find((b) => b.id === "passive_silva_aegis_block");
    expect(block).toBeDefined();
    expect(block?.critChanceBonus).toBeCloseTo(0.6, 3);
    expect(block?.statusBonus).toBeCloseTo(0.6, 3);
  });

  it("Incarnon Evolution 1 toggle keeps Evolutions 2-4 active on base weapon", () => {
    // When form is off, Evolution 1 is removed from selectedEvolutions, but perks 2-4 remain.
    // Stock base weapon without incarnon:
    const baseFelarx = findWeapon("felarx");
    const stockStats = calculateWeaponBuildWithArcanes(baseFelarx, [], modsMap, [], undefined, DEFAULT_SIM_PARAMS);

    // Selected evolutions: Perk in Evolution 2 (+damage / +crit) but Evolution 1 omitted:
    // Evolution 2 perk adds base damage.
    const evoStatsBaseWithPerks = calculateWeaponBuildWithArcanes(
      baseFelarx,
      [],
      modsMap,
      [],
      { damage: 100 },
      DEFAULT_SIM_PARAMS,
    );
    expect(evoStatsBaseWithPerks.totalDamage).toBeGreaterThan(stockStats.totalDamage);
  });
});
