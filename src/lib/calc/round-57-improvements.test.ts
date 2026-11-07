/**
 * Round 57 — Incarnon Adapter ON/OFF, Weapon/Exalted Arcane Ranks,
 * Riven Family / Modular / OCR / Expected Ranges, Cross-Slot Loadout Buffs,
 * Conditional Toggles, and Loadout Combat & TTK Enemy Priming + Blast U36.
 */
import { describe, expect, it } from "vitest";
import { modsMap } from "@/data/mods";
import { allWeapons } from "@/data/weapons";
import { allWarframes } from "@/data/warframes";
import { allCompanions } from "@/data/companions";
import { incarnonDataMap } from "@/data/incarnon";
import { allArcanes, warframeArcanes } from "@/data/arcanes";
import {
  kitgunChambers,
  kitgunGrips,
  kitgunLoaders,
  buildKitgun,
  zawStrikes,
  zawGrips,
  zawLinks,
  buildZaw,
} from "@/data/modular-weapons";
import {
  effectiveIncarnonEvolutions,
  incarnonGenesisFormTrigger,
  isIncarnonFormActive,
  resolveIncarnonActiveWeapon,
  resolveIncarnonGenesisInstalled,
} from "@/lib/calc/incarnon-active-weapon";
import { mergeIncarnonStatChanges } from "@/lib/calc/weapon-stat-merges";
import {
  applyWarframeShardsAndArcanes,
  calculateWarframeBuild,
  calculateWeaponBuild,
  calculateWeaponBuildWithArcanes,
} from "@/lib/calc/calculator";
import {
  calcLoadoutStats,
  calcSavedWeaponBuildStats,
  setBonusLinkageFromLoadout,
} from "@/lib/builds/loadout-stats";
import { resolveActiveArcaneList, resolveActiveSavedArcanes } from "@/lib/builds/build-storage";
import { decodeBuild, encodeBuild } from "@/lib/builds/build-url";
import { resolveRivenWeapon, getRivenBaseWeapon } from "@/lib/weapons/riven-family";
import { getRivenWeaponType, getRivenModIdForWeapon } from "@/lib/weapons/riven-weapon-type";
import { parseRivenOcrText } from "@/lib/rivens/riven-ocr";
import { computeDpsContributions } from "@/lib/calc/dps-contributions";
import {
  computeLoadoutAuraArmorStripPct,
  resolveStandaloneExternalBuffs,
  resolveWeaponExternalBuffs,
} from "@/lib/weapons/weapon-external-buffs";
import { getWeaponArcanes } from "@/lib/weapons/weapon-arcane-config";
import { calculateTTK, ENEMY_TYPES } from "@/lib/calc/ttk";
import { DEFAULT_SIM_PARAMS, type Loadout, type ModSlot } from "@/lib/types";

const weapon = (id: string) => allWeapons.find((w) => w.id === id)!;
const warframe = (id: string) => allWarframes.find((w) => w.id === id)!;

