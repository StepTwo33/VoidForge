import { describe, expect, it } from "vitest";
import { modsMap } from "@/data/mods";
import { allWarframes } from "@/data/warframes";
import { allWeapons } from "@/data/weapons";
import { warframeArcanes } from "@/data/arcanes";
import { getMeleeExaltedWeapon, getPrimaryExaltedWeapon } from "@/lib/weapons/exalted-weapons";
import {
  applyWarframePassivePostArcanes,
  applyWarframePassivePreArcanes,
  applyWarframeShardsAndArcanes,
  calculateWarframeBuild,
  calculateWeaponBuild,
  DEFAULT_WARFRAME_PASSIVE_SIM,
  resolveDefaultOffWarframeArcaneStacks,
  resolveExaltedPassiveBuffs,
} from "@/lib/calc/calculator";
import { DEFAULT_SIM_PARAMS } from "@/lib/types";

function wf(id: string) {
  const found = allWarframes.find((w) => w.id === id);
  if (!found) throw new Error(`Missing warframe ${id}`);
  return found;
}

describe("Warframe Builder passive simulation & default-off conditionals", () => {
  it("defaults all conditional Warframe passive sim inputs to 0 / false", () => {
    expect(DEFAULT_WARFRAME_PASSIVE_SIM).toEqual({
      proteaPowerBars: 0,
      emberHeatEnemies: 0,
      emberImmolationHeatPct: 0,
      frostColdEnemies: 0,
      grendelGutEnemies: 0,
      gaussBatteryPct: 0,
      baruukRestraintErodedPct: 0,
      citrineGeolumOrbs: 0,
      templeBackbeatActive: false,
      valkyrRagePct: 0,
      garudaKillStacks: 0,
      cyteWeakPointKills: 0,
      nidusMutationStacks: 0,
    });
  });

  it("wires Protea Power Bars to Ability Strength (0..2 = +0%, 3 = +100% -> 200% STR)", () => {
    const protea = wf("protea_prime");

    const baseStats = calculateWarframeBuild(protea, [], modsMap);
    applyWarframePassivePreArcanes(protea.id, baseStats, DEFAULT_WARFRAME_PASSIVE_SIM);
    expect(baseStats.abilityStrength).toBeCloseTo(1.0, 5);

    const twoBars = calculateWarframeBuild(protea, [], modsMap);
    applyWarframePassivePreArcanes(protea.id, twoBars, { proteaPowerBars: 2 });
    expect(twoBars.abilityStrength).toBeCloseTo(1.0, 5);

    const threeBars = calculateWarframeBuild(protea, [], modsMap);
    applyWarframePassivePreArcanes(protea.id, threeBars, { proteaPowerBars: 3 });
    expect(threeBars.abilityStrength).toBeCloseTo(2.0, 5);

    // Verify Blaze Artillery damage scales from 500 (0 bars) to 1000 (3 bars)
    const blaze = protea.abilities.find((a) => a.name === "Blaze Artillery")!;
    expect(blaze.damage * baseStats.abilityStrength).toBeCloseTo(500, 5);
    expect(blaze.damage * threeBars.abilityStrength).toBeCloseTo(1000, 5);

    // Arcane Expertise reads Ability Strength modified by Protea's passive when pre-arcane runs first
    const expertise = warframeArcanes.find((a) => a.id === "arcane_expertise") ?? null;
    if (expertise) {
      const sOff = calculateWarframeBuild(protea, [], modsMap);
      applyWarframePassivePreArcanes(protea.id, sOff, { proteaPowerBars: 0 });
      applyWarframeShardsAndArcanes(sOff, [], [expertise, null], [5, 5]);

      const sOn = calculateWarframeBuild(protea, [], modsMap);
      applyWarframePassivePreArcanes(protea.id, sOn, { proteaPowerBars: 3 });
      applyWarframeShardsAndArcanes(sOn, [], [expertise, null], [5, 5]);

      expect(sOn.totalShield).toBeGreaterThan(sOff.totalShield);
    }
  });

  it("wires Ember Heat Enemies to Ability Strength and Temple Backbeat to Ability Efficiency", () => {
    const ember = wf("ember_prime");
    const emberOff = calculateWarframeBuild(ember, [], modsMap);
    applyWarframePassivePreArcanes(ember.id, emberOff, DEFAULT_WARFRAME_PASSIVE_SIM);
    expect(emberOff.abilityStrength).toBeCloseTo(1.0, 5);

    const emberOn = calculateWarframeBuild(ember, [], modsMap);
    applyWarframePassivePreArcanes(ember.id, emberOn, { emberHeatEnemies: 6 });
    expect(emberOn.abilityStrength).toBeCloseTo(1.3, 5);

    const temple = wf("temple");
    const templeOff = calculateWarframeBuild(temple, [], modsMap);
    applyWarframePassivePreArcanes(temple.id, templeOff, DEFAULT_WARFRAME_PASSIVE_SIM);
    expect(templeOff.abilityEfficiency).toBeCloseTo(1.0, 5);

    const templeOn = calculateWarframeBuild(temple, [], modsMap);
    applyWarframePassivePreArcanes(temple.id, templeOn, { templeBackbeatActive: true });
    expect(templeOn.abilityEfficiency).toBeCloseTo(1.5, 5);
  });

  it("wires Frost Cold Enemies and Grendel Gut Enemies flat armor into Armor, DR, EHP, and Arcane Persistence", () => {
    const frost = wf("frost_prime");
    const frostOff = calculateWarframeBuild(frost, [], modsMap);
    applyWarframePassivePreArcanes(frost.id, frostOff, DEFAULT_WARFRAME_PASSIVE_SIM);

    const frostOn = calculateWarframeBuild(frost, [], modsMap);
    applyWarframePassivePreArcanes(frost.id, frostOn, { frostColdEnemies: 6 });
    expect(frostOn.totalArmor).toBe(frostOff.totalArmor + 300);
    expect(frostOn.effectiveHealth).toBeGreaterThan(frostOff.effectiveHealth);

    const grendel = wf("grendel_prime");
    const persistence = warframeArcanes.find((a) => a.id === "arcane_persistence") ?? null;
    const gOff = calculateWarframeBuild(grendel, [], modsMap);
    applyWarframePassivePreArcanes(grendel.id, gOff, { grendelGutEnemies: 0 });
    if (persistence) {
      applyWarframeShardsAndArcanes(gOff, [], [persistence, null], [5, 5]);
      expect(gOff.persistenceActive).toBe(false);
    }

    const gOn = calculateWarframeBuild(grendel, [], modsMap);
    applyWarframePassivePreArcanes(grendel.id, gOn, { grendelGutEnemies: 3 });
    expect(gOn.totalArmor).toBe(gOff.totalArmor + 750);
    if (persistence) {
      applyWarframeShardsAndArcanes(gOn, [], [persistence, null], [5, 5]);
      expect(gOn.persistenceActive).toBe(true);
    }
  });

  it("wires Gauss Battery shield recharge, Citrine Geoluminesence regen, and Baruuk Restraint pure DR", () => {
    const gauss = wf("gauss_prime");
    const gaussOff = calculateWarframeBuild(gauss, [], modsMap);
    applyWarframePassivePreArcanes(gauss.id, gaussOff, { gaussBatteryPct: 0 });
    expect(gaussOff.shieldRechargeBonus ?? 0).toBe(0);
    expect(gaussOff.shieldRechargeDelayReduction ?? 0).toBe(0);

    const gaussFull = calculateWarframeBuild(gauss, [], modsMap);
    applyWarframePassivePreArcanes(gauss.id, gaussFull, { gaussBatteryPct: 100 });
    expect(gaussFull.shieldRechargeBonus).toBeCloseTo(1.2, 5);
    expect(gaussFull.shieldRechargeDelayReduction).toBeCloseTo(0.8, 5);

    const citrine = wf("citrine");
    const cit0 = calculateWarframeBuild(citrine, [], modsMap);
    applyWarframePassivePreArcanes(citrine.id, cit0, { citrineGeolumOrbs: 0 });
    expect(cit0.healthRegenPerSec).toBeCloseTo(5, 5);

    const citMax = calculateWarframeBuild(citrine, [], modsMap);
    applyWarframePassivePreArcanes(citrine.id, citMax, { citrineGeolumOrbs: 200 });
    expect(citMax.healthRegenPerSec).toBeCloseTo(25, 5);

    const baruuk = wf("baruuk_prime");
    const bar0 = calculateWarframeBuild(baruuk, [], modsMap);
    applyWarframeShardsAndArcanes(bar0, [], [null, null], [5, 5]);
    applyWarframePassivePostArcanes(baruuk.id, bar0, { baruukRestraintErodedPct: 0 });

    const bar100 = calculateWarframeBuild(baruuk, [], modsMap);
    applyWarframeShardsAndArcanes(bar100, [], [null, null], [5, 5]);
    applyWarframePassivePostArcanes(baruuk.id, bar100, { baruukRestraintErodedPct: 100 });
    expect(bar100.damageReduction).toBeGreaterThan(bar0.damageReduction);
    expect(bar100.effectiveHealth).toBeCloseTo(bar0.effectiveHealth * 2, 0);
  });

  it("wires Exalted weapon passives (Valkyr Rage, Garuda Death's Gate, Excalibur Swordsmanship, Cyte-09 Practiced Aim)", () => {
    const talons = getPrimaryExaltedWeapon("valkyr_prime", allWeapons) ?? getMeleeExaltedWeapon("valkyr_prime", allWeapons);
    expect(talons).not.toBeNull();
    const valkOff = calculateWeaponBuild(talons!, [], modsMap, undefined, undefined, {
      abilityStrength: 1,
      externalBuffs: resolveExaltedPassiveBuffs("valkyr_prime", talons!, { valkyrRagePct: 0 }),
    });
    const valkMax = calculateWeaponBuild(talons!, [], modsMap, undefined, undefined, {
      abilityStrength: 1,
      externalBuffs: resolveExaltedPassiveBuffs("valkyr_prime", talons!, { valkyrRagePct: 300 }),
    });
    expect(valkMax.totalDamage).toBeCloseTo(valkOff.totalDamage * 4, 1);

    const garudaTalons = getPrimaryExaltedWeapon("garuda_prime", allWeapons) ?? getMeleeExaltedWeapon("garuda_prime", allWeapons);
    expect(garudaTalons).not.toBeNull();
    const garOff = calculateWeaponBuild(garudaTalons!, [], modsMap, undefined, undefined, {
      abilityStrength: 1,
      externalBuffs: resolveExaltedPassiveBuffs("garuda_prime", garudaTalons!, { garudaKillStacks: 0 }),
    });
    const garMax = calculateWeaponBuild(garudaTalons!, [], modsMap, undefined, undefined, {
      abilityStrength: 1,
      externalBuffs: resolveExaltedPassiveBuffs("garuda_prime", garudaTalons!, { garudaKillStacks: 20 }),
    });
    expect(garMax.burstDps).toBeCloseTo(garOff.burstDps * 2, 0);

    const excalBlade = getPrimaryExaltedWeapon("excalibur_umbra", allWeapons) ?? getMeleeExaltedWeapon("excalibur_umbra", allWeapons);
    expect(excalBlade).not.toBeNull();
    const excalPlain = calculateWeaponBuild(excalBlade!, [], modsMap, undefined, undefined, { abilityStrength: 1 });
    const excalWithPassive = calculateWeaponBuild(excalBlade!, [], modsMap, undefined, undefined, {
      abilityStrength: 1,
      externalBuffs: resolveExaltedPassiveBuffs("excalibur_umbra", excalBlade!, DEFAULT_WARFRAME_PASSIVE_SIM),
    });
    expect(excalWithPassive.fireRate).toBeCloseTo(excalPlain.fireRate * 1.1, 4);
    expect(excalWithPassive.burstDps).toBeGreaterThan(excalPlain.burstDps);

    const neutralizer = getPrimaryExaltedWeapon("cyte_09", allWeapons)!;
    expect(neutralizer).not.toBeNull();
    const cyteOff = calculateWeaponBuild(
      neutralizer,
      [],
      modsMap,
      undefined,
      { ...DEFAULT_SIM_PARAMS, applyHeadshots: false },
      {
        abilityStrength: 1,
        externalBuffs: resolveExaltedPassiveBuffs("cyte_09", neutralizer, { cyteWeakPointKills: 0 }),
      },
    );
    const cyteWp = calculateWeaponBuild(
      neutralizer,
      [],
      modsMap,
      undefined,
      { ...DEFAULT_SIM_PARAMS, applyHeadshots: true },
      {
        abilityStrength: 1,
        externalBuffs: resolveExaltedPassiveBuffs("cyte_09", neutralizer, { cyteWeakPointKills: 200 }),
      },
    );
    expect(cyteWp.criticalChance).toBeCloseTo(cyteOff.criticalChance * 3, 4);
  });

  it("Cyte-09 weak-point kills do not apply the headshot damage model on body shots", () => {
    const neutralizer = getPrimaryExaltedWeapon("cyte_09", allWeapons)!;
    const opts = (kills: number) => ({
      abilityStrength: 1,
      externalBuffs: resolveExaltedPassiveBuffs("cyte_09", neutralizer, { cyteWeakPointKills: kills }),
    });
    const body0 = calculateWeaponBuild(neutralizer, [], modsMap, undefined, { ...DEFAULT_SIM_PARAMS }, opts(0));
    const body1 = calculateWeaponBuild(neutralizer, [], modsMap, undefined, { ...DEFAULT_SIM_PARAMS }, opts(1));
    expect(body1.burstDps).toBeCloseTo(body0.burstDps, 4);
    expect(body1.totalDamage).toBeCloseTo(body0.totalDamage, 4);

    const weak0 = calculateWeaponBuild(
      neutralizer,
      [],
      modsMap,
      undefined,
      { ...DEFAULT_SIM_PARAMS, applyWeakPoints: true },
      opts(0),
    );
    const weak1 = calculateWeaponBuild(
      neutralizer,
      [],
      modsMap,
      undefined,
      { ...DEFAULT_SIM_PARAMS, applyWeakPoints: true },
      opts(1),
    );
    expect(weak1.criticalChance).toBeGreaterThan(weak0.criticalChance);
    expect(weak1.criticalChance - weak0.criticalChance).toBeLessThan(0.02);
    expect(weak1.burstDps / weak0.burstDps).toBeLessThan(1.05);

    const head0 = calculateWeaponBuild(
      neutralizer,
      [],
      modsMap,
      undefined,
      { ...DEFAULT_SIM_PARAMS, applyHeadshots: true },
      opts(0),
    );
    expect(head0.burstDps).toBeGreaterThan(body0.burstDps * 1.5);
    expect(weak0.burstDps).toBeLessThan(head0.burstDps);
  });

  it("defaults conditional Warframe arcanes to 0 stacks in Warframe Builder while preserving passive arcanes and user overrides", () => {
    const moltAugmented = warframeArcanes.find((a) => a.id === "molt_augmented")!;
    const moltEfficiency = warframeArcanes.find((a) => a.id === "molt_efficiency")!;
    const arcaneGuardian = warframeArcanes.find((a) => a.id === "arcane_guardian")!;
    const arcaneBellicose = warframeArcanes.find((a) => a.id === "arcane_bellicose")!;

    const map1 = resolveDefaultOffWarframeArcaneStacks([moltAugmented, moltEfficiency], {});
    expect(map1.molt_augmented).toBe(0);
    expect(map1.molt_efficiency).toBeUndefined();

    const map2 = resolveDefaultOffWarframeArcaneStacks([arcaneGuardian, arcaneBellicose], {});
    expect(map2.arcane_guardian).toBe(0);
    expect(map2.arcane_bellicose).toBeUndefined();

    const mapOverridden = resolveDefaultOffWarframeArcaneStacks([moltAugmented, arcaneGuardian], {
      molt_augmented: 250,
      arcane_guardian: 1,
    });
    expect(mapOverridden.molt_augmented).toBe(250);
    expect(mapOverridden.arcane_guardian).toBe(1);

    // Verify calculator leaves Protea at 100% STR when Molt Augmented is newly equipped without override
    const protea = wf("protea");
    const paper = calculateWarframeBuild(protea, [], modsMap);
    applyWarframeShardsAndArcanes(paper, [], [moltAugmented, moltEfficiency], [5, 5], {
      arcaneStacksById: map1,
    });
    expect(paper.abilityStrength).toBeCloseTo(1.0, 5);
    expect(paper.abilityDuration).toBeCloseTo(1.36, 5);
  });
});