describe("round 57: Incarnon Genesis Adapter ON/OFF toggle", () => {
  it("disables Evolution II-IV stat perks, Incarnon Form, and Cannonade block when toggled OFF while preserving picks", () => {
    const id = "burston_prime";
    const w = weapon(id);
    const incData = incarnonDataMap.get(id)!;
    const formSlot = incData.evolutions.find((e) => e.tier === 1 && /incarnon\s*form/i.test(e.name))!.slot;
    const picks: Record<number, number> = { 1: formSlot, 2: 1, 4: 1 };

    // Adapter ON (explicit true or inferred)
    const onEvos = effectiveIncarnonEvolutions(incData, picks, true);
    expect(Object.keys(onEvos).length).toBe(3);
    expect(resolveIncarnonGenesisInstalled(incData, picks, true)).toBe(true);
    expect(isIncarnonFormActive(onEvos, incData)).toBe(true);
    expect(incarnonGenesisFormTrigger(incData, true)).toBeTruthy();

    const activeOn = resolveIncarnonActiveWeapon(w, incData, onEvos, {});
    const statChangesOn = mergeIncarnonStatChanges(incData, onEvos, id, {
      formActive: isIncarnonFormActive(onEvos, incData),
    });
    const statsOn = calculateWeaponBuild(activeOn, [], modsMap, statChangesOn, undefined, {
      incarnonFormActive: true,
    });

    // Adapter OFF (incarnonGenesisInstalled = false)
    const offEvos = effectiveIncarnonEvolutions(incData, picks, false);
    expect(offEvos).toEqual({});
    expect(resolveIncarnonGenesisInstalled(incData, picks, false)).toBe(false);
    expect(isIncarnonFormActive(offEvos, incData)).toBe(false);
    expect(incarnonGenesisFormTrigger(incData, false)).toBeUndefined();

    const activeOff = resolveIncarnonActiveWeapon(w, incData, offEvos, {});
    const statChangesOff = mergeIncarnonStatChanges(incData, offEvos, id, {
      formActive: false,
    });
    const statsOff = calculateWeaponBuild(activeOff, [], modsMap, statChangesOff);
    const vanillaStats = calculateWeaponBuild(w, [], modsMap);

    expect(statsOff.burstDps).toBeCloseTo(vanillaStats.burstDps, 5);
    expect(statsOn.burstDps).not.toBeCloseTo(statsOff.burstDps, 1);

    // Saved build helper respects incarnonGenesisInstalled: false even when evolutions are saved
    const savedOff = calcSavedWeaponBuildStats({
      weaponId: id,
      mods: [],
      incarnonEvolutions: picks,
      incarnonGenesisInstalled: false,
    });
    const savedOn = calcSavedWeaponBuildStats({
      weaponId: id,
      mods: [],
      incarnonEvolutions: picks,
      incarnonGenesisInstalled: true,
    });
    expect(savedOff!.stats.burstDps).toBeCloseTo(vanillaStats.burstDps, 4);
    expect(savedOn!.stats.burstDps).not.toBeCloseTo(savedOff!.stats.burstDps, 1);
  });

  it("applies Okina Swordsman's Celerity (+30% Movement Speed) to Warframe in Loadout only when Adapter is ON", () => {
    const okinaId = incarnonDataMap.has("okina_prime") ? "okina_prime" : "okina";
    const okinaData = incarnonDataMap.get(okinaId)!;
    const celerityEvo = okinaData.evolutions.find((e) => e.name === "Swordsman's Celerity")!;
    expect(celerityEvo).toBeDefined();

    const baseLoadout: Loadout = {
      id: "test-okina-speed",
      name: "Okina Mobility",
      createdAt: 0,
      updatedAt: 0,
      warframeBuild: {
        warframeId: "volt",
        mods: [],
        hasOrokinReactor: true,
      },
      meleeBuild: {
        weaponId: okinaId,
        mods: [],
        hasOrokinCatalyst: true,
        incarnonEvolutions: { [celerityEvo.tier]: celerityEvo.slot },
        incarnonGenesisInstalled: true,
      },
    };

    const statsAdapterOn = calcLoadoutStats(baseLoadout);
    const voltBaseSprint = warframe("volt").sprintSpeed;
    expect(statsAdapterOn.warframe!.stats.totalSprint).toBeCloseTo(voltBaseSprint * 1.3, 4);

    const statsAdapterOff = calcLoadoutStats({
      ...baseLoadout,
      meleeBuild: {
        ...baseLoadout.meleeBuild!,
        incarnonGenesisInstalled: false,
      },
    });
    expect(statsAdapterOff.warframe!.stats.totalSprint).toBeCloseTo(voltBaseSprint, 4);
  });
});

describe("round 57: Weapon & Exalted Arcane rank scaling", () => {
  it("scales Primary Merciless from R0 (+5%/stack, 1/6 max) to R5 (+30%/stack, full max) and preserves slot alignment", () => {
    const w = weapon("burston_prime");
    const merciless = allArcanes.find((a) => a.id === "arcane_primary_merciless")!;
    expect(merciless).toBeDefined();

    const sim = { ...DEFAULT_SIM_PARAMS, arcaneStacks: 12 };
    const base = calculateWeaponBuild(w, [], modsMap, undefined, sim);
    const r0 = calculateWeaponBuildWithArcanes(w, [], modsMap, [merciless], undefined, sim, {
      arcaneRanks: [0],
    });
    const r5 = calculateWeaponBuildWithArcanes(w, [], modsMap, [merciless], undefined, sim, {
      arcaneRanks: [5],
    });

    // R0 = +60% damage (1.6x), R5 = +360% damage (4.6x)
    expect(r0.totalDamage / base.totalDamage).toBeCloseTo(1.6, 2);
    expect(r5.totalDamage / base.totalDamage).toBeCloseTo(4.6, 2);

    // Slot 0 empty + Slot 1 equipped at R2 preserves rank 2 via resolveActiveArcaneList / resolveActiveSavedArcanes
    const aligned = resolveActiveArcaneList([null, merciless], [5, 2]);
    expect(aligned.arcanes).toHaveLength(1);
    expect(aligned.arcaneRanks).toEqual([2]);

    const savedAligned = resolveActiveSavedArcanes([null, "arcane_primary_merciless"], [5, 2], 2);
    expect(savedAligned.arcanes).toHaveLength(1);
    expect(savedAligned.arcaneRanks).toEqual([2]);

    // Share URL round-trips arcaneRanks
    const encoded = encodeBuild({
      type: "weapon",
      itemId: "burston_prime",
      mods: [],
      arcanes: ["arcane_primary_merciless"],
      arcaneRanks: [3],
      hasOrokinCatalyst: true,
      isMR30: false,
    });
    const decoded = decodeBuild(encoded);
    expect(decoded?.arcaneRanks).toEqual([3]);
  });
});

describe("round 57: Riven family resolution, companion pools, and OCR polish", () => {
  it("resolves assembled Kitguns and Zaws back to canonical chamber/strike and correct stat pool", () => {
    const chamber = kitgunChambers.find((c) => c.id === "sporelacer_chamber")!;
    const grip = kitgunGrips.find((g) => g.type === "primary")!;
    const loader = kitgunLoaders[0]!;
    const primaryKitgun = buildKitgun(chamber, grip, loader);

    // Even a primary-grip Kitgun uses Kitgun riven mod & Pistol stat pool!
    expect(getRivenModIdForWeapon(primaryKitgun)).toBe("kitgun_riven_mod");
    expect(getRivenWeaponType(primaryKitgun)).toBe("Pistol");

    const resolvedChamber = resolveRivenWeapon(primaryKitgun.id);
    expect(resolvedChamber).not.toBeNull();
    expect(resolvedChamber!.name.toLowerCase()).toContain("sporelacer");
    expect(getRivenBaseWeapon(primaryKitgun.id).name.toLowerCase()).toContain("sporelacer");

    const strike = zawStrikes.find((s) => s.id === "zaw_sepfahn")!;
    const zGrip = zawGrips[0]!;
    const zLink = zawLinks[0]!;
    const assembledZaw = buildZaw(strike, zGrip, zLink);
    expect(getRivenModIdForWeapon(assembledZaw)).toBe("zaw_riven_mod");
    expect(getRivenWeaponType(assembledZaw)).toBe("Melee");
    const resolvedStrike = resolveRivenWeapon(assembledZaw.id);
    expect(resolvedStrike).not.toBeNull();
    expect(resolvedStrike!.name.toLowerCase()).toContain("sepfahn");

    // Companion weapons resolve to their real Shotgun / Melee / Rifle / Pistol stat pool
    const sweeper = allWeapons.find((w) => w.id === "sweeper_prime" || w.id === "sweeper")!;
    expect(getRivenModIdForWeapon(sweeper)).toBe("companion_weapon_riven_mod");
    expect(getRivenWeaponType(sweeper)).toBe("Shotgun");

    const akaten = allWeapons.find((w) => w.id === "akaten");
    if (akaten) {
      expect(getRivenWeaponType(akaten)).toBe("Melee");
    }
  });

  it("parses modern x1.45 / x0.65 faction multipliers and negative recoil without misflagging as unranked", () => {
    const parsed = parseRivenOcrText(
      [
        "Burston Crita-acriata",
        "+165.4% Critical Chance",
        "x1.45 Damage to Grineer",
        "-72.4% Weapon Recoil",
        "x0.65 Damage to Corpus",
        "MR 14",
      ].join("\n"),
    );
    const posMap = Object.fromEntries(parsed.positiveStats.map((s) => [s.key, s.value]));
    expect(posMap.criticalChance).toBeCloseTo(1.654, 4);
    expect(posMap.factionGrineer).toBeCloseTo(0.45, 4);
    // Negative recoil (-72.4% Weapon Recoil) is a positive buff in Warframe (stored as +0.724 in positiveStats)!
    expect(posMap.recoil).toBeCloseTo(0.724, 4);
    expect(parsed.negativeStat?.key).toBe("factionCorpus");
    expect(parsed.negativeStat?.value).toBeCloseTo(0.35, 4);
    expect(parsed.isLikelyUnranked).toBeFalsy();
  });
});

describe("round 57: Cross-slot loadout buffs & conditionals", () => {
  it("applies Tenacious Bond (+1.2x final CD) with Companion Riven / Hunter Synergy and Amalgam Furax Body Count (+45% Secondary FR)", () => {
    const comp = allCompanions.find((c) => c.type === "sentinel") ?? allCompanions[0]!;
    const vulklok = allWeapons.find((w) => w.name === "Vulklok")!;
    const loadout: Loadout = {
      id: "test-cross-slot",
      name: "Cross Slot Synergy",
      createdAt: 0,
      updatedAt: 0,
      warframeBuild: {
        warframeId: "yareli",
        mods: [],
        hasOrokinReactor: true,
      },
      primaryBuild: {
        weaponId: "burston_prime",
        mods: [{ modId: "point_strike_r3", rank: 5, slotIndex: 0 }],
        hasOrokinCatalyst: true,
      },
      secondaryBuild: {
        weaponId: "lex_prime",
        mods: [],
        hasOrokinCatalyst: true,
      },
      meleeBuild: {
        weaponId: "furax_wraith",
        mods: [{ modId: "amalgam_furax_body_count", rank: 5, slotIndex: 0 }],
        hasOrokinCatalyst: true,
      },
      companionBuild: {
        companionId: comp.id,
        mods: [{ modId: "tenacious_bond", rank: 5, slotIndex: 0 }],
        weaponId: vulklok.id,
        weaponMods: [{ modId: "point_strike_r3", rank: 5, slotIndex: 0 }],
        hasReactor: true,
        hasCatalyst: true,
      },
    };

    const sim = {
      ...DEFAULT_SIM_PARAMS,
      applyTenaciousBondCrit: true,
      applyYareliCriticalFlow: true,
      applyZephyrAirborne: false,
    };
    const stats = calcLoadoutStats(loadout, { simParams: sim });
    const lexBase = weapon("lex_prime");
    // Vulklok (35% base CC * 2.5 Point Strike = 87.5% >= 50%) triggers Tenacious Bond (+1.2x final CD)!
    expect(stats.secondary!.stats.criticalMultiplier).toBeCloseTo(lexBase.criticalMultiplier + 1.2, 2);
    // Amalgam Furax Body Count adds +45% Secondary Fire Rate!
    expect(stats.secondary!.stats.fireRate).toBeCloseTo(lexBase.fireRate * 1.45, 3);
    // Yareli Critical Flow adds +200% Secondary Crit Chance!
    expect(stats.secondary!.stats.criticalChance).toBeCloseTo(lexBase.criticalChance * 3, 3);

    // Marginal DPS contributions include Amalgam Furax Body Count and Tenacious Bond!
    const linkage = setBonusLinkageFromLoadout(loadout);
    const buffs = resolveWeaponExternalBuffs(
      lexBase,
      {
        warframeId: "yareli",
        warframeStats: stats.warframe!.stats,
        companionModSlots: loadout.companionBuild!.mods,
        companionWeaponCritChance: stats.companion!.weapon!.stats.criticalChance,
        allMods: modsMap,
      },
      sim,
    );
    const contrib = computeDpsContributions({
      baseWeapon: lexBase,
      modSlots: [],
      allMods: modsMap,
      arcanes: [],
      simParams: sim,
      calcOptions: { externalBuffs: buffs },
      linkage,
      warframeId: "yareli",
      companionModIds: ["tenacious_bond"],
    });
    expect(contrib.some((r) => r.label.includes("Amalgam Furax Body Count"))).toBe(true);
    expect(contrib.some((r) => r.label.includes("Tenacious Bond"))).toBe(true);
  });

  it("toggles 1-stack conditional Warframe arcanes (Arcane Sculptor & Arcane Guardian) ON vs OFF and fixes Amber Shard parkourVelocity", () => {
    const volt = warframe("volt");
    const sculptor = warframeArcanes.find((a) => a.id === "arcane_sculptor")!;
    expect(sculptor).toBeDefined();

    const onSculptor = applyWarframeShardsAndArcanes(
      calculateWarframeBuild(volt, [], modsMap),
      [null, null, null, null, null],
      [sculptor, null],
      [5, 5],
      { arcaneStacksById: { arcane_sculptor: 1 } },
    );
    const offSculptor = applyWarframeShardsAndArcanes(
      calculateWarframeBuild(volt, [], modsMap),
      [null, null, null, null, null],
      [sculptor, null],
      [5, 5],
      { arcaneStacksById: { arcane_sculptor: 0 } },
    );
    // Sculptor R5 grants +175% Ability Efficiency when active, 0% when toggled OFF
    expect(onSculptor.abilityEfficiency).toBeGreaterThan(offSculptor.abilityEfficiency);
    expect(offSculptor.abilityEfficiency).toBeCloseTo(1.0, 4);

    const guardian = warframeArcanes.find((a) => a.id === "arcane_guardian");
    if (guardian) {
      const onGuardian = applyWarframeShardsAndArcanes(
        calculateWarframeBuild(volt, [], modsMap),
        [null, null, null, null, null],
        [guardian, null],
        [5, 5],
        { arcaneStacksById: { arcane_guardian: 1 } },
      );
      const offGuardian = applyWarframeShardsAndArcanes(
        calculateWarframeBuild(volt, [], modsMap),
        [null, null, null, null, null],
        [guardian, null],
        [5, 5],
        { arcaneStacksById: { arcane_guardian: 0 } },
      );
      expect(onGuardian.totalArmor).toBeCloseTo(offGuardian.totalArmor + 900, 3);
    }

    // Amber Archon Shard parkourVelocity: +15% Tauforged = +0.15 fractional (NOT +1500%!)
    const withAmber = applyWarframeShardsAndArcanes(
      calculateWarframeBuild(volt, [], modsMap),
      [
        {
          shardId: "amber_tauforged",
          shardColor: "amber",
          shardTier: 2,
          selectedBonus: "parkourVelocity",
          bonusValue: 15,
          slotIndex: 0,
        },
        null,
        null,
        null,
        null,
      ],
      [null, null],
      [5, 5],
    );
    expect(withAmber.parkourVelocityBonus).toBeCloseTo(0.15, 5);
  });
});

describe("round 57: Enemy priming & Blast U36 Status Duration / 10-stack premature detonation", () => {
  it("reduces TTK when enemy is pre-primed with Viral + Heat strip + Armor Strip", () => {
    const w = weapon("burston_prime");
    const modSlots: ModSlot[] = [
      { modId: "serration_r3", rank: 10, slotIndex: 0 },
      { modId: "point_strike_r3", rank: 5, slotIndex: 1 },
    ];
    const stats = calculateWeaponBuild(w, modSlots, modsMap);
    const gunner = ENEMY_TYPES.find((e) => e.id === "arid_heavy_gunner")!;

    const unprimed = calculateTTK(stats, gunner, 60, { steelPath: false });
    const primed = calculateTTK(stats, gunner, 60, {
      steelPath: false,
      primedViralStacks: 10,
      primedCorrosiveStacks: 8,
      primedHeatStrip: true,
      armorStripPct: 50,
    });
    expect(unprimed.ttk).toBeLessThan(Infinity);
    expect(primed.ttk).toBeLessThan(unprimed.ttk * 0.4);
  });

  it("detonates Blast stacks immediately at 10 stacks (300% per stack) and scales fuse with Status Duration", () => {
    const blastGun = {
      ...weapon("braton_prime"),
      triggerType: "Auto",
      impact: 0,
      puncture: 0,
      slash: 0,
      blast: 800,
      damage: 800,
      statusChance: 1.5, // guaranteed Blast proc every shot
      fireRate: 20, // 20 shots/sec -> reaches 10 stacks in 0.5s (well before 3.0s fuse!)
      multishot: 1,
      magazine: 200,
      ammoMax: 5000,
    };
    const statsLongDur = calculateWeaponBuild(
      blastGun,
      [{ modId: "continuous_misery", rank: 3, slotIndex: 0 }], // +100% Status Duration -> 3.0s single-stack fuse
      modsMap,
    );
    expect(statsLongDur.statusDurationBonus).toBeCloseTo(1.0, 3);

    const tank = ENEMY_TYPES.find((e) => e.id === "arid_heavy_gunner")!;
    // At 20 shots/sec with 100% Blast proc, 10 stacks accumulate every 0.5s and detonate immediately
    // even though single-stack fuse is 3.0s! Compare against 0% SC control to prove Blast detonated < 3.0s.
    const statsNoProc = calculateWeaponBuild(
      { ...blastGun, statusChance: 0 },
      [],
      modsMap,
    );
    const ttkRes = calculateTTK(statsLongDur, tank, 50, { steelPath: false });
    const ttkNoProc = calculateTTK(statsNoProc, tank, 50, { steelPath: false });
    expect(ttkRes.ttk).toBeLessThan(3.0);
    expect(ttkRes.ttk).toBeLessThan(ttkNoProc.ttk);

    // Conversely, at 1 shot/sec (<10 stacks), +100% Status Duration lengthens the Blast fuse (1.5s -> 3.0s).
    const slowBlastGun = { ...blastGun, fireRate: 1, damage: 2500, blast: 2500 };
    const slowBase = calculateWeaponBuild(slowBlastGun, [], modsMap);
    const slowLong = calculateWeaponBuild(
      slowBlastGun,
      [{ modId: "continuous_misery", rank: 3, slotIndex: 0 }],
      modsMap,
    );
    const ttkSlowBase = calculateTTK(slowBase, tank, 35, { steelPath: false });
    const ttkSlowLong = calculateTTK(slowLong, tank, 35, { steelPath: false });
    expect(ttkSlowLong.ttk).toBeGreaterThan(ttkSlowBase.ttk);
  });
});

describe("round 57: Sirocco Amp arcanes, Virtuos rank scaling, Warframe conditional mods, and Loadout Auras/Passives", () => {
  it("exposes 2 Amp Arcane slots on Sirocco and scales Virtuos Ghost by rank (R0 vs R3)", () => {
    const sirocco = weapon("sirocco");
    const cfg = getWeaponArcanes(sirocco);
    expect(cfg.slots).toBe(2);
    expect(cfg.label).toBe("Amp Arcane");

    const ghost = allArcanes.find((a) => a.id === "virtuos_ghost")!;
    expect(ghost.maxRank).toBe(3);

    const sim = {
      ...DEFAULT_SIM_PARAMS,
      arcaneStacks: 1,
      applyTriggerBuffs: true,
      applyHeadshots: true,
    };
    const base = calculateWeaponBuild(sirocco, [], modsMap, undefined, sim);
    const r0 = calculateWeaponBuildWithArcanes(sirocco, [], modsMap, [ghost], undefined, sim, {
      arcaneRanks: [0],
    });
    const r3 = calculateWeaponBuildWithArcanes(sirocco, [], modsMap, [ghost], undefined, sim, {
      arcaneRanks: [3],
    });
    // Virtuos Ghost maxRank 3: R0 = 1/4 of +60% (+15% SC), R3 = full +60% SC
    expect(r3.statusChance).toBeGreaterThan(r0.statusChance);
    expect(r0.statusChance).toBeGreaterThan(base.statusChance);
  });

  it("toggles Warframe conditional mods (Growing Power & Health Conversion -> Arcane Persistence) and Loadout Paper vs Mid-fight Sculptor", () => {
    const volt = warframe("volt");
    const wfMods: ModSlot[] = [
      { modId: "growing_power", rank: 5, slotIndex: 0 },
      { modId: "augment_universal_health_conversion", rank: 5, slotIndex: 1 },
    ];
    const baseStats = calculateWarframeBuild(volt, wfMods, modsMap);
    // Paper default: conditional lines are OFF until toggled ON
    expect(baseStats.abilityStrength).toBeCloseTo(1.0, 4);
    expect(baseStats.totalArmor).toBeCloseTo(volt.armor, 4);

    const persistence = warframeArcanes.find((a) => a.id === "arcane_persistence");
    const activeStats = applyWarframeShardsAndArcanes(
      baseStats,
      [null, null, null, null, null],
      [persistence ?? null, null],
      [5, 5],
      {
        equippedModSlots: wfMods,
        conditionalModStacksById: {
          growing_power: 1,
          augment_universal_health_conversion: 3, // 3 * 450 = +1350 flat armor (>= 700 threshold!)
        },
      },
    );
    expect(activeStats.abilityStrength).toBeCloseTo(1.25, 4);
    expect(activeStats.totalArmor).toBeCloseTo(volt.armor + 1350, 3);
    if (persistence) {
      expect(activeStats.persistenceActive).toBe(true);
    }

    // Loadout scenario: Paper turns Arcane Sculptor OFF (100% Eff), Mid-fight turns it ON (+175% Eff)
    const loadout: Loadout = {
      id: "test-sculptor-scenarios",
      name: "Sculptor Scenario Test",
      createdAt: 0,
      updatedAt: 0,
      warframeBuild: {
        warframeId: "volt",
        mods: [{ modId: "growing_power", rank: 5, slotIndex: 0 }],
        arcaneIds: ["arcane_sculptor", null],
        arcaneRanks: [5, 5],
        hasOrokinReactor: true,
      },
    };
    const paper = calcLoadoutStats(loadout, { scenario: "paper" });
    const midFight = calcLoadoutStats(loadout, { scenario: "midFight" });
    expect(paper.warframe!.stats.abilityEfficiency).toBeCloseTo(1.0, 4);
    expect(paper.warframe!.stats.abilityStrength).toBeCloseTo(1.0, 4);
    expect(midFight.warframe!.stats.abilityEfficiency).toBeGreaterThan(1.7);
    expect(midFight.warframe!.stats.abilityStrength).toBeCloseTo(1.25, 4);
  });

  it("keeps standalone Weapon Builder external buffs OFF by default and activates them when toggled ON", () => {
    const lex = weapon("lex_prime");
    expect(resolveStandaloneExternalBuffs(lex, DEFAULT_SIM_PARAMS)).toEqual([]);

    const toggledBuffs = resolveStandaloneExternalBuffs(lex, {
      ...DEFAULT_SIM_PARAMS,
      applyYareliCriticalFlow: true,
      applyTenaciousBondCrit: true,
      applyReinforcedBondFireRate: true,
      applyGarudaDeathsGate: true,
    });
    expect(toggledBuffs.map((b) => b.id)).toEqual(
      expect.arrayContaining([
        "passive_yareli_critical_flow",
        "passive_garuda_deaths_gate",
        "companion:tenacious_bond",
        "companion:reinforced_bond",
      ]),
    );
    const stats = calculateWeaponBuild(lex, [], modsMap, undefined, DEFAULT_SIM_PARAMS, {
      externalBuffs: toggledBuffs,
    });
    expect(stats.criticalChance).toBeCloseTo(lex.criticalChance * 3, 4);
    expect(stats.criticalMultiplier).toBeCloseTo(lex.criticalMultiplier + 1.2, 2);
    expect(stats.fireRate).toBeCloseTo(lex.fireRate * 1.6, 4);
    expect(stats.totalDamage).toBeCloseTo(lex.damage * 2, 3);
  });

  it("applies Loadout Warframe Auras (Rifle Amp + Coaction Drift, Steel Charge, Ready Steel, Corrosive Projection) and Passives (Mesa, Excalibur, Kullervo, Saryn, Garuda, Khora)", () => {
    // 1. Rifle Amp + Coaction Drift on Primary + Corrosive Projection armor strip helper
    const auraLoadout: Loadout = {
      id: "test-auras",
      name: "Aura Synergy",
      createdAt: 0,
      updatedAt: 0,
      warframeBuild: {
        warframeId: "saryn",
        mods: [
          { modId: "aura_rifle_amplification", rank: 5, slotIndex: 8 },
          { modId: "coaction_drift", rank: 5, slotIndex: 9 },
        ],
        hasOrokinReactor: true,
      },
      primaryBuild: {
        weaponId: "burston_prime",
        mods: [],
        hasOrokinCatalyst: true,
      },
    };
    const burstonBase = calculateWeaponBuild(weapon("burston_prime"), [], modsMap);
    const auraRes = calcLoadoutStats(auraLoadout, { scenario: "paper" });
    // Rifle Amp (+27%) * Coaction Drift (1.15^2 = 1.3225) = +35.7075% base damage!
    expect(auraRes.primary!.stats.totalDamage / burstonBase.totalDamage).toBeCloseTo(
      1 + 0.27 * 1.3225,
      4,
    );
    // Saryn passive: +25% Status Duration!
    expect(auraRes.primary!.stats.statusDurationBonus).toBeCloseTo(0.25, 4);

    // Corrosive Projection + Coaction Drift = 18% * 1.15 = 20.7% armor strip (Wiki: enemy-debuffing
    // auras only scale with Squad Aura Strength +15%, not personal Aura Effectiveness double-dip).
    expect(
      computeLoadoutAuraArmorStripPct([
        { modId: "aura_corrosive_projection", rank: 5, slotIndex: 8 },
        { modId: "coaction_drift", rank: 5, slotIndex: 9 },
      ]),
    ).toBeCloseTo(20.7, 4);

    // Growing Power + Coaction Drift: Wiki Growing Power Notes — Coaction Drift does NOT scale Growing Power (+25% flat).
    const gpCoaction = applyWarframeShardsAndArcanes(
      calculateWarframeBuild(warframe("volt"), [], modsMap),
      [null, null, null, null, null],
      [null, null],
      [5, 5],
      {
        equippedModSlots: [
          { modId: "growing_power", rank: 5, slotIndex: 8 },
          { modId: "coaction_drift", rank: 5, slotIndex: 9 },
        ],
        conditionalModStacksById: { growing_power: 1 },
      },
    );
    expect(gpCoaction.abilityStrength).toBeCloseTo(1.25, 4);

    // Rifle Amp applies to Sniper Rifles (category === "sniper", e.g. Vectis / Rubico), excluding Shotguns.
    const vectis = weapon("vectis");
    const vectisBase = calculateWeaponBuild(vectis, [], modsMap);
    const sniperAuraRes = calcLoadoutStats(
      {
        id: "test-sniper-rifle-amp",
        name: "Sniper Rifle Amp",
        createdAt: 0,
        updatedAt: 0,
        warframeBuild: {
          warframeId: "volt",
          mods: [{ modId: "aura_rifle_amplification", rank: 5, slotIndex: 8 }],
        },
        primaryBuild: { weaponId: "vectis", mods: [] },
      },
      { scenario: "paper" },
    );
    expect(sniperAuraRes.primary!.stats.totalDamage / vectisBase.totalDamage).toBeCloseTo(1.27, 4);

    // 2. Excalibur + Steel Charge + Ready Steel on Nikana Prime
    const nikanaId = allWeapons.some((w) => w.id === "nikana_prime") ? "nikana_prime" : "skana";
    const nikanaBase = weapon(nikanaId);
    const excalLoadout: Loadout = {
      id: "test-excal-melee",
      name: "Excalibur Swordmaster",
      createdAt: 0,
      updatedAt: 0,
      warframeBuild: {
        warframeId: "excalibur",
        mods: [
          { modId: "aura_steel_charge", rank: 5, slotIndex: 8 },
          { modId: "ready_steel", rank: 5, slotIndex: 0 },
        ],
        hasOrokinReactor: true,
      },
      meleeBuild: {
        weaponId: nikanaId,
        mods: [],
        hasOrokinCatalyst: true,
      },
    };
    const nikanaBaseCalc = calculateWeaponBuild(nikanaBase, [], modsMap);
    const excalRes = calcLoadoutStats(excalLoadout, { scenario: "paper" });
    // Steel Charge (+60%) + Excalibur Swordsmanship (+10%) = +70% additive melee damage; +10% attack speed; +24 initial combo
    expect(excalRes.melee!.stats.totalDamage / nikanaBaseCalc.totalDamage).toBeCloseTo(1.7, 2);
    expect(excalRes.melee!.stats.fireRate / nikanaBaseCalc.fireRate).toBeCloseTo(1.1, 3);
    expect(excalRes.melee!.stats.heavyAttackInitialCombo).toBe(
      (nikanaBaseCalc.heavyAttackInitialCombo ?? 0) + 24,
    );
    expect(excalRes.melee!.stats.comboCount).toBe(nikanaBaseCalc.comboCount + 24);

    // Ready Steel + Coaction Drift truncates 24 * 1.3225 = 31.74 -> 31 Initial Combo (Wiki: 31 + 30 Corrupt Charge = 61 -> 4x).
    const readyCoactionRes = calcLoadoutStats(
      {
        id: "test-ready-steel-coaction",
        name: "Ready Steel Coaction",
        createdAt: 0,
        updatedAt: 0,
        warframeBuild: {
          warframeId: "volt",
          mods: [
            { modId: "ready_steel", rank: 5, slotIndex: 8 },
            { modId: "coaction_drift", rank: 5, slotIndex: 9 },
          ],
        },
        meleeBuild: { weaponId: nikanaId, mods: [] },
      },
      { scenario: "paper" },
    );
    expect(readyCoactionRes.melee!.stats.heavyAttackInitialCombo).toBe(
      (nikanaBaseCalc.heavyAttackInitialCombo ?? 0) + 31,
    );

    // Holster Amp applies to Melee (+60% on equip, non-Exalted), whereas Vigorous Swap (+165%) applies to Primary/Secondary only.
    const swapSim = { ...DEFAULT_SIM_PARAMS, applyTriggerBuffs: true };
    const swapMeleeRes = calcLoadoutStats(
      {
        id: "test-holster-vs-vigorous",
        name: "Swap Mods Scope",
        createdAt: 0,
        updatedAt: 0,
        warframeBuild: {
          warframeId: "volt",
          mods: [
            { modId: "holster_amp", rank: 5, slotIndex: 8 },
            { modId: "vigorous_swap", rank: 10, slotIndex: 0 },
          ],
        },
        primaryBuild: { weaponId: "burston_prime", mods: [] },
        meleeBuild: { weaponId: nikanaId, mods: [] },
      },
      { simParams: swapSim },
    );
    // Primary gets both Holster Amp (+60%) + Vigorous Swap (+165%) = +225% (3.25x); Melee gets only Holster Amp (+60% = 1.6x)!
    expect(swapMeleeRes.primary!.stats.totalDamage / burstonBase.totalDamage).toBeCloseTo(3.25, 3);
    expect(swapMeleeRes.melee!.stats.totalDamage / nikanaBaseCalc.totalDamage).toBeCloseTo(1.6, 3);

    // Excalibur Swordsmanship excludes Two-Handed Nikanas (Tatsu) and Dual Nikanas (Sun & Moon).
    for (const excludedId of ["tatsu", "sun_and_moon"]) {
      const excluded = allWeapons.find((w) => w.id === excludedId);
      if (!excluded) continue;
      const excludedBase = calculateWeaponBuild(excluded, [], modsMap);
      const excludedRes = calcLoadoutStats(
        {
          id: `test-excal-exclude-${excludedId}`,
          name: "Excal Excluded",
          createdAt: 0,
          updatedAt: 0,
          warframeBuild: { warframeId: "excalibur", mods: [] },
          meleeBuild: { weaponId: excludedId, mods: [] },
        },
        { scenario: "paper" },
      );
      expect(excludedRes.melee!.stats.totalDamage).toBeCloseTo(excludedBase.totalDamage, 4);
    }

    // 3. MesaMarksman: +25% reload on 1H Lex Prime, +50 Health when no melee equipped
    const mesaNoMelee: Loadout = {
      id: "test-mesa",
      name: "Mesa Gunslinger",
      createdAt: 0,
      updatedAt: 0,
      warframeBuild: {
        warframeId: "mesa",
        mods: [],
        hasOrokinReactor: true,
      },
      secondaryBuild: {
        weaponId: "lex_prime",
        mods: [],
        hasOrokinCatalyst: true,
      },
    };
    const mesaBaseWf = calculateWarframeBuild(warframe("mesa"), [], modsMap);
    const lexBase = weapon("lex_prime");
    const mesaRes = calcLoadoutStats(mesaNoMelee, { scenario: "paper" });
    expect(mesaRes.warframe!.stats.totalHealth).toBe(mesaBaseWf.totalHealth + 50);
    expect(mesaRes.secondary!.stats.reloadTime).toBeCloseTo(lexBase.reloadTime / 1.25, 3);

    // 4. Kullervo (+75% HAE, +100% Heavy Wind-Up), Garuda Death's Gate (2x in midFight), Khora Venari (+15% Sprint in midFight)
    const kullervoRes = calcLoadoutStats(
      {
        id: "test-kullervo",
        name: "Kullervo Heavy",
        createdAt: 0,
        updatedAt: 0,
        warframeBuild: { warframeId: "kullervo", mods: [] },
        meleeBuild: { weaponId: nikanaId, mods: [] },
      },
      { scenario: "paper" },
    );
    expect(kullervoRes.melee!.stats.heavyAttackEfficiency).toBeCloseTo(0.75, 4);

    const garudaPaper = calcLoadoutStats(
      {
        id: "test-garuda",
        name: "Garuda Blood",
        createdAt: 0,
        updatedAt: 0,
        warframeBuild: { warframeId: "garuda", mods: [] },
        primaryBuild: { weaponId: "burston_prime", mods: [] },
      },
      { scenario: "paper" },
    );
    const garudaMid = calcLoadoutStats(
      {
        id: "test-garuda",
        name: "Garuda Blood",
        createdAt: 0,
        updatedAt: 0,
        warframeBuild: { warframeId: "garuda", mods: [] },
        primaryBuild: { weaponId: "burston_prime", mods: [] },
      },
      { scenario: "midFight" },
    );
    expect(garudaMid.primary!.stats.totalDamage / garudaPaper.primary!.stats.totalDamage).toBeCloseTo(
      2.0,
      3,
    );

    const khoraPaper = calcLoadoutStats(
      {
        id: "test-khora",
        name: "Khora Venari",
        createdAt: 0,
        updatedAt: 0,
        warframeBuild: { warframeId: "khora", mods: [] },
      },
      { scenario: "paper" },
    );
    const khoraMid = calcLoadoutStats(
      {
        id: "test-khora",
        name: "Khora Venari",
        createdAt: 0,
        updatedAt: 0,
        warframeBuild: { warframeId: "khora", mods: [] },
      },
      { scenario: "midFight" },
    );
    expect(khoraMid.warframe!.stats.totalSprint).toBeCloseTo(
      khoraPaper.warframe!.stats.totalSprint + warframe("khora").sprintSpeed * 0.15,
      4,
    );
  });
});
